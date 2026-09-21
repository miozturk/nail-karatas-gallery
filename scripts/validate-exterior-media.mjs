import assert from 'node:assert/strict'
import { readFile, stat } from 'node:fs/promises'
import { resolve } from 'node:path'
import { fileURLToPath } from 'node:url'

const repositoryRoot = resolve(fileURLToPath(new URL('..', import.meta.url)))
const expectedImages = [
  'scenes/project/masterplan.webp',
  'scenes/project/block-a.webp',
  'scenes/project/block-b.webp',
  'scenes/project/block-c.webp',
]
const expectedVideos = [
  'transitions/project/home-to-a.mp4',
  'transitions/project/home-to-b.mp4',
  'transitions/project/home-to-c.mp4',
  'transitions/project/a-to-home.mp4',
  'transitions/project/b-to-home.mp4',
  'transitions/project/c-to-home.mp4',
]

function readWebpSize(buffer) {
  assert.equal(buffer.toString('ascii', 0, 4), 'RIFF')
  assert.equal(buffer.toString('ascii', 8, 12), 'WEBP')
  const chunk = buffer.toString('ascii', 12, 16)
  if (chunk === 'VP8 ') {
    assert.deepEqual([...buffer.subarray(23, 26)], [0x9d, 0x01, 0x2a])
    return {
      width: buffer.readUInt16LE(26) & 0x3fff,
      height: buffer.readUInt16LE(28) & 0x3fff,
    }
  }
  if (chunk === 'VP8L') {
    assert.equal(buffer[20], 0x2f)
    const bits = buffer.readUInt32LE(21)
    return { width: (bits & 0x3fff) + 1, height: ((bits >>> 14) & 0x3fff) + 1 }
  }
  if (chunk === 'VP8X') {
    return {
      width: buffer.readUIntLE(24, 3) + 1,
      height: buffer.readUIntLE(27, 3) + 1,
    }
  }
  assert.fail(`Unsupported WebP chunk: ${chunk}`)
}

function findBox(buffer, type) {
  const marker = Buffer.from(type, 'ascii')
  const typeOffset = buffer.indexOf(marker)
  assert(typeOffset >= 4, `MP4 box ${type} is missing`)
  const start = typeOffset - 4
  const size = buffer.readUInt32BE(start)
  assert(size >= 8 && start + size <= buffer.length, `MP4 box ${type} has an invalid size`)
  return { start, size }
}

function createBitReader(bytes) {
  let bitOffset = 0

  function readBit() {
    assert(bitOffset < bytes.length * 8, 'Unexpected end of H.264 SPS data')
    const value = (bytes[bitOffset >> 3] >> (7 - (bitOffset & 7))) & 1
    bitOffset += 1
    return value
  }

  function readBits(count) {
    let value = 0
    for (let index = 0; index < count; index += 1) value = (value << 1) | readBit()
    return value
  }

  function readUnsignedExpGolomb() {
    let leadingZeroBits = 0
    while (readBit() === 0) leadingZeroBits += 1
    return ((2 ** leadingZeroBits) - 1) + readBits(leadingZeroBits)
  }

  return { readBit, readBits, readUnsignedExpGolomb }
}

function removeEmulationPreventionBytes(bytes) {
  const result = []
  for (let index = 0; index < bytes.length; index += 1) {
    if (index >= 2 && bytes[index] === 0x03 && bytes[index - 1] === 0x00 && bytes[index - 2] === 0x00) continue
    result.push(bytes[index])
  }
  return Buffer.from(result)
}

function readAvcPixelFormat(buffer) {
  const avcConfiguration = findBox(buffer, 'avcC')
  const dataOffset = avcConfiguration.start + 8
  assert.equal(buffer[dataOffset], 1, 'Unsupported AVC decoder configuration version')
  assert((buffer[dataOffset + 5] & 0x1f) > 0, 'H.264 stream must contain an SPS')

  const sequenceLength = buffer.readUInt16BE(dataOffset + 6)
  const sequenceStart = dataOffset + 8
  const sequence = buffer.subarray(sequenceStart, sequenceStart + sequenceLength)
  assert(sequence.length > 1, 'H.264 SPS is missing')
  assert.equal(sequence[0] & 0x1f, 7, 'H.264 configuration must begin with an SPS NAL unit')

  const reader = createBitReader(removeEmulationPreventionBytes(sequence.subarray(1)))
  const profileIdc = reader.readBits(8)
  reader.readBits(8)
  reader.readBits(8)
  reader.readUnsignedExpGolomb()

  const extendedProfiles = new Set([44, 83, 86, 100, 110, 118, 122, 128, 134, 135, 138, 139, 144, 244])
  if (!extendedProfiles.has(profileIdc)) return 'yuv420p'

  const chromaFormatIdc = reader.readUnsignedExpGolomb()
  const separateColourPlane = chromaFormatIdc === 3 ? reader.readBit() : 0
  const bitDepthLuma = 8 + reader.readUnsignedExpGolomb()
  const bitDepthChroma = 8 + reader.readUnsignedExpGolomb()

  if (chromaFormatIdc === 1 && separateColourPlane === 0 && bitDepthLuma === 8 && bitDepthChroma === 8) {
    return 'yuv420p'
  }
  return `chroma-${chromaFormatIdc}-${bitDepthLuma}bit-${bitDepthChroma}bit`
}

function readMp4Metadata(buffer) {
  assert.equal(buffer.toString('ascii', 4, 8), 'ftyp')
  const mvhd = findBox(buffer, 'mvhd')
  const mvhdVersion = buffer[mvhd.start + 8]
  const timescaleOffset = mvhd.start + (mvhdVersion === 1 ? 28 : 20)
  const durationOffset = mvhd.start + (mvhdVersion === 1 ? 32 : 24)
  const timescale = buffer.readUInt32BE(timescaleOffset)
  const durationUnits = mvhdVersion === 1
    ? Number(buffer.readBigUInt64BE(durationOffset))
    : buffer.readUInt32BE(durationOffset)
  assert(timescale > 0)

  const tkhd = findBox(buffer, 'tkhd')
  const width = buffer.readUInt32BE(tkhd.start + tkhd.size - 8) / 65536
  const height = buffer.readUInt32BE(tkhd.start + tkhd.size - 4) / 65536
  const codec = buffer.includes(Buffer.from('av01'))
    ? 'av01'
    : buffer.includes(Buffer.from('avc1')) ? 'avc1' : 'unknown'
  const sampleTable = findBox(buffer, 'stsz')
  const sampleCount = buffer.readUInt32BE(sampleTable.start + 16)
  const duration = durationUnits / timescale
  const frameRate = sampleCount / duration
  const pixelFormat = codec === 'avc1' ? readAvcPixelFormat(buffer) : 'unknown'
  return { width, height, duration, codec, frameRate, pixelFormat }
}

for (const relativePath of expectedImages) {
  const path = resolve(repositoryRoot, 'public/media', relativePath)
  const [buffer, fileStat] = await Promise.all([readFile(path), stat(path)])
  const dimensions = readWebpSize(buffer)
  assert.deepEqual(dimensions, { width: 1920, height: 1440 }, `${relativePath} must be 1920 x 1440`)
  assert(fileStat.size > 0)
  console.log(`PASS ${relativePath}: ${fileStat.size} bytes, ${dimensions.width}x${dimensions.height}`)
}

for (const relativePath of expectedVideos) {
  const path = resolve(repositoryRoot, 'public/media', relativePath)
  const [buffer, fileStat] = await Promise.all([readFile(path), stat(path)])
  const metadata = readMp4Metadata(buffer)
  assert.equal(metadata.width, 1920, `${relativePath} width`)
  assert.equal(metadata.height, 1440, `${relativePath} height`)
  assert(Math.abs(metadata.duration - 1) <= 0.05, `${relativePath} duration must be approximately 1 second`)
  assert.equal(metadata.frameRate, 24, `${relativePath} frame rate must be 24 fps`)
  assert.equal(metadata.codec, 'avc1', `${relativePath} must use H.264 / AVC (avc1); AV1 delivery is rejected`)
  assert.equal(metadata.pixelFormat, 'yuv420p', `${relativePath} must use browser-compatible 8-bit 4:2:0 video`)
  console.log(`PASS ${relativePath}: ${fileStat.size} bytes, ${metadata.width}x${metadata.height}, ${metadata.duration.toFixed(3)}s, ${metadata.frameRate.toFixed(3)} fps, ${metadata.codec}, ${metadata.pixelFormat}`)
}

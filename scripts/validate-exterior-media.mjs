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
  return { width, height, duration: durationUnits / timescale, codec }
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
  assert(metadata.duration > 0, `${relativePath} duration`)
  assert.notEqual(metadata.codec, 'unknown', `${relativePath} codec`)
  console.log(`PASS ${relativePath}: ${fileStat.size} bytes, ${metadata.width}x${metadata.height}, ${metadata.duration.toFixed(3)}s, ${metadata.codec}`)
}

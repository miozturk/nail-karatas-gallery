import assert from 'node:assert/strict'
import { readdir, readFile } from 'node:fs/promises'
import { resolve } from 'node:path'
import { fileURLToPath } from 'node:url'
import { createStagingServer } from './staging-server.mjs'

const repositoryRoot = resolve(fileURLToPath(new URL('..', import.meta.url)))
const distDirectory = resolve(repositoryRoot, 'dist')
const appRoutes = [
  '/',
  '/block/b',
  '/block/b/unit/B-301',
  '/block/b/unit/B-301/details',
  '/block/b/unit/B-301/tour',
  '/video',
  '/invalid-staging-proof',
  '/__dev/hotspot-editor',
  '/__dev/panorama-spike',
]
const media = [
  ['/media/scenes/project/masterplan.webp', 'image/webp'],
  ['/media/scenes/project/block-a.webp', 'image/webp'],
  ['/media/scenes/project/block-b.webp', 'image/webp'],
  ['/media/scenes/project/block-c.webp', 'image/webp'],
  ['/media/transitions/project/home-to-a.mp4', 'video/mp4'],
  ['/media/transitions/project/home-to-b.mp4', 'video/mp4'],
  ['/media/transitions/project/home-to-c.mp4', 'video/mp4'],
  ['/media/transitions/project/a-to-home.mp4', 'video/mp4'],
  ['/media/transitions/project/b-to-home.mp4', 'video/mp4'],
  ['/media/transitions/project/c-to-home.mp4', 'video/mp4'],
  ['/media/plans/project/plan-bc-t01.png', 'image/png'],
  ['/media/plans/project/plan-bc-t01-m.png', 'image/png'],
  ['/media/plans/project/plan-bc-t02.png', 'image/png'],
  ['/media/plans/project/plan-bc-t02-m.png', 'image/png'],
  ['/media/plans/project/plan-ticari.png', 'image/png'],
  ['/media/panoramas/dev/living-room.jpg', 'image/jpeg'],
  ['/media/panoramas/dev/hall.jpg', 'image/jpeg'],
  ['/media/panoramas/dev/bedroom.jpg', 'image/jpeg'],
  ['/media/video/project/video-animation.mp4', 'video/mp4'],
]
const removedProofMedia = [
  '/media/transitions/dev-transition-proof.mp4',
  '/media/transitions/dev-reverse-transition-proof.mp4',
  '/media/video/dev/project-video-proof.mp4',
]

async function listen(server) {
  await new Promise((resolvePromise, reject) => {
    server.once('error', reject)
    server.listen(0, '127.0.0.1', resolvePromise)
  })
  const address = server.address()
  assert(address && typeof address === 'object')
  return `http://127.0.0.1:${address.port}`
}

async function close(server) {
  await new Promise((resolvePromise, reject) => server.close((error) => error ? reject(error) : resolvePromise()))
}

async function getText(url, options) {
  const response = await fetch(url, options)
  return { response, text: await response.text() }
}

const server = createStagingServer({ distDirectory })
const baseUrl = await listen(server)

try {
  const routeResults = []
  for (const route of appRoutes) {
    const { response, text } = await getText(`${baseUrl}${route}`)
    assert.equal(response.status, 200, `${route} must return the SPA shell`)
    assert.match(response.headers.get('content-type') ?? '', /^text\/html\b/)
    assert.match(text, /<div id="root"><\/div>/, `${route} must contain the application root`)
    routeResults.push(`${route}=200 text/html`)
  }

  const indexHtml = await readFile(resolve(distDirectory, 'index.html'), 'utf8')
  const assetPaths = [...indexHtml.matchAll(/(?:src|href)="(\/assets\/[^"]+)"/g)].map((match) => match[1])
  assert(assetPaths.some((path) => path.endsWith('.js')), 'index.html must reference a generated JS asset')
  assert(assetPaths.some((path) => path.endsWith('.css')), 'index.html must reference a generated CSS asset')

  const assetResults = []
  for (const assetPath of assetPaths) {
    const response = await fetch(`${baseUrl}${assetPath}`)
    assert.equal(response.status, 200, `${assetPath} must be reachable`)
    const expectedType = assetPath.endsWith('.js') ? /^text\/javascript\b/ : /^text\/css\b/
    assert.match(response.headers.get('content-type') ?? '', expectedType)
    assetResults.push(`${assetPath}=200`)
  }

  const mediaResults = []
  for (const [mediaPath, contentType] of media) {
    const response = await fetch(`${baseUrl}${mediaPath}`, { headers: { Range: 'bytes=0-15' } })
    assert.equal(response.status, 206, `${mediaPath} must support byte-range requests`)
    assert.equal(response.headers.get('content-type'), contentType)
    assert.match(response.headers.get('content-range') ?? '', /^bytes 0-15\/\d+$/)
    mediaResults.push(`${mediaPath}=206 ${contentType}`)
  }

  const missingAsset = await fetch(`${baseUrl}/assets/missing-staging-proof.js`)
  assert.equal(missingAsset.status, 404, 'missing file requests must not receive the SPA shell')

  for (const mediaPath of removedProofMedia) {
    const response = await fetch(`${baseUrl}${mediaPath}`)
    assert.equal(response.status, 404, `${mediaPath} must not ship in the production output`)
  }

  const assetFiles = (await readdir(resolve(distDirectory, 'assets'), { recursive: true, withFileTypes: true }))
    .filter((entry) => entry.isFile())
    .map((entry) => resolve(entry.parentPath, entry.name))
  const textAssetFiles = assetFiles.filter((filePath) => /\.(?:css|js|map)$/.test(filePath))
  const productionText = [indexHtml, ...await Promise.all(textAssetFiles.map((filePath) => readFile(filePath, 'utf8')))].join('\n')

  for (const forbidden of [
    '/__dev/hotspot-editor',
    '/__dev/panorama-spike',
    'HotspotEditor',
    'PanoramaSpike',
    '/media/transitions/dev-transition-proof.mp4',
    '/media/transitions/dev-reverse-transition-proof.mp4',
    '/media/video/dev/project-video-proof.mp4',
  ]) {
    assert(!productionText.includes(forbidden), `production assets must exclude ${forbidden}`)
  }
  for (const forbidden of ['127.0.0.1', 'file://']) {
    assert(!productionText.includes(forbidden), `production assets must exclude ${forbidden}`)
  }
  assert(!/(?:localhost|127\.0\.0\.1):\d+/.test(productionText), 'production assets must exclude local development-server ports')
  assert(!/[A-Za-z]:\\/.test(productionText), 'production assets must exclude Windows filesystem paths')

  const sourceFiles = (await readdir(resolve(repositoryRoot, 'src'), { recursive: true, withFileTypes: true }))
    .filter((entry) => entry.isFile() && /\.(?:css|ts|tsx)$/.test(entry.name))
    .map((entry) => resolve(entry.parentPath, entry.name))
  const applicationSource = (await Promise.all(sourceFiles.map((filePath) => readFile(filePath, 'utf8')))).join('\n')
  for (const forbidden of ['localhost', '127.0.0.1', 'file://']) {
    assert(!applicationSource.includes(forbidden), `application source must exclude ${forbidden}`)
  }
  assert(!/[A-Za-z]:\\/.test(applicationSource), 'application source must exclude Windows filesystem paths')

  console.log(`PASS routes (${routeResults.length}): ${routeResults.join(', ')}`)
  console.log(`PASS entry assets (${assetResults.length}): ${assetResults.join(', ')}`)
  console.log(`PASS media (${mediaResults.length}): ${mediaResults.join(', ')}`)
  console.log('PASS missing/proof-file 404, DEV-route bundle isolation, localhost/port/filesystem hygiene')
} finally {
  await close(server)
}

// Provider-neutral local server for verifying the static production build.
// This is not a production backend and intentionally defines no API routes.
import { createReadStream } from 'node:fs'
import { stat } from 'node:fs/promises'
import { createServer } from 'node:http'
import { extname, isAbsolute, relative, resolve, sep } from 'node:path'
import { fileURLToPath } from 'node:url'

const repositoryRoot = resolve(fileURLToPath(new URL('..', import.meta.url)))

const contentTypes = new Map([
  ['.css', 'text/css; charset=utf-8'],
  ['.html', 'text/html; charset=utf-8'],
  ['.jpeg', 'image/jpeg'],
  ['.jpg', 'image/jpeg'],
  ['.js', 'text/javascript; charset=utf-8'],
  ['.json', 'application/json; charset=utf-8'],
  ['.map', 'application/json; charset=utf-8'],
  ['.mp4', 'video/mp4'],
  ['.png', 'image/png'],
  ['.svg', 'image/svg+xml; charset=utf-8'],
  ['.webp', 'image/webp'],
])

function isInside(root, candidate) {
  const pathFromRoot = relative(root, candidate)
  return pathFromRoot === '' || (!pathFromRoot.startsWith(`..${sep}`) && pathFromRoot !== '..' && !isAbsolute(pathFromRoot))
}

function parseRange(rangeHeader, size) {
  const match = /^bytes=(\d*)-(\d*)$/.exec(rangeHeader ?? '')
  if (!match) return null

  let start = match[1] === '' ? null : Number(match[1])
  let end = match[2] === '' ? null : Number(match[2])

  if (start === null) {
    const suffixLength = end
    if (!suffixLength || suffixLength <= 0) return null
    start = Math.max(size - suffixLength, 0)
    end = size - 1
  } else {
    end = end === null ? size - 1 : Math.min(end, size - 1)
  }

  if (!Number.isSafeInteger(start) || !Number.isSafeInteger(end) || start < 0 || start > end || start >= size) {
    return null
  }

  return { start, end }
}

async function sendFile(request, response, filePath) {
  const fileStat = await stat(filePath)
  const contentType = contentTypes.get(extname(filePath).toLowerCase()) ?? 'application/octet-stream'
  const rangeHeader = request.headers.range
  const range = rangeHeader ? parseRange(rangeHeader, fileStat.size) : null

  if (rangeHeader && !range) {
    response.writeHead(416, { 'Content-Range': `bytes */${fileStat.size}` })
    response.end()
    return
  }

  const headers = {
    'Accept-Ranges': 'bytes',
    'Content-Type': contentType,
  }

  if (range) {
    headers['Content-Length'] = String(range.end - range.start + 1)
    headers['Content-Range'] = `bytes ${range.start}-${range.end}/${fileStat.size}`
    response.writeHead(206, headers)
  } else {
    headers['Content-Length'] = String(fileStat.size)
    response.writeHead(200, headers)
  }

  if (request.method === 'HEAD') {
    response.end()
    return
  }

  createReadStream(filePath, range ?? undefined).pipe(response)
}

async function findFile(filePath) {
  try {
    return (await stat(filePath)).isFile() ? filePath : null
  } catch (error) {
    if (error?.code === 'ENOENT' || error?.code === 'ENOTDIR') return null
    throw error
  }
}

export function createStagingServer({ distDirectory = resolve(repositoryRoot, 'dist') } = {}) {
  const distRoot = resolve(distDirectory)
  const indexPath = resolve(distRoot, 'index.html')

  return createServer(async (request, response) => {
    try {
      if (request.method !== 'GET' && request.method !== 'HEAD') {
        response.writeHead(405, { Allow: 'GET, HEAD' })
        response.end('Method Not Allowed')
        return
      }

      const requestUrl = new URL(request.url ?? '/', 'http://staging.local')
      let pathname
      try {
        pathname = decodeURIComponent(requestUrl.pathname)
      } catch {
        response.writeHead(400)
        response.end('Bad Request')
        return
      }

      const requestedPath = resolve(distRoot, pathname.replace(/^\/+/, ''))
      if (!isInside(distRoot, requestedPath)) {
        response.writeHead(403)
        response.end('Forbidden')
        return
      }

      const requestedFile = await findFile(requestedPath)
      if (requestedFile) {
        await sendFile(request, response, requestedFile)
        return
      }

      if (extname(pathname)) {
        response.writeHead(404)
        response.end('Not Found')
        return
      }

      await sendFile(request, response, indexPath)
    } catch (error) {
      console.error(error)
      if (!response.headersSent) response.writeHead(error?.code === 'ENOENT' ? 503 : 500)
      response.end(error?.code === 'ENOENT' ? 'Run npm run staging:build first.' : 'Internal Server Error')
    }
  })
}

function readOption(name, fallback) {
  const index = process.argv.indexOf(name)
  return index === -1 ? fallback : process.argv[index + 1]
}

const invokedScript = process.argv[1] ? resolve(process.argv[1]) : ''
if (invokedScript === fileURLToPath(import.meta.url)) {
  const host = readOption('--host', '127.0.0.1')
  const port = Number(readOption('--port', '4173'))
  const distDirectory = resolve(readOption('--dist', resolve(repositoryRoot, 'dist')))
  const server = createStagingServer({ distDirectory })

  server.listen(port, host, () => {
    const address = server.address()
    const actualPort = typeof address === 'object' && address ? address.port : port
    console.log(`Staging build: http://${host}:${actualPort}`)
    console.log(`Serving: ${distDirectory}`)
  })
}

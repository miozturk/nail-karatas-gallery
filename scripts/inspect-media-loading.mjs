// DEVELOPMENT-ONLY diagnostic server. No deployment/cache-header configuration.
// node scripts/inspect-media-loading.mjs [--dev]
import { createServer, preview } from 'vite'

const development = process.argv.includes('--dev')
const trace = (server) => {
  server.middlewares.use((request, _response, next) => {
    if (/^\/(media\/|assets\/|src\/features\/tours\/|src\/panorama\/)/.test(request.url ?? '')) {
      console.log(`${request.method} ${request.url} range=${request.headers.range ?? '-'}`)
    }
    next()
  })
}
const options = { host: '127.0.0.1', port: development ? 5189 : 4189, strictPort: true }
const config = {
  plugins: [{ name: 'development-media-request-trace', configureServer: trace, configurePreviewServer: trace }],
  server: options,
  preview: options,
}
const server = development ? await createServer(config) : await preview(config)
if (development) await server.listen()
server.printUrls()

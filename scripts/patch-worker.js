#!/usr/bin/env node
// Patches .open-next/_worker.js to route /_next/static/ via env.ASSETS.
// Cloudflare Pages does not auto-serve underscore-prefixed directories.
const fs = require('fs')
const path = require('path')

const workerPath = path.join(__dirname, '..', '.open-next', '_worker.js')
let code = fs.readFileSync(workerPath, 'utf8')

const MARKER = 'ASSETS_PATCH_APPLIED'
if (code.includes(MARKER)) {
  console.log('patch-worker: already patched, skipping')
  process.exit(0)
}

const ANCHOR = '// - `Request`s are handled by the Next server'
const PATCH = `// ${MARKER}
            // Route /_next/static/ and public assets via env.ASSETS binding.
            // Cloudflare Pages does not serve _-prefixed directories automatically.
            if (env.ASSETS && (
                url.pathname.startsWith("/_next/static/") ||
                url.pathname.startsWith("/_next/media/") ||
                /\\.(ico|png|jpg|jpeg|svg|gif|webp|css|js|woff|woff2|ttf|eot|map)$/.test(url.pathname)
            )) {
                const assetResp = await env.ASSETS.fetch(request);
                if (assetResp.status !== 404) return assetResp;
            }
            ${ANCHOR}`

if (!code.includes(ANCHOR)) {
  console.error('patch-worker: anchor not found in _worker.js')
  process.exit(1)
}

code = code.replace(ANCHOR, PATCH)
fs.writeFileSync(workerPath, code)
console.log('patch-worker: patched successfully')

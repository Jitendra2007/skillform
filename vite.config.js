import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

const userUploadedHeroPath = 'C:/Users/swaro/.gemini/antigravity/brain/88c29544-b180-456f-988e-7e9920586ed6/.user_uploaded/media_1793345968632_48a7d094.png'
const publicDir = path.resolve(__dirname, 'public')
const targetHeroPath = path.join(publicDir, 'hero-banner.png')

// Ensure public directory exists and copy the high-res worker banner image
try {
  if (!fs.existsSync(publicDir)) {
    fs.mkdirSync(publicDir, { recursive: true })
  }
  if (fs.existsSync(userUploadedHeroPath)) {
    fs.copyFileSync(userUploadedHeroPath, targetHeroPath)
  }
} catch (err) {
  console.warn('Hero image copy notice:', err.message)
}

function serveHeroImagePlugin() {
  return {
    name: 'serve-hero-image-plugin',
    configureServer(server) {
      server.middlewares.use((req, res, next) => {
        const cleanUrl = req.url ? req.url.split('?')[0] : ''
        if (cleanUrl === '/hero-banner.png' || cleanUrl === '/public/hero-banner.png') {
          const imgToServe = fs.existsSync(targetHeroPath) ? targetHeroPath : userUploadedHeroPath
          if (fs.existsSync(imgToServe)) {
            res.setHeader('Content-Type', 'image/png')
            res.setHeader('Cache-Control', 'public, max-age=31536000')
            fs.createReadStream(imgToServe).pipe(res)
            return
          }
        }
        next()
      })
    }
  }
}

export default defineConfig({
  plugins: [react(), serveHeroImagePlugin()],
  server: {
    port: 3000,
    open: false
  }
})

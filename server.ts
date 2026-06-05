const https = require('https')
const fs = require('fs')
const next = require('next')

const dev = process.env.NODE_ENV !== 'production'
const app = next({ dev, port: 3001 })
const handle = app.getRequestHandler()

const httpsOptions = {
  key: fs.readFileSync('./localhost+2-key.pem'),
  cert: fs.readFileSync('./localhost+2.pem'),
}

app.prepare().then(() => {
  https.createServer(httpsOptions, (req : any, res : any) => {
    handle(req, res)
  }).listen(3001, () => {
    console.log('HTTPS ready on https://localhost:3001')
  })
})

const http = require('http')
const fs = require('fs')
const path = require('path')

const hostname = 'localhost'
const port = 3000

const pages = fs.readdirSync(path.join(__dirname, '../public/pages/'))

const server = http.createServer((req, res) => {
  res.statusCode = 200
  res.setHeader('Content-type', 'text/html')

  const basename = path.basename(req.url)
  const foundPage = pages.filter(page => page === basename + '.html').flat(0)

  if (req.url === '/') {
    fs.readFile(path.join(__dirname, '../public/pages/home.html'), (error, data) => {
      if (error) {
        console.error(error)
        res.writeHead(500)
        res.end('Erro interno do servidor...')
      } else {
        res.end(data)
      }
    })
  } else if (foundPage.length === 1) {
    fs.readFile(path.join(__dirname, `../public/pages/${foundPage[0]}`), (error, data) => {
      if (error) {
        console.error(error)
        res.writeHead(500)
        res.end('Erro interno do servidor...')
      } else {
        res.end(data)
      }
    })
  } else if(req.url.match('/public/css/*.*.css')) {
    const cssPath = path.join(__dirname, '../', req.url)
    const fileStream = fs.createReadStream(cssPath, 'UTF-8')
    res.writeHead(200, { 'Content-Type': 'text/css' })
    fileStream.pipe(res)
  } else {
    fs.readFile(path.join(__dirname, '../public/pages/404.html'), (error, data) => {
      if (error) {
        console.error(error)
        res.writeHead(500)
        res.end('Erro interno do servidor...')
      } else {
        res.writeHead(404)
        res.end(data)
      }
    })
  }
})

server.listen(port, () => {
  console.log(`🚀 Server avaliable at http://${hostname}:${port}`)
})
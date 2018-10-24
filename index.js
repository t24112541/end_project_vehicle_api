const express = require('express')
const bodyParser = require('body-parser')
const config = require('./config')
const socket = require('./lib/socket')

const app = express()

const compression = require('compression')
app.use(compression({
  filter: (req, res) => (!req.headers['x-no-compression'] && compression.filter(req, res)) || false,
}))

app.use(express.static('public'))

app.use((req, res, next) => {
  var header = { 'Access-Control-Allow-Origin': '*' }
  for (var i in req.headers) {
    if (i.toLowerCase().substr(0, 15) === 'access-control-') {
      header[i.replace(/-request-/g, '-allow-')] = req.headers[i]
    }
  }
  res.header(header)
  next()
})

app.use(bodyParser.json())

app.use((req, res, next) => {
  req.db = require('./lib/db')
  next()
})

app.use((req, res, next) => {
  req.$socket = socket
  next()
})

app.use('/api', require('./api'))

app.listen(config.mysql.port, () => {
  console.log('ready', config.mysql.port)
})

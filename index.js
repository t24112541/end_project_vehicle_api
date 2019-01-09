const express = require('express')
const bodyParser = require('body-parser')
const config = require('./config')
const socket = require('./lib/socket')
const multer = require('multer')
const upload = multer({ dest: './public/img' })

const app = express()

const compression = require('compression')
app.use(compression({
  filter: (req, res) => (!req.headers['x-no-compression'] && compression.filter(req, res)) || false,
}))

app.use(express.static('./public'))

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
app.use(bodyParser.json({limit: "5000mb"}));
app.use(bodyParser.urlencoded({limit: "5000mb", extended: true, parameterLimit:5000000}));

app.use((req, res, next) => {
  req.db = require('./lib/db')
  next()
})

app.use((req, res, next) => {
  req.$socket = socket
  next()
})

app.use((req,res,next)=>{
  req.cv_dir=__dirname
  next()
})

app.use('/api', require('./api'))


app.listen(config.port, () => {
  console.log('ready', config.port)
})

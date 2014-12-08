var express = require('express')
var path = require('path')
var mongoose = require('mongoose')
var mongoStore = require('connect-mongo')(express)
// for local host
var port = process.env.PORT || 8000
// for openshift server side
// var ipaddress = process.env.OPENSHIFT_NODEJS_IP || "127.0.0.1"
// var port = process.env.OPENSHIFT_NODEJS_PORT || 8000
var app = express()
var fs = require('fs')
// for local  
var dbUrl = 'mongodb://localhost/webdb'
// for openshift server side
// var dbUrl = 'mongodb://' + process.env.OPENSHIFT_MONGODB_DB_USERNAME + ':' +
//     process.env.OPENSHIFT_MONGODB_DB_PASSWORD + "@" +
//     process.env.OPENSHIFT_MONGODB_DB_HOST + ':' +
//     process.env.OPENSHIFT_MONGODB_DB_PORT + '/' +
//     process.env.OPENSHIFT_APP_NAME;
mongoose.connect(dbUrl)


// models loading
var models_path = __dirname + '/app/models'
var walk = function(path) {
  fs
    .readdirSync(path)
    .forEach(function(file) {
      var newPath = path + '/' + file
      var stat = fs.statSync(newPath)

      if (stat.isFile()) {
        if (/(.*)\.(js|coffee)/.test(file)) {
          require(newPath)
        }
      }
      else if (stat.isDirectory()) {
        walk(newPath)
      }
    })
}
walk(models_path)
app.set('views', './app/views/pages')
app.set('view engine', 'jade')
app.use(express.bodyParser())
app.use(express.cookieParser())
app.use(express.multipart())
app.use(express.session({
  secret: 'zsyqq',
  store: new mongoStore({
    url: dbUrl,
    collection: 'sessions'
  })
}))

if ('development' === app.get('env')) {
  app.set('showStackError', true)
  app.use(express.logger(':method :url :status'))
  app.locals.pretty = true
  //mongoose.set('debug', true)
}

require('./config/routes')(app)

// app.listen(port, ipaddress)
app.listen(port)
app.locals.moment = require('moment')
app.use(express.static(path.join(__dirname, 'public')))

console.log('cs5610 started on port ' + port)


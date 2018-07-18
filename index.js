var choo = require('choo')
var css = require('sheetify')

css('tachyons')

var app = choo()

if (process.env.NODE_ENV !== 'production') {
  app.use(require('choo-devtools')())
} else {
  app.use(require('choo-service-worker')())
}

app.use(require('choo-touch')('main'))
app.use(require('./stores/offline'))
app.use(require('./stores/record'))

app.route('/*', require('./views/main'))

app.mount('body')

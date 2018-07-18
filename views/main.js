var html = require('choo/html')
var Button = require('../components/button')

var TITLE = 'welcome - main'

module.exports = view

function view (state, emit) {
  if (state.title !== TITLE) emit(state.events.DOMTITLECHANGE, TITLE)

  return html`
    <body class="code lh-copy">
      <main data-recognize="press" data-press="startrecording" data-pressup="stoprecording" class="h-100 w-100 pa3 cf center tc w5 ${state.recording ? 'bg-green' : 'bg-washed-red'}">
          ${state.cache(Button, 'button').render(state, emit)}
      </main>
    </body>
  `
}

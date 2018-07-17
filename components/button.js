var Component = require('choo/component')
var html = require('choo/html')

class Button extends Component {
  constructor (id, state, emit) {
    super(id)
    this.local = state.components[id] = {
      state: 'ready'
    }
    this.emit = emit

    this.click = this.click.bind(this)
  }

  click (event) {
    // save audio
    if (this.local.state === 'ready') {
      this.emit('startcapturing')
      this.local.state = 'listening'
    } else if (this.local.state === 'listening') {
      this.emit('download')
    }
    this.render()
  }

  createElement () {
    return html`
      <button onclick=${this.click} class="pointer outline-0 br-100 bn input-reset absolute right-2 bottom-2 shadow-5 pa3 ${this.local.state === 'ready' ? 'bg-green' : 'bg-light-red'}">
        ${this.local.state === 'ready'
          ? html`<svg id="i-play" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 32" width="32" height="32" fill="none" stroke="currentcolor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2">
            <path d="M10 2 L10 30 24 16 Z" />
          </svg>`
          : html`<svg id="i-download" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 32" width="32" height="32" fill="none" stroke="currentcolor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2">
            <path d="M9 22 C0 23 1 12 9 13 6 2 23 2 22 10 32 7 32 23 23 22 M11 26 L16 30 21 26 M16 16 L16 30" />
          </svg>`
        }
      </button>
    `
  }

  update () {
    return true
  }
}

module.exports = Button

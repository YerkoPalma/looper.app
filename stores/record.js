/* global navigator MediaRecorder Blob FileReader */
var mergeBuffers = require('merge-audio-buffers')
var AudioGraph = require('web-audio-graph')
var toWav = require('audiobuffer-to-wav')
var graph = new AudioGraph()

module.exports = store

store.storeName = 'record'
function store (state, emitter) {
  state.sourceStream = {}
  state.chunks = []
  state.buffers = []
  emitter.on('startcapturing', function () {
    if (navigator.mediaDevices) {
      navigator.mediaDevices.getUserMedia({audio: true, video: false})
        .then(function (stream) {
          state.sourceStream = stream
          state.mediaRecorder = new MediaRecorder(stream)
          state.mediaRecorder.ondataavailable = ({data}) => {
            state.chunks.push(data)
          }
          state.mediaRecorder.onstop = e => {
            var blob = new Blob(state.chunks, { 'type': 'audio/ogg; codecs=opus' })
            var fileReader = new FileReader()
            fileReader.onload = function (event) {
              graph.context.decodeAudioData(event.target.result, buffer => {
                state.buffers.push(buffer)
                var source = graph.addSource('buffer', state.buffers.length === 1 ? buffer : mergeBuffers(state.buffers, graph.context))
                source.connectToDestination()
                source.play()
                source.update({ loop: true })
              })
              state.chunks = []
            }
            fileReader.readAsArrayBuffer(blob)
          }
          state.components.button.state = 'listening'
        }).catch(err => {
          emitter.emit('log:error', err)
        })
    }
  })

  emitter.on('startrecording', function () {
    state.mediaRecorder.start()
    state.recording = true
    graph.stop()
    emitter.emit('render')
  })
  emitter.on('stoprecording', function () {
    state.mediaRecorder.stop()
    state.recording = false
    emitter.emit('render')
  })
  emitter.on('download', function () {
    var anchor = document.createElement('a')
    document.body.appendChild(anchor)
    anchor.style = 'display: none'
    var wav = toWav(mergeBuffers(state.buffers, graph.context))
    var blob = new window.Blob([ new DataView(wav) ], {
      type: 'audio/wav'
    })
    var url = window.URL.createObjectURL(blob)
    anchor.href = url
    anchor.download = 'audio.wav'
    anchor.click()
    window.URL.revokeObjectURL(url)
  })
}

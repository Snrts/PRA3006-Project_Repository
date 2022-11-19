const { promisify } = require('util')
const { PassThrough, Writable } = require('readable-stream')

class SeparateStream extends Writable {
  constructor ({ change = () => {}, map = v => v, split = () => false } = {}) {
    super({ objectMode: true })

    this.change = change
    this.map = map
    this.split = split
    this.output = null
  }

  async _write (chunk, encoding, callback) {
    try {
      let next = false

      if (!this.output) {
        next = true
      } else if (this.split(chunk)) {
        await this._endOutput()

        next = true
      }

      if (next) {
        this.output = new PassThrough({ objectMode: true })

        await this.change(this.output, chunk)
      }

      this.output.write(this.map(chunk), null, callback)
    } catch (err) {
      callback(err)
    }
  }

  async _final (callback) {
    if (this.output) {
      await this._endOutput()
    }

    callback()
  }

  async _endOutput () {
    return promisify(this.output.end.bind(this.output))()
  }
}

module.exports = SeparateStream

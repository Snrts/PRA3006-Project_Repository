const defer = require('./defer')

class Mutex {
  constructor () {
    this._lock = null
  }

  async lock () {
    if (this._lock) {
      await this._lock.promise
    }

    this._lock = defer()
  }

  unlock () {
    if (!this._lock) {
      return
    }

    this._lock.resolve()
    this._lock = null
  }
}

function mutex () {
  return new Mutex()
}

module.exports = mutex

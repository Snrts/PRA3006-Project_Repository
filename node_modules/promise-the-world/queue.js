const defer = require('./defer')

class Queue {
  constructor (maxPending, maxQueued) {
    this.maxPending = maxPending
    this.maxQueued = maxQueued
    this.pending = 0
    this._queue = []
  }

  get length () {
    return this._queue.length
  }

  async add (factory) {
    if (this._queue.length >= this.maxQueued) {
      throw new Error(`limit of ${this.maxQueued} promises reached`)
    }

    const def = defer()

    this._queue.push({ factory, resolve: def.resolve, reject: def.reject })

    setTimeout(() => this._dequeue(), 0)

    return def.promise
  }

  async _dequeue () {
    if (this.pending >= this.maxPending) {
      return
    }

    const item = this._queue.shift()

    if (!item) {
      return
    }

    try {
      this.pending++

      const result = await item.factory()

      this.pending--

      item.resolve(result)

      this._dequeue()
    } catch (err) {
      this.pending--

      item.reject(err)

      this._dequeue()
    }
  }
}

function queue (maxPending = 1, maxQueued = Infinity) {
  return new Queue(maxPending, maxQueued)
}

module.exports = queue

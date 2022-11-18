const { strictEqual } = require('assert')
const { describe, it } = require('mocha')
const delay = require('../delay')
const mutex = require('../mutex')

describe('mutex', () => {
  it('should be a function', () => {
    strictEqual(typeof mutex, 'function')
  })

  it('should not resolve the promise returned by .lock until .unlock is called', async () => {
    let end = null
    const time = 100
    const start = Date.now()
    const m = mutex()

    Promise.resolve().then(async () => {
      await m.lock() // first lock will resolve immediately
      await m.lock() // this one has to wait for the unlock

      end = Date.now()
    })

    await delay(time)
    m.unlock()
    await delay(1)

    const passed = end - start

    strictEqual(passed - time >= -5, true)
    strictEqual(passed - time < 5, true)
  })

  describe('.lock', () => {
    it('should be a method', () => {
      const m = mutex()

      strictEqual(typeof m.lock, 'function')
    })

    it('should return a promise', () => {
      const m = mutex()

      const result = m.lock()

      strictEqual(typeof result.then, 'function')
      strictEqual(typeof result.catch, 'function')
    })
  })

  describe('.unlock', () => {
    it('should be a method', () => {
      const m = mutex()

      strictEqual(typeof m.unlock, 'function')
    })

    it('should do nothing if the mutex is not yet locked', async () => {
      let error = null
      const m = mutex()

      try {
        m.unlock()
      } catch (err) {
        error = err
      }

      strictEqual(error, null)
    })

    it('should do nothing if the mutex is already unlocked', async () => {
      let error = null
      const m = mutex()

      await m.lock()
      m.unlock()

      try {
        m.unlock()
      } catch (err) {
        error = err
      }

      strictEqual(error, null)
    })
  })
})

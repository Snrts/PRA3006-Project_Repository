const { strictEqual } = require('assert')
const { describe, it } = require('mocha')
const delay = require('../delay')

describe('delay', () => {
  it('should be a function', () => {
    strictEqual(typeof delay, 'function')
  })

  it('should return a promise', () => {
    const result = delay(1)

    strictEqual(typeof result.then, 'function')
    strictEqual(typeof result.catch, 'function')
  })

  it('should resolve after the given time', async () => {
    const time = 100
    const start = Date.now()

    await delay(time)

    const passed = Date.now() - start

    strictEqual(passed - time >= -5, true)
    strictEqual(passed - time < 5, true)
  })
})

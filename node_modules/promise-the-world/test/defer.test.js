const { strictEqual } = require('assert')
const { describe, it } = require('mocha')
const defer = require('../defer')

describe('defer', () => {
  it('should be a function', () => {
    strictEqual(typeof defer, 'function')
  })

  describe('.promise', () => {
    it('should be a Promise', () => {
      const def = defer()

      strictEqual(typeof def.promise.then, 'function')
      strictEqual(typeof def.promise.catch, 'function')
    })
  })

  describe('.resolve', () => {
    it('should be a function', () => {
      const def = defer()

      strictEqual(typeof def.resolve, 'function')
    })

    it('should resolve the promise', async () => {
      const def = defer()

      setTimeout(() => def.resolve(), 1)

      await def.promise
    })

    it('should forward the given argument', async () => {
      const def = defer()

      setTimeout(() => def.resolve('test'), 1)

      const result = await def.promise

      strictEqual(result, 'test')
    })
  })

  describe('.reject', () => {
    it('should be a function', () => {
      const def = defer()

      strictEqual(typeof def.resolve, 'function')
    })

    it('should reject the promise', async () => {
      let thrown = null
      const def = defer()

      setTimeout(() => def.reject(), 1)

      try {
        await def.promise
      } catch (err) {
        thrown = true
      }

      strictEqual(thrown, true)
    })

    it('should forward the given error', async () => {
      let thrown = null
      const def = defer()

      setTimeout(() => def.reject(new Error('test')), 1)

      try {
        await def.promise
      } catch (err) {
        thrown = err
      }

      strictEqual(thrown.message, 'test')
    })
  })
})

const { deepStrictEqual, strictEqual } = require('assert')
const { describe, it } = require('mocha')
const delay = require('../delay')
const queue = require('../queue')

function noop () {}

describe('queue', () => {
  it('should be a function', () => {
    strictEqual(typeof queue, 'function')
  })

  it('should assign the given maxPending and maxQueued arguments', () => {
    const maxPending = 123
    const maxQueued = 456

    const q = queue(maxPending, maxQueued)

    strictEqual(q.maxPending, maxPending)
    strictEqual(q.maxQueued, maxQueued)
  })

  it('should set maxPending to 1 and maxQueued to Infinity by default', () => {
    const q = queue()

    strictEqual(q.maxPending, 1)
    strictEqual(q.maxQueued, Infinity)
  })

  it('should initialize _queue with an empty array', () => {
    const q = queue()

    deepStrictEqual(q._queue, [])
  })

  it('should initialize pending to 0', () => {
    const q = queue()

    deepStrictEqual(q.pending, 0)
  })

  it('should increase the pending property for each pending promise', async () => {
    const q = queue(10)

    q.add(() => delay(20))
    q.add(() => delay(20))

    await delay(10)

    strictEqual(q.pending, 2)
  })

  it('should decrease the pending property for each resolved promise', async () => {
    const q = queue(10)

    q.add(() => Promise.resolve())
    q.add(() => delay(20))

    await delay(10)

    strictEqual(q.pending, 1)
  })

  it('should decrease the pending property for each rejected promise', async () => {
    const q = queue(10)

    Promise.all([
      q.add(() => Promise.reject(new Error('test'))),
      q.add(() => delay(20))
    ]).catch(err => noop(err))

    await delay(10)

    strictEqual(q.pending, 1)
  })

  it('should delay factory calls if maxPending is reached', async () => {
    let count = 0
    const fn = async () => {
      await delay(20)
      count++
    }
    const q = queue(2)

    q.add(fn)
    q.add(fn)
    q.add(fn)
    q.add(fn)

    await delay(10)

    strictEqual(q.pending, 2)

    await delay(50)

    strictEqual(count, 4)
  })

  describe('.add', () => {
    it('should be a method', () => {
      const q = queue()

      strictEqual(typeof q.add, 'function')
    })

    it('should throw an error if maxQueued is reached', async () => {
      let thrown = null
      const q = queue(10, 1)

      try {
        await Promise.all([
          q.add(() => Promise.resolve()),
          q.add(() => Promise.resolve())
        ])
      } catch (err) {
        thrown = err
      }

      strictEqual(thrown.message.includes('limit'), true)
    })

    it('should add the factory function to the queue', () => {
      const fn = () => {}
      const q = queue()

      q.add(fn)

      strictEqual(q._queue[0].factory, fn)
    })

    it('should resolve with the value from the factory function', async () => {
      const q = queue()

      const result = await q.add(() => 'test')

      strictEqual(result, 'test')
    })

    it('should reject with the error from the factory function', async () => {
      let thrown = null
      const q = queue()

      try {
        await q.add(() => {
          throw new Error('test')
        })
      } catch (err) {
        thrown = err
      }

      strictEqual(thrown.message, 'test')
    })
  })

  describe('.length', () => {
    it('should be a number property', () => {
      const q = queue()

      strictEqual(typeof q.length, 'number')
    })

    it('should be 0 if the queue is empty', () => {
      const q = queue()

      strictEqual(q.length, 0)
    })

    it('should be equals to the queue length', () => {
      const q = queue()

      q.add(() => {})
      q.add(() => {})

      strictEqual(q.length, 2)
    })
  })
})

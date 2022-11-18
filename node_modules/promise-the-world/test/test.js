const { strictEqual } = require('assert')
const { describe, it } = require('mocha')
const world = require('..')
const defer = require('../defer')
const delay = require('../delay')
const mutex = require('../mutex')
const queue = require('../queue')

describe('promise-the-world', () => {
  it('should export defer', () => {
    strictEqual(world.defer, defer)
  })

  it('should export delay', () => {
    strictEqual(world.delay, delay)
  })

  it('should export mutex', () => {
    strictEqual(world.mutex, mutex)
  })

  it('should export queue', () => {
    strictEqual(world.queue, queue)
  })
})

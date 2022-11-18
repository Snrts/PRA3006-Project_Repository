const { deepStrictEqual, strictEqual } = require('assert')
const { promisify } = require('util')
const getStream = require('get-stream')
const { describe, it } = require('mocha')
const { isReadable, isWritable } = require('isstream')
const { finished } = require('readable-stream')
const SeparateStream = require('..')

const untilFinished = promisify(finished)

describe('separate-stream', () => {
  it('should be a constructor', () => {
    strictEqual(typeof SeparateStream, 'function')
  })

  it('should be a Writable stream', () => {
    const stream = new SeparateStream()

    strictEqual(isWritable(stream), true)
  })

  it('should call change after the first stream was created', async () => {
    let called = false

    const stream = new SeparateStream({
      change: () => {
        called = true
      }
    })

    stream.write('a')
    stream.end()

    await untilFinished(stream)

    strictEqual(called, true)
  })

  it('should call change with the output stream as first argument', async () => {
    let output = null

    const stream = new SeparateStream({
      change: stream => {
        output = stream
      }
    })

    stream.write('a')
    stream.end()

    await untilFinished(stream)

    strictEqual(isReadable(output), true)
  })

  it('should call change with the current chunk as second argument', async () => {
    let content = null

    const stream = new SeparateStream({
      change: (stream, chunk) => {
        content = chunk
      }
    })

    stream.write('a')
    stream.end()

    await untilFinished(stream)

    strictEqual(content, 'a')
  })

  it('should handled errors thrown in the change function', async () => {
    const stream = new SeparateStream({
      change: async () => {
        throw new Error('test')
      }
    })

    stream.write('a')
    stream.end()

    let error = null

    try {
      await untilFinished(stream)
    } catch (err) {
      error = err
    }

    strictEqual(error instanceof Error, true)
  })

  it('should forward all chunks to the first stream if there is no split function given', async () => {
    let content = null

    const stream = new SeparateStream({
      change: stream => {
        getStream.array(stream).then(result => {
          content = result
        })
      }
    })

    stream.write('a')
    stream.write('b')
    stream.write('c')
    stream.end()

    await untilFinished(stream)

    deepStrictEqual(content, ['a', 'b', 'c'])
  })

  it('should call split for each chunk after the first one', async () => {
    const content = []

    const stream = new SeparateStream({
      split: chunk => {
        content.push(chunk)

        return false
      }
    })

    stream.write('a')
    stream.write('b')
    stream.write('c')
    stream.end()

    await untilFinished(stream)

    deepStrictEqual(content, ['b', 'c'])
  })

  it('should handle errors thrown in split function', async () => {
    const stream = new SeparateStream({
      split: () => {
        throw new Error('test')
      }
    })

    stream.write('a')
    stream.write('b')
    stream.write('c')
    stream.end()

    let error = null

    try {
      await untilFinished(stream)
    } catch (err) {
      error = err
    }

    strictEqual(error instanceof Error, true)
  })

  it('should create a new stream if split returns true', async () => {
    const content = []

    const stream = new SeparateStream({
      change: stream => {
        getStream.array(stream).then(result => {
          content.push(result)
        })
      },
      split: chunk => {
        return chunk === 'b'
      }
    })

    stream.write('a')
    stream.write('b')
    stream.write('c')
    stream.end()

    await untilFinished(stream)

    deepStrictEqual(content, [['a'], ['b', 'c']])
  })

  it('should assign the current output stream to .output', async () => {
    let output = []

    const stream = new SeparateStream({
      change: stream => {
        output = stream
      }
    })

    stream.write('a')
    stream.write('b')
    stream.write('c')
    stream.end()

    await untilFinished(stream)

    strictEqual(stream.output, output)
  })

  it('should use the given map function to translate the given chunk', async () => {
    let content = null

    const stream = new SeparateStream({
      change: stream => {
        getStream.array(stream).then(result => {
          content = result
        })
      },
      map: v => v.toUpperCase()
    })

    stream.write('a')
    stream.write('b')
    stream.write('c')
    stream.end()

    await untilFinished(stream)

    deepStrictEqual(content, ['A', 'B', 'C'])
  })

  it('should handle errors thrown in map function', async () => {
    const stream = new SeparateStream({
      map: () => {
        throw new Error('test')
      }
    })

    stream.write('a')
    stream.write('b')
    stream.write('c')
    stream.end()

    let error = null

    try {
      await untilFinished(stream)
    } catch (err) {
      error = err
    }

    strictEqual(error instanceof Error, true)
  })
})

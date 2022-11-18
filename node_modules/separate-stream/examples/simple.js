/*

  This example splits the incoming stream whenever there is an o in the chunk.
  The chunks are translated to upper case.

*/

const { promisify } = require('util')
const { finished, Readable } = require('readable-stream')
const SeparateStream = require('..')

async function main () {
  const input = new Readable({ objectMode: true, read: () => {} })
  const separateStream = new SeparateStream({
    change: stream => {
      console.log('new stream!')
      stream.on('data', chunk => console.log(chunk))
    },
    split: chunk => {
      return chunk.includes('o')
    },
    map: v => v.toUpperCase()
  })

  input.push('this')
  input.push('stream')
  input.push('is')
  input.push('separated')
  input.push('to')
  input.push('multiple')
  input.push('output')
  input.push('streams')
  input.push(null)

  input.pipe(separateStream)

  await promisify(finished)(separateStream)
}

main()

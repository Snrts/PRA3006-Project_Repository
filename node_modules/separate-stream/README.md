# separate-stream

Separates the chunks of one writable stream into multiple readable streams.

## Usage

The package exports the `SeparateStream` class. It can be imported like this:

```javascript
const SeparateStream = require('separate-stream')
```

### SeparateStream ({ change, map, split })

Creates a new instance of `SeparateStream` that implements a `Writable` stream interface.
All chunks written to the `Writable` interface are forwarded to a `Readable` stream that is given as an argument to the `change` callback function.
Every chunk after the first chunk is handed over to the `split` function that must return a boolean value which must be `true` if a new stream should be started.
The `map` callback allows translating incoming chunks before they are forwarded.  
 
The following options are supported:

- `async change(stream, chunk)`: A callback function that is called whenever a new stream is started.
  It will be called at least once for the first chunk.
  Stream processing will wait until the function returned.
  (default: `() => {}`)
- `split(chunk)`: A callback function that controls when to change to the next output stream.
  A new output stream is started if the function returns `true`.
  (default: `() => false`)
- `map(chunk)`: A callback function that translates incoming chunks.
  (default: `v => v`) 

### Example

This example splits the incoming stream whenever there is an `o` in the chunk.
The chunks are translated to upper case.

```javascript
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
```

# promise-the-world

A collection of utils to handle recurring patterns around Promises and `async`/`await` code.

## Usage

The individual functions can be imported using the path `promise-the-world/` + component name.
For the `defer` function it would look like this: 

```javascript
const defer = require('promise-the-world/defer')
```

It's also possible to load the functions using the destructuring syntax.
Using the path to the individual components is recommended to reduce the bundle sizes.
Importing the components with the destructuring syntax would look like this:

```javascript
const { defer } = require('promise-the-world')
```

### defer()

Implements the obsolete [Promise.defer()](https://developer.mozilla.org/en-US/docs/Mozilla/JavaScript_code_modules/Promise.jsm/Deferred) method which returns a `Deferred` object.
In most cases, the Promise constructor is sufficient to create a Promise.
`defer` can be used for the rare cases where `resolve()` or `reject()` must be called outside the `executor` callback of the Promise constructor.
The returned `Deferred` object has the following properties/methods:

- `resolve(value)`: Resolves the Promise with the given value.
- `reject(error)`: Rejects the Promise with the given error.
- `promise`: The Promise object

The following example uses `defer` to wrap the `close` event of a stream into a Promise: 

```javascript
const fs = require('fs')
const defer = require('promise-the-world/defer')

const closed = defer()
const stream = fs.createReadStream('README.md')

stream.once('close', closed.resolve)
stream.resume()

closed.promise.then(() => {
  console.log('closed')
})
```

### delay(time)

Returns a Promise that resolves after the given `time` in milliseconds.

The following example code simply waits for 1s. 

```javascript
const delay = require('promise-the-world/delay')

delay(1000).then(() => {
  console.log('1s later')
})
```

### mutex()

Returns a mutex/lock object.
A mutex is useful to limit or sync access to a resource.
Access can be requested with the `lock` method which will resolve immediately if the mutex is not locked.
In the case that the mutex is locked, the `lock` method will resolve after `unlock` was called.
The returned mutex object has the following methods:

- `lock()`: Request access to the mutex.
  Returns a Promise which will resolve when the mutex is not / no longer locked.  
- `unlock`: Unlocks a locked mutex.

The following example wraps `fetch` and uses a mutex to do only one request at a time:

```javascript
const mutex = require('promise-the-world/mutex')

const access = mutex()

async function limitedFetch (url) {
  await access.lock()

  try {
    const result = await fetch(url)

    access.unlock()

    return result
  } catch (err) {
    // make sure you unlock the mutex if an error was thrown!
    access.unlock()

    throw err
  }
}

Promise.all([
  limitedFetch('http://example.org/'),
  limitedFetch('http://example.com/')
])
```

### queue(maxPending, maxQueued)
 
Returns a queue object to handle Promises in sequence.
With the `maxPending` option, it's possible to limit the items handled in parallel.
That can be useful for cases where resources are limited or expensive.
The Promises must be wrapped in factory function to give the queue control over the time when the items should be started. 

- `maxPending`: The limit for the pending Promises.
  The value is copied from the constructor argument.
  The default value is `1`. 
- `maxQueued`: The limit of queued factories.
  If the limit is reached, `.add()` will throw an error.
  The default value is `Infinity` 
- `.add(factory)`: Adds a Promise wrapped in a factory to the queue.
  Returns a Promise which acts as a proxy for the actual Promise.   
- `.length`: The number of queue factories.
- `.pending`: The number of pending Promises.

The following example uses a queue to limit the number of parallel fetch request to a maximum of 2:

```javascript
const queue = require('promise-the-world/queue')

const fetchQueue = queue(2)

Promise.all([
  fetchQueue.add(() => fetch('http://example.org/1')),
  fetchQueue.add(() => fetch('http://example.org/2')),
  fetchQueue.add(() => fetch('http://example.org/3')),
  fetchQueue.add(() => fetch('http://example.org/4'))
])
```

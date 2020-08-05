<h1 align="center">jFaaS</h2>
<h2 align="center">Unified wrapper for calling different FaaS providers</h2>

```js
jfaas.call('myamazonfunc', { a: 1 }, { amazon: { ...config }})
jfaas.call('mygooglefunc', { a: 1 }, { google: { ...config }})
```

## Install

Requires NodeJS >= 10.2.0

`npm i jfaas`


## Usage

`jfaas.call` returns a `Promise` that resolves to an `Object` of what the FaaS function returned. 

```js
const jfaas = require('jfaas')

// If it's a Google Cloud Function
jfaas.call('mygreetingfunction', { name: 'Jon Doe' }, { 
  google: { 
    projectName: 'myproject',
    region: 'us-central1'
  } 
})
  .then(resObject => console.log(resObject))


// If it's a Amazon Lambda Function
jfaas.call('mygreetingfunction', { name: 'Jon Doe' }, { 
  amazon: {
    region: 'us-east-2'
  }
})
  .then(resObject => console.log(resObject))

// { message: 'Hello, Jon Doe' }
// { message: 'Hello, Jon Doe' }
```

#### ES2015


```js
import jfaas from 'jfaas'

jfaas.call(...)
```

```js 
import { call } from 'jfaas'

call(...) 
```

## License

MIT

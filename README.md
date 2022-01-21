# axios-auto-retry

A plug-in that allows Axios to automatically retry

## Installation

```bash
npm install axios-auto-retry
```

## Usage

```js
// CommonJS
const axiosAutoRetry = require('axios-auto-retry');

// ES6
import axiosAutoRetry from 'axios-auto-retry';

axiosAutoRetry(axios, { retries: 3 });

axios.get('http://www.baidu.com')
  .then(result => {
    result.data; // 'ok'
  });


// Works with custom axios instances
const instance = axios.create({
    xsrfCookieName: 'xsrf-token',
    xsrfHeaderName: 'xsrf-token',
    headers: { 'X-Requested-With': 'XMLHttpRequest' },
});
axiosRetry(instance, { retries: 3 });

instance.get('/test')
  .then(result => {
    result.data;
  });

// Allows request-specific configuration
instance.get('/test', {
    'axios-auto-retry': {
      retries: 0
    }
  }).then(result => {
    result.data;
});
```


## Options

| Name | Type | Default | Description |
| --- | --- | --- | --- |

## Testing

Clone the repository and execute:

```bash
npm test
```

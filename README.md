# csrf-validator

[![NPM Version][npm-version-image]][npm-url]
[![NPM Downloads][npm-downloads-image]][node-url]
[![Node.js Version][node-image]][node-url]

<a href="https://discord.gg/YyxmehbX"><img src="https://img.shields.io/badge/Discord-7289DA?style=for-the-badge&logo=discord&logoColor=white" /></a>


A [CSRF](https://en.wikipedia.org/wiki/Cross-site_request_forgery) validator library for Node.js and Nestjs.

Using this library will let you directly configure CSRF Validator for your app without a [cookie-parser](https://www.npmjs.com/package/cookie-parser) as it is already built in.

You will have an option to manually add cookie parser as well.

## Installation

This package is published over [npm registry](https://www.npmjs.com/).

```sh
$ npm install csrf-validator
```

## Implementation

<!-- eslint-disable no-unused-vars -->
There are two types of implementations available.
1. Without configuring `cookie-parser` and `cookie-session`
2. With configuring `cookie-parser` and `cookie-session` manually

#### 1. Without configuring `cookie-parser` and `cookie-session`
In this method, you don't have to configure `cookie-parser` and `cookie-session` manually, it will automatically get configured
###### Express.js
```js
var express = require('express');

var app = express();

CSRFValidator.instance(
        {
          tokenSecretKey: 'A secret key for encrypting csrf token',
          ignoredMethods: [],
          ignoredRoutes: ['/login'],
          entryPointRoutes: ['/login'],
          cookieKey: 'Optional - Custom csrf cookie key',
          cookieSecretKey: 'Cookie secret key for cookie-parser',
          cookieSessionKeys: [
            'First session key for cookie-session',
            'Second session key for cookie-session'
          ]
        }
).configureApp(app);
```

###### NestJS
```js
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  CSRFValidator.instance(
          {
            tokenSecretKey: 'A secret key for encrypting csrf token',
            ignoredMethods: [],
            ignoredRoutes: ['/login'],
            entryPointRoutes: ['/login'],
            cookieKey: 'Optional - Custom csrf cookie key',
            cookieSecretKey: 'Cookie secret key for cookie-parser',
            cookieSessionKeys: [
              'First session key for cookie-session',
              'Second session key for cookie-session'
            ]
          }
  ).configureApp(app);
}
```

#### 2. With configuring `cookie-parser` and `cookie-session` manually
In this method, you have to configure `cookie-parser` and `cookie-session` manually
###### Express.js
```js
var express = require('express');
var cookieSession = require('cookie-session');
var cookieParser = require('cookie-parser');

var app = express();
app.use(cookieParser('Cookie secret key for cookie-parser'));
app.use(cookieSession({
  keys: [
    'First session key for cookie-session',
    'Second session key for cookie-session'
  ]
}));

app.use(CSRFValidator.instance({
  tokenSecretKey: 'A secret key for encrypting csrf token',
  ignoredMethods: [],
  ignoredRoutes: ['/login'],
  entryPointRoutes: ['/login'],
  cookieKey: 'Optional - Custom csrf cookie key'
}).configure());
```

###### NestJS
```js
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import * as cookieSession from 'cookie-session';
import * as cookieParser from 'cookie-parser';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.use(cookieParser('Cookie secret key for cookie-parser'));
  app.use(cookieSession({
    keys: [
      'First session key for cookie-session',
      'Second session key for cookie-session'
    ]
  }));

  app.use(CSRFValidator.instance({
    tokenSecretKey: 'A secret key for encrypting csrf token',
    ignoredMethods: [],
    ignoredRoutes: ['/login'],
    entryPointRoutes: ['/login'],
    cookieKey: 'Optional - Custom csrf cookie key'
  }).configure());
}
```

## Configuration
Just like demonstrated above, you have to call either `CSRFValidator.instance().configreApp(app)` or `app.use(CSRFValidator.instance().configreApp())` with `CSRFValidatorOptions` to configure.

### CSRFValidatorOptions

|Field|Usage|Example|
|:---:|:---:|:---:|
|tokenSecretKey|This is a secret key used to encrypt CSRF tokens|`'6e655c9df6374cfa8a2d77c5f5d7d'`|
|ignoredMethods|Array of methods, those will be ignored at the time of CSRF token verification. But still won't set any token in response.|`['GET', 'POST']`|
|ignoredRoutes|Array of routes, those will be ignored at the time of CSRF token verification. But still won't set any token in response.|`['/login', '/user']`|
|entryPointRoutes|Array of routes, if the routes ignored like above, you still need a starting point. Setting entry point routes will treat those routes to set the CSRF token in response.|`['/login']`|
|cookieKey|This is an optional filed. You can customize the token key name using this field|`'custom-csrf-cookie'`|
|cookieSecretKey|This is a secret key to setup `cookie-parser`|`'5edc865af772d214c6d9893b57a51'`|
|cookieSessionKeys|This is an array of secret keys to setup `cookie-session`|`['7f6cb6e3c9cefd7b2c6b76826516d', 'ff675b9dcb1d6324d96789ef939b1']`|

## License

[MIT](LICENSE)

[node-image]: https://badgen.net/npm/node/csrf
[node-url]: https://nodejs.org/en/download
[node-url]: https://nodejs.org/en/download
[npm-downloads-image]: https://badgen.net/npm/dm/csrf-validator
[npm-url]: https://npmjs.org/package/csrf-validator
[npm-version-image]: https://badgen.net/npm/v/npm

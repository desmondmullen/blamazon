# [@fav/text.repeat][repo-url] [![NPM][npm-img]][npm-url] [![MIT License][mit-img]][mit-url] [![Build Status][travis-img]][travis-url] [![Build Status][appveyor-img]][appveyor-url] [![Coverage status][coverage-img]][coverage-url]

Repeat the source string the given times.

> "fav" is an abbreviation of "favorite" and also the acronym of "for all versions".
> This package is intended to support all Node.js versions and many browsers as possible.
> At least, this package supports Node.js >= v0.10 and major Web browsers: Chrome, Firefox, IE11, Edge, Vivaldi and Safari.


## Install

To install from npm:

```sh
$ npm install --save @fav/text.repeat
```

***NOTE:*** *npm < 2.7.0 does not support scoped package, but even old version Node.js supports it. So when you use such older npm, you should download this package from [github.com][repo-url], and move it in `node_modules/@fav/text.repeat/` directory manually.*


## Usage

For Node.js, when installing `@fav/text.repeat` from npm:

```js
var repeat = require('@fav/text.repeat');
repeat('*', 3);  // => '***'
repeat('abc', 2); // => 'abcabc'
```

For Web browsers:

```html
<script src="fav.text.repeat.min.js"></script>
<script>
var repeat = fav.text.repeat;
repeat('*', 3) ; // => '***'
</script>
```


## API

### <u>repeat(source, ntimes) : string</u>

Repeat *source* *ntimes* times.

**NOTE:** This function doesn't check data types of the arguments, and assumes that they are given as per the specific data types.

#### Parameter:

| Parameter |  Type  | Description              |
|-----------|:------:|--------------------------|
| source    | string | The string to repeat.    |
| ntimes    | number | The number of times to repeat. |

#### Return:

The repeated string.

**Type:** string


## Checked                                                                      

### Node.js (4〜)

| Platform  |   4    |   5    |   6    |   7    |   8    |   9    |   10   |
|:---------:|:------:|:------:|:------:|:------:|:------:|:------:|:------:|
| macOS     |&#x25ef;|&#x25ef;|&#x25ef;|&#x25ef;|&#x25ef;|&#x25ef;|&#x25ef;|
| Windows10 |&#x25ef;|&#x25ef;|&#x25ef;|&#x25ef;|&#x25ef;|&#x25ef;|&#x25ef;|
| Linux     |&#x25ef;|&#x25ef;|&#x25ef;|&#x25ef;|&#x25ef;|&#x25ef;|&#x25ef;|

### io.js (1〜3)

| Platform  |   1    |   2    |   3    |
|:---------:|:------:|:------:|:------:|
| macOS     |&#x25ef;|&#x25ef;|&#x25ef;|
| Windows10 |&#x25ef;|&#x25ef;|&#x25ef;|
| Linux     |&#x25ef;|&#x25ef;|&#x25ef;|

### Node.js (〜0.12)

| Platform  |  0.8   |  0.9   |  0.10  |  0.11  |  0.12  |
|:---------:|:------:|:------:|:------:|:------:|:------:|
| macOS     |&#x25ef;|&#x25ef;|&#x25ef;|&#x25ef;|&#x25ef;|
| Windows10 |&#x25ef;|&#x25ef;|&#x25ef;|&#x25ef;|&#x25ef;|
| Linux     |&#x25ef;|&#x25ef;|&#x25ef;|&#x25ef;|&#x25ef;|

### Web browsers

| Platform  | Chrome | Firefox | Vivaldi | Safari |  Edge  | IE11   |
|:---------:|:------:|:-------:|:-------:|:------:|:------:|:------:|
| macOS     |&#x25ef;|&#x25ef; |&#x25ef; |&#x25ef;|   --   |   --   |
| Windows10 |&#x25ef;|&#x25ef; |&#x25ef; |   --   |&#x25ef;|&#x25ef;|
| Linux     |&#x25ef;|&#x25ef; |&#x25ef; |   --   |   --   |   --   |


## License

Copyright (C) 2017-2018 Takayuki Sato

This program is free software under [MIT][mit-url] License.
See the file LICENSE in this distribution for more details.


[repo-url]: https://github.com/sttk/fav-text.repeat/
[npm-img]: https://img.shields.io/badge/npm-v1.0.2-blue.svg
[npm-url]: https://www.npmjs.com/package/@fav/text.repeat
[mit-img]: https://img.shields.io/badge/license-MIT-green.svg
[mit-url]: https://opensource.org/licenses/MIT
[travis-img]: https://travis-ci.org/sttk/fav-text.repeat.svg?branch=master
[travis-url]: https://travis-ci.org/sttk/fav-text.repeat
[appveyor-img]: https://ci.appveyor.com/api/projects/status/github/sttk/fav-text.repeat?branch=master&svg=true
[appveyor-url]: https://ci.appveyor.com/project/sttk/fav-text-repeat
[coverage-img]: https://coveralls.io/repos/github/sttk/fav-text.repeat/badge.svg?branch=master
[coverage-url]: https://coveralls.io/github/sttk/fav-text.repeat?branch=master

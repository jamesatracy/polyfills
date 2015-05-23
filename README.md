# Browser Polyfills

## Development prereqs:

- node (http://nodejs.org)
- npm (https://www.npmjs.org)
- grunt (http://gruntjs.com)

## Getting started:

- Run `npm install`

## Development:

- Edit and create files in /src
- Run `grunt` to build to /dist

## Include these in your page:

```html
<!--[if IE 8]><script src="ie8-polyfill.min.js"></script><![endif]-->
<!--[if IE 9]><script src="ie9-polyfill.min.js"></script><![endif]-->
<!--[if gt IE 9]>--><script src="polyfill.min.js"></script><!--<![endif]-->
```
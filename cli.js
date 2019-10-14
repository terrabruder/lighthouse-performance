#!/usr/bin/env node
'use strict';
const meow = require('meow');
const lightperf = require('./src/lightperf');

const cli = meow(`
	Usage
	  $ lightperf [url]

	Options
	  --verbose  give more details about the run process

	Examples
	  NYI.
`, {
	flags: {
		postfix: {
			type: 'string',
			default: 'rainbows'
		}
	}
});

console.log(lightperf(cli.input[0], cli.flags));

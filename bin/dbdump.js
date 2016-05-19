#!/usr/bin/env node
var yargs = require('yargs');
var dump = require('../index');

// Parse options
var argv = yargs
	.usage('Usage: $0 -u user -p password -d database')
	.options({
		user: {
			alias: 'u',
			demand: true,
			describe: 'Database user',
			type: 'string'
		},
		password: {
			alias: 'p',
			describe: 'User password'
		},
		database: {
			alias: 'd',
			demand: true,
			describe: 'Database name',
			type: 'string'
		}
	})
	.argv;

dump(argv.user, argv.password, argv.database);

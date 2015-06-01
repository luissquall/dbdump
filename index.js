var exec = require('child_process').exec;
var _ = {};

_.template = require('lodash.template');

var EOL = "\n";
var template;
var compiled;
var opts = {
	maxBuffer: 10000*1024
};

template  = 'mysqldump --compact --add-drop-database --add-drop-table --complete-insert --no-data --triggers --routines ';
template += '-u <%= user %> <% if (password) { print("-p" + (password === true ? "" : password)) } %> <%= db %>';
compiled = _.template(template);

function dump(user, password, db) {
	var cmd;
	var child;
	var content;

	cmd = compiled({user: user, password: password, db: db});

	child = exec(cmd, opts, function (error, stdout, stderr) {
		if (error) {
			return;
		}
		
		content = stdout;

		// Delete CRs
		content = content.replace(/\r/g, '');

		// Uppercase words
		content = content.replace(/auto_increment/g, 'AUTO_INCREMENT');
		content = content.replace(/\sdefault([\s,])/ig, ' DEFAULT$1');
		content = content.replace(/character set/g, 'CHARACTER SET');

		// Remove spaces
		content = content.replace(/PRIMARY KEY\s+/g, 'PRIMARY KEY ');

		// Delete non common directives
		content = content.replace(/^SET character_set_client.*$\n/mg, '');
		content = content.replace(/^SET @saved_cs_client.*$\n/mg, '');
		content = content.replace(/^DROP TABLE IF EXISTS.*$\n/mg, '');
		content = content.replace(/ AUTO_INCREMENT=\d+/g, '');

		// Remove MySQL specific code
		content = content.replace(/^\/\*!.*\*\/;$\n?/gm, '');

		// Add one line before every CREATE TABLE directive
		content = content.replace(/CREATE TABLE/g, EOL + "CREATE TABLE");

		// Delete last linefeed
		content = content.replace(/\n$/g, '');

		// Remove DEFINER clauses
		// */ /*!50017 DEFINER=`root`@`localhost`*/ /*!50003
		content = content.replace(/\*\/ (\/\*!\d+) DEFINER=.*?(\*\/) \/\*!\d+/g, '');

		// Disable foreign keys constraints
		content = 'SET FOREIGN_KEY_CHECKS = 0;' + EOL + content;

		process.stdout.write(content);
	});
	
	child.stderr.pipe(process.stderr);
}

module.exports = dump;
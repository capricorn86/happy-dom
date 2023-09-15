/* eslint-disable no-console*/

const Path = require('path');
const FS = require('fs');
const packageJson = require('../package.json');

async function main() {
	await Promise.all([
		FS.promises.writeFile(
			Path.resolve(Path.join('.', 'lib', 'version.js')),
			`export default { version: '${packageJson.version}' };`
		),
		FS.promises.writeFile(
			Path.resolve(Path.join('.', 'cjs', 'version.cjs')),
			`module.exports = { default: { version: '${packageJson.version}' } };`
		)
	]);
}

main();

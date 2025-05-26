/* eslint-disable no-console*/

const Path = require('path');
const FS = require('fs');
const packageJson = require('../package.json');

async function main() {
	await FS.promises.writeFile(
		Path.resolve(Path.join('.', 'lib', 'version.js')),
		`export default { version: '${packageJson.version}' };`
	);
}

main();

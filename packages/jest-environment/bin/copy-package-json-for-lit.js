/* eslint-disable no-console*/
/* eslint-disable @typescript-eslint/no-var-requires*/

const Path = require('path');
const FS = require('fs');

const LIBS = ['@lit/reactive-element', 'lit', 'lit-element', 'lit-html'];

function getLibPath(lib) {
	const split = require.resolve(lib).split('node_modules');
	const modulePathSplit = split[1].split(Path.sep);
	const modulePath = modulePathSplit[1].startsWith('@')
		? modulePathSplit[1] + Path.sep + modulePathSplit[2]
		: modulePathSplit[1];

	return Path.join(split[0], 'node_modules', modulePath);
}

async function writePackageJson(from, to) {
	const packageJson = require(from);
	delete packageJson.type;
	delete packageJson.exports;
	await FS.promises.writeFile(to, JSON.stringify(packageJson, null, 4));
}

async function main() {
	await Promise.all(
		LIBS.map((lib) =>
			writePackageJson(
				Path.join(getLibPath(lib), 'package.json'),
				Path.resolve(Path.join('lib', 'node_modules', lib, 'package.json'))
			)
		)
	);
}

process.on('unhandledRejection', (reason) => {
	console.error(reason);
	process.exit(1);
});

main();

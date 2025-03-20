/* eslint-disable no-console*/
/* eslint-disable @typescript-eslint/no-var-requires*/

const Path = require('path');
const fsp = require('fs/promises');

const LIBS = ['@lit/reactive-element', 'lit', 'lit-element', 'lit-html'];

function getLibPath(lib) {
	const split = require.resolve(lib).split('node_modules');
	const modulePathSplit = split[1].split(Path.sep);
	const modulePath = modulePathSplit[1].startsWith('@')
		? modulePathSplit[1] + Path.sep + modulePathSplit[2]
		: modulePathSplit[1];

	return Path.join(split[0], 'node_modules', modulePath);
}

async function copyTsDefFiles(lib) {
	const srcDir = getLibPath(lib);
	const destDir = Path.resolve(Path.join('lib', 'node_modules', lib));

	await fsp.mkdir(destDir, { recursive: true });

	const files = await fsp.readdir(srcDir);

	const tsDefFiles = files.filter((file) => file.endsWith('.d.ts'));

	const copyPromises = tsDefFiles.map((file) => {
		const srcFile = Path.join(srcDir, file);
		const destFile = Path.join(destDir, file);
		return fsp.copyFile(srcFile, destFile);
	});
	await Promise.all(copyPromises);
}

async function main() {
	await Promise.all(LIBS.map((lib) => copyTsDefFiles(lib)));
}

process.on('unhandledRejection', (reason) => {
	console.error(reason);
	process.exit(1);
});

main();

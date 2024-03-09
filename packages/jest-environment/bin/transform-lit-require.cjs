/* eslint-disable no-console*/
/* eslint-disable @typescript-eslint/no-var-requires*/

const FS = require('fs');
const Path = require('path');
const Glob = require('glob');

const LIBS = ['@lit/reactive-element', 'lit', 'lit-element', 'lit-html'];

function getFiles(lib) {
	return new Promise((resolve, reject) => {
		Glob(
			`${Path.resolve('./lib/node_modules/' + lib)}/**/*.js`,
			{ nodir: true },
			(error, files) => {
				if (error) {
					reject(error);
					return;
				}
				resolve(files);
			}
		);
	});
}

async function transformFile(lib, file) {
	const data = (await FS.promises.readFile(file)).toString();
	const regexp = /require\(["']([^"']+)["']\)/gm;
	const libDirectory = lib.split('/').length > 1 ? '../../' : '../';
	let newData = data;
	let match = null;

	while ((match = regexp.exec(data))) {
		for (const externalLib of LIBS) {
			if (match[1].startsWith(externalLib)) {
				newData = newData.replace(match[0], `require("${libDirectory}${match[1]}")`);
			}
		}
	}

	if (data !== newData) {
		await FS.promises.writeFile(file, newData);
	}
}

async function transformLib(lib) {
	const files = await getFiles(lib);
	const promises = [];
	for (const file of files) {
		promises.push(transformFile(lib, file));
	}
	await Promise.all(promises);
}

async function main() {
	await Promise.all(LIBS.map((lib) => transformLib(lib)));
}

process.on('unhandledRejection', (reason) => {
	console.error(reason);
	process.exit(1);
});

main();

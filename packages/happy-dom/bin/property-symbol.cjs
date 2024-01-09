/* eslint-disable no-console*/
/* eslint-disable @typescript-eslint/no-var-requires*/

const Path = require('path');
const FS = require('fs');

process.on('unhandledRejection', (reason) => {
	console.error(reason);
	process.exit(1);
});

main();

function getArguments() {
	const args = {
		dir: null
	};

	for (const arg of process.argv) {
		if (arg.startsWith('--dir=')) {
			args.dir = arg.split('=')[1];
		}
	}

	return args;
}

async function readDirectory(directory) {
	const files = await FS.promises.readdir(directory);
	const statsPromises = [];
	let allFiles = [];

	for (const file of files) {
		const filePath = Path.join(directory, file);
		statsPromises.push(
			FS.promises.stat(filePath).then((stats) => {
				if (stats.isDirectory()) {
					return readDirectory(filePath).then((files) => (allFiles = allFiles.concat(files)));
				}
				allFiles.push(filePath);
			})
		);
	}

	await Promise.all(statsPromises);

	return allFiles;
}

async function renameFiles(files) {
	const writePromises = [];

	for (const file of files) {
		writePromises.push(
			FS.promises.readFile(file).then((content) => {
				const oldContent = content.toString();
				const newContent = oldContent
					.replace(/\.__([a-zA-Z]+)__/gm, `[PropertySymbol.$1]`)
					.replace(/\['__([a-zA-Z]+)__'\]/gm, `[PropertySymbol.$1]`)
					.replace(/\__([a-zA-Z]+)__/gm, `[PropertySymbol.$1]`);
				return FS.promises.writeFile(file, newContent);
			})
		);
	}

	await Promise.all(writePromises);
}

async function main() {
	const args = getArguments();
	if (!args.dir) {
		throw new Error('Invalid arguments');
	}
	const directory = Path.resolve(args.dir);
	const files = await readDirectory(directory);
	await renameFiles(files);
}

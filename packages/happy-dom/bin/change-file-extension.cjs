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
		dir: null,
		fromExt: null,
		toExt: null
	};

	for (const arg of process.argv) {
		if (arg.startsWith('--dir=')) {
			args.dir = arg.split('=')[1];
		} else if (arg.startsWith('--fromExt=')) {
			args.fromExt = arg.split('=')[1];
		} else if (arg.startsWith('--toExt=')) {
			args.toExt = arg.split('=')[1];
		}
	}

	return args;
}

async function readDirectory(directory) {
	const resolvedDirectory = Path.resolve(directory);
	const files = await FS.promises.readdir(resolvedDirectory);
	const statsPromises = [];
	let allFiles = [];

	for (const file of files) {
		const filePath = Path.join(resolvedDirectory, file);
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

async function renameFiles(files, args) {
	const newFiles = files.map((file) => ({
		oldPath: file,
		newPath: file.replace(args.fromExt, args.toExt)
	}));
	const writePromises = [];

	for (const file of newFiles) {
		writePromises.push(
			FS.promises.readFile(file.oldPath).then((content) => {
				debugger;
				return FS.promises
					.writeFile(
						file.newPath,
						content
							.toString()
							.replace(
								new RegExp(`${args.fromExt.replace('.', '\\.')}\\.map`, 'g'),
								`${args.toExt}.map`
							)
							.replace(
								new RegExp(`${args.fromExt.replace('.', '\\.')}(["'])`, 'g'),
								`${args.toExt}$1`
							)
					)
					.then(() => {
						if (file.oldPath !== file.newPath) {
							return FS.promises.unlink(file.oldPath);
						}
					});
			})
		);
	}

	await Promise.all(writePromises);
}

async function main() {
	const args = getArguments();
	if (!args.dir || !args.fromExt || !args.toExt) {
		throw new Error('Invalid arguments');
	}
	const files = await readDirectory(args.dir);
	await renameFiles(files, args);
}

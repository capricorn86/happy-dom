/* eslint-disable no-console*/
/* eslint-disable @typescript-eslint/no-var-requires*/

const Fs = require('fs');
const Path = require('path');

const LIBS = ['@lit/reactive-element', 'lit', 'lit-element', 'lit-html'];

function getTsConfig(lib) {
	const split = require.resolve(lib).split('node_modules');
	const modulePathSplit = split[1].split(Path.sep);
	const modulePath = modulePathSplit[1].startsWith('@')
		? modulePathSplit[1] + Path.sep + modulePathSplit[2]
		: modulePathSplit[1];
	const path = Path.join(split[0], 'node_modules', modulePath);

	return {
		compilerOptions: {
			module: 'CommonJS',
			sourceMap: false,
			target: 'es2020',
			preserveSymlinks: true,
			preserveWatchOutput: true,
			experimentalDecorators: true,
			allowSyntheticDefaultImports: false,
			allowJs: true,
			checkJs: false,
			skipLibCheck: true,
			resolveJsonModule: true,
			moduleResolution: 'node',
			noResolve: true,
			incremental: true,
			tsBuildInfoFile: lib.replace('@', '').replace(/[/\\]/g, '-') + '-tsbuildinfo',
			lib: ['es2015', 'es2016', 'es2017'],
			outDir: '../lib/node_modules/' + lib,
			baseUrl: '.',
			removeComments: true,
			rootDir: path
		},
		include: [path],
		exclude: [path + '/src']
	};
}

async function writeTsConfigFile(lib) {
	await Fs.promises.writeFile(
		Path.resolve(`tmp/tsconfig.${lib.replace('@', '').replace(/[/\\]/g, '-')}.json`),
		JSON.stringify(getTsConfig(lib), null, 4)
	);
}

async function createTmpDirectory() {
	await Fs.promises.mkdir(Path.resolve('tmp'));
}

async function writeLibFiles() {
	await Promise.all(LIBS.map((lib) => writeTsConfigFile(lib)));
}

async function main() {
	try {
		await Fs.promises.access(Path.resolve('tmp'));
	} catch (error) {
		await createTmpDirectory();
	}
	await writeLibFiles();
}

process.on('unhandledRejection', (reason) => {
	console.error(reason);
	process.exit(1);
});

main();

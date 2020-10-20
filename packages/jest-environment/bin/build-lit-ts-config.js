/* eslint-disable */

const Fs = require('fs');
const Path = require('path');
const litElementPath = Path.dirname(require.resolve('lit-element/package.json'));
const litHTMLPath = Path.dirname(require.resolve('lit-html/package.json'));
const litElementTSConfig = {
	"compilerOptions": {
		"module": "CommonJS",
		"sourceMap": false,
		"target": "ES5",
		"preserveSymlinks": true,
		"preserveWatchOutput": true,
		"experimentalDecorators": true,
		"allowSyntheticDefaultImports": false,
		"allowJs": true,
		"checkJs": false,
		"skipLibCheck": true,
		"resolveJsonModule": true,
		"moduleResolution": "node",
		"noResolve": true,
		"incremental": true,
		"tsBuildInfoFile": "lit-element-tsbuildinfo",
		"lib": [
			"dom",
			"es2015",
			"es2016"
		],
		"outDir": "../lib/node_modules/lit-element",
		"baseUrl": ".",
		"removeComments": true,
		"rootDir": litElementPath
	},
	"include": [litElementPath],
	"exclude": [litElementPath + '/src']
};
const litHTMLTSConfig = {
	"compilerOptions": {
		"module": "CommonJS",
		"sourceMap": false,
		"target": "ES5",
		"preserveSymlinks": true,
		"preserveWatchOutput": true,
		"experimentalDecorators": true,
		"allowSyntheticDefaultImports": false,
		"allowJs": true,
		"checkJs": false,
		"skipLibCheck": true,
		"resolveJsonModule": true,
		"moduleResolution": "node",
		"noResolve": true,
		"incremental": true,
		"tsBuildInfoFile": "lit-html-tsbuildinfo",
		"lib": [
			"dom",
			"es2015",
			"es2016"
		],
		"outDir": "../lib/node_modules/lit-html",
		"baseUrl": ".",
		"removeComments": true,
		"rootDir": litHTMLPath
	},
	"include": [litHTMLPath],
	"exclude": [litHTMLPath + '/src']
};

function writeFile() {
	return Fs.promises
		.writeFile(Path.resolve('tmp/tsconfig.lit-element.json'), JSON.stringify(litElementTSConfig, null, 4))
		.then(() => {
			return Fs.promises
					.writeFile(Path.resolve('tmp/tsconfig.lit-html.json'), JSON.stringify(litHTMLTSConfig, null, 4))
					.catch(error => {
						// eslint-disable-next-line
						console.error('Failed to create "tmp/tsconfig.lit-html.json". Error: ' + error);
					});
		})
		.catch(error => {
			// eslint-disable-next-line
			console.error('Failed to create "tmp/tsconfig.lit-element.json". Error: ' + error);
		});
}

function createTmpDirectory() {
	return Fs.promises.mkdir(Path.resolve('tmp'));
}

Fs.promises
	.access(Path.resolve('tmp'))
	.then(writeFile)
	.catch(() => createTmpDirectory().then(writeFile));

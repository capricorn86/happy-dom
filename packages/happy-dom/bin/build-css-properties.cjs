/* eslint-disable no-console*/

const Path = require('path');
const FS = require('fs');
const packageJson = require('../package.json');

const CSS_PROPERTIES_URL =
	'https://chromium.googlesource.com/chromium/src/+/main/third_party/blink/renderer/core/css/css_properties.json5?format=TEXT';

async function main() {
	console.log('[codegen] Downloading css_properties.json5 from Chromium...');
	const response = await fetch(CSS_PROPERTIES_URL);

	if (!response.ok) {
		throw new Error(`Failed to download: ${response.status} ${response.statusText}`);
	}

	const base64 = await response.text();
	const content = Buffer.from(base64, 'base64').toString('utf-8');

	await FS.writeFile(Path.resolve('./properties.txt'), content, 'utf-8');
}

main();

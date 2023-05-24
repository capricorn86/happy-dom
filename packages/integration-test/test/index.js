import ChildProcess from 'node:child_process';
import FS from 'node:fs';
import Path from 'node:path';

// ES6 tests
await Promise.all([
	import('./tests/Fetch.test.js'),
	import('./tests/XMLHttpRequest.test.js'),
	import('./tests/WindowGlobals.test.js')
]);

// CommonJS test
const packageJSONPath = Path.resolve('./package.json');
const packageJSONContent = FS.readFileSync(packageJSONPath);

FS.writeFileSync(packageJSONPath, packageJSONContent.replace('"type": "module",', ''));

ChildProcess.exec('node ./tests/CommonJS.test.js', {}, (error, stdout, stderr) => {
	FS.writeFileSync(packageJSONPath, packageJSONContent);

	if (stdout) {
		console.log(stdout);
	}
	if (stderr) {
		console.error(stderr);
	}
	if (error) {
		console.error(stderr);
	}

	if (error || stderr) {
		process.exit(1);
	}
});

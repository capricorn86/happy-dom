import Chalk from 'chalk';

/* eslint-disable no-console*/

const tests = [];
let timeout = null;
let testDescribe = '';
let testDescription = '';

export function describe(description, callback) {
	testDescribe = '- ' + description;
	callback();
}

export function it(description, callback) {
	testDescription = testDescribe + ' > ' + description;
	run(testDescription, callback);
}

export function run(description, callback) {
	tests.push({
		description,
		callback
	});
	clearTimeout(timeout);
	timeout = setTimeout(async () => {
		let hasError = false;
		for (const test of tests) {
			process.stdout.write(Chalk.blue(test.description));
			let result = null;
			const startTime = performance.now();
			try {
				result = test.callback();
			} catch (error) {
				console.error(Chalk.red(error));
				hasError = true;
			}
			if (result instanceof Promise) {
				await new Promise((resolve) => {
					let hasTimedout = false;
					const testTimeout = setTimeout(() => {
						console.error(Chalk.red('Test timed out.'));
						hasError = true;
						hasTimedout = true;
						resolve();
					}, 30000);
					result
						.then(() => {
							if (!hasTimedout) {
								clearTimeout(testTimeout);
								resolve();
							}
						})
						.catch((error) => {
							console.error(Chalk.red(error));
							hasError = true;
						});
				});
			}
			process.stdout.write(
				Chalk.blue(` (${Math.round((performance.now() - startTime) * 100) / 100}ms)\n`)
			);
		}

		if (hasError) {
			console.log('');
			console.error(Chalk.red('❌ Some tests failed.'));
			console.log('');
			process.exit(1);
		}

		console.log('');
		console.log(Chalk.green('All tests passed.'));
		console.log('');
	}, 100);
}

export function expect(value) {
	return {
		toBe: (expected) => {
			if (value !== expected) {
				throw new Error(`Expected value "${value}" to be "${expected}".`);
			}
		}
	};
}

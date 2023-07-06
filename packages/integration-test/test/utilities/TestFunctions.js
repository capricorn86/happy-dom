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
		for (const test of tests) {
			console.log(test.description);
			const result = test.callback();
			if (result instanceof Promise) {
				const testTimeout = setTimeout(() => {
					console.error('Test timed out.');
					process.exit(1);
				}, 2000);
				try {
					await result;
					clearTimeout(testTimeout);
				} catch (error) {
					console.error(error);
					process.exit(1);
				}
			}
		}

		console.log('');
		console.log('All tests passed.');
	}, 100);
}

export function expect(value) {
	return {
		toBe: (expected) => {
			if (typeof value !== typeof expected) {
				throw new Error(`Expected type "${typeof value}" to be "${typeof expected}".`);
			}
			if (value !== expected) {
				throw new Error(`Expected value "${value}" to be "${expected}".`);
			}
		}
	};
}

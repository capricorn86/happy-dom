let testDescription = '';

export function describe(description, callback) {
	testDescription += testDescription ? ' > ' : ' - ';
	testDescription += description;
	callback();
}

export function it(description, callback) {
	testDescription += testDescription ? ' > ' : ' - ';
	testDescription += description;
	console.log(testDescription);
	const result = callback(() => {});
	if (result instanceof Promise) {
		result.catch((error) => {
			console.error(testDescription);
			console.error(error);
		});
	}
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

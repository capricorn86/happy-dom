import URLSearchParams from '../../src/url-search-params/URLSearchParams';

describe('URLSearchParams', () => {
	describe('constructor()', () => {
		it('Applies params sent to the constructor.', () => {
			const urlSearchParams = new URLSearchParams('key1=value1&key2=value2');
			expect(Array.from(urlSearchParams.entries())).toEqual([
				['key1', 'value1'],
				['key2', 'value2']
			]);
		});

		it('Params are optional.', () => {
			const urlSearchParams = new URLSearchParams();
			expect(Array.from(urlSearchParams.entries())).toEqual([]);
		});
	});

	describe('append()', () => {
		it('Appends params.', () => {
			const urlSearchParams = new URLSearchParams('key1=value1&key2=value2');
			urlSearchParams.append('key3', 'value3');
			expect(Array.from(urlSearchParams.entries())).toEqual([
				['key1', 'value1'],
				['key2', 'value2'],
				['key3', 'value3']
			]);
		});
	});

	describe('delete()', () => {
		it('Removes all params matching a name.', () => {
			const urlSearchParams = new URLSearchParams('key1=value1&key1=value1&key2=value2');
			urlSearchParams.delete('key1');
			expect(Array.from(urlSearchParams.entries())).toEqual([['key2', 'value2']]);
		});
	});

	describe('entries()', () => {
		it('Returns an iterator with key and value.', () => {
			const urlSearchParams = new URLSearchParams('key1=value1&key2=value2');
			expect(Array.from(urlSearchParams.entries())).toEqual([
				['key1', 'value1'],
				['key2', 'value2']
			]);
		});
	});

	describe('forEach()', () => {
		it('Calls a callback function for each param.', () => {
			const urlSearchParams = new URLSearchParams('key1=value1&key2=value2');
			const entries = [];
			urlSearchParams.forEach((name, value) => entries.push([name, value]));
			expect(entries).toEqual([
				['key1', 'value1'],
				['key2', 'value2']
			]);
		});
	});

	describe('get()', () => {
		it('Returns the value of the first matching param.', () => {
			const urlSearchParams = new URLSearchParams('key1=value1&key2=value2');
			expect(urlSearchParams.get('key2')).toBe('value2');
		});
	});

	describe('getAll()', () => {
		it('Returns all matching values of a param.', () => {
			const urlSearchParams = new URLSearchParams('key1=value1&key2=value2&key2=value3');
			expect(urlSearchParams.getAll('key2')).toEqual(['value2', 'value3']);
		});
	});

	describe('has()', () => {
		it('Returns "true" if a param exists.', () => {
			const urlSearchParams = new URLSearchParams('key1=value1&key2=value2');
			expect(urlSearchParams.has('key2')).toBe(true);
		});
	});

	describe('keys()', () => {
		it('Returns an iterator with keys.', () => {
			const urlSearchParams = new URLSearchParams('key1=value1&key2=value2');
			expect(Array.from(urlSearchParams.keys())).toEqual(['key1', 'key2']);
		});
	});

	describe('set()', () => {
		it('Sets a value and removes all previous params matching the name.', () => {
			const urlSearchParams = new URLSearchParams('key1=value1&key2=value2&key2=value3');
			urlSearchParams.set('key2', 'test');
			expect(Array.from(urlSearchParams.entries())).toEqual([
				['key1', 'value1'],
				['key2', 'test']
			]);
		});
	});

	describe('sort()', () => {
		it('Sorts the param list.', () => {
			const urlSearchParams = new URLSearchParams('key2=value2&key3=value3&key1=value1');
			urlSearchParams.sort();
			expect(Array.from(urlSearchParams.entries())).toEqual([
				['key1', 'value1'],
				['key2', 'value2'],
				['key3', 'value3']
			]);
		});
	});

	describe('toString()', () => {
		it('Returns query string.', () => {
			const urlSearchParams = new URLSearchParams('key2=value2&key3=value3&key1=value1');
			expect(urlSearchParams.toString()).toBe('key2=value2&key3=value3&key1=value1');
		});
	});

	describe('values()', () => {
		it('Returns an iterator with values.', () => {
			const urlSearchParams = new URLSearchParams('key1=value1&key2=value2');
			expect(Array.from(urlSearchParams.values())).toEqual(['value1', 'value2']);
		});
	});
});

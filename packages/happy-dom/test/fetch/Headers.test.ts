import Headers from '../../src/fetch/Headers';

describe('Headers', () => {
	describe('constructor()', () => {
		it('Supports sending in an instance of Headers as argument.', () => {
			const headers1 = new Headers();

			headers1.append('Content-Type', 'application/json');
			headers1.append('Content-Encoding', 'gzip');

			const headers2 = new Headers(headers1);

			const entries = {};

			for (const [key, value] of headers2) {
				entries[key] = value;
			}

			expect(entries).toEqual({
				'Content-Type': 'application/json',
				'Content-Encoding': 'gzip'
			});
		});
	});

	describe('append()', () => {
		it('Appends an header.', () => {
			const headers = new Headers();

			headers.append('Content-Type', 'application/json');
			headers.append('Content-Type', 'x-www-form-urlencoded');
			headers.append('Content-Encoding', 'gzip');

			const entries = {};

			for (const [key, value] of headers) {
				entries[key] = value;
			}

			expect(entries).toEqual({
				'Content-Type': 'application/json, x-www-form-urlencoded',
				'Content-Encoding': 'gzip'
			});
		});
	});

	describe('delete()', () => {
		it('Removes an header.', () => {
			const headers = new Headers();

			headers.append('Content-Type', 'application/json');
			headers.append('Content-Type', 'x-www-form-urlencoded');
			headers.append('Content-Encoding', 'gzip');

			headers.delete('Content-Type');

			const entries = {};

			for (const [key, value] of headers) {
				entries[key] = value;
			}

			expect(entries).toEqual({
				'Content-Encoding': 'gzip'
			});
		});

		describe('get()', () => {
			it('Returns an header.', () => {
				const headers = new Headers();

				headers.append('Content-Type', 'application/json');
				headers.append('Content-Type', 'x-www-form-urlencoded');
				headers.append('Content-Encoding', 'gzip');

				expect(headers.get('Content-Type')).toBe('application/json, x-www-form-urlencoded');
			});
		});

		describe('set()', () => {
			it('Sets headers and replaces any header with the same name.', () => {
				const headers = new Headers();

				headers.set('Content-Type', 'application/json');
				headers.set('Content-Type', 'x-www-form-urlencoded');
				headers.set('Content-Encoding', 'gzip');

				const entries = {};

				for (const [key, value] of headers) {
					entries[key] = value;
				}

				expect(entries).toEqual({
					'Content-Type': 'x-www-form-urlencoded',
					'Content-Encoding': 'gzip'
				});
			});
		});

		describe('has()', () => {
			it('Returns true if an header exists.', () => {
				const headers = new Headers();

				headers.append('Content-Type', 'application/json');
				headers.append('Content-Type', 'x-www-form-urlencoded');
				headers.append('Content-Encoding', 'gzip');

				expect(headers.has('Content-Type')).toBe(true);
				expect(headers.has('Content-Encoding')).toBe(true);
			});
		});

		describe('forEach()', () => {
			it('Calls a callback for each entry.', () => {
				const headers = new Headers();

				headers.append('Content-Type', 'application/json');
				headers.append('Content-Type', 'x-www-form-urlencoded');
				headers.append('Content-Encoding', 'gzip');

				const entries = {};

				headers.forEach((value, key, thisArg) => {
					entries[key] = value;
					expect(thisArg).toBe(headers);
				});

				expect(entries).toEqual({
					'Content-Type': 'application/json, x-www-form-urlencoded',
					'Content-Encoding': 'gzip'
				});
			});
		});

		describe('*keys()', () => {
			it('Returns an iterator for keys.', () => {
				const headers = new Headers();

				headers.append('Content-Type', 'application/json');
				headers.append('Content-Type', 'x-www-form-urlencoded');
				headers.append('Content-Encoding', 'gzip');

				const keys = [];

				for (const key of headers.keys()) {
					keys.push(key);
				}

				expect(keys).toEqual(['Content-Type', 'Content-Encoding']);
			});
		});

		describe('*values()', () => {
			it('Returns an iterator for values.', () => {
				const headers = new Headers();

				headers.append('Content-Type', 'application/json');
				headers.append('Content-Type', 'x-www-form-urlencoded');
				headers.append('Content-Encoding', 'gzip');

				const values = [];

				for (const value of headers.values()) {
					values.push(value);
				}

				expect(values).toEqual(['application/json, x-www-form-urlencoded', 'gzip']);
			});
		});

		describe('*entries()', () => {
			it('Returns an iterator for keys and values.', () => {
				const headers = new Headers();

				headers.set('Content-Type', 'application/json');
				headers.set('Content-Type', 'x-www-form-urlencoded');
				headers.set('Content-Encoding', 'gzip');

				const entries = {};

				for (const [key, value] of headers.entries()) {
					entries[key] = value;
				}

				expect(entries).toEqual({
					'Content-Type': 'x-www-form-urlencoded',
					'Content-Encoding': 'gzip'
				});
			});
		});

		describe('*[Symbol.iterator]()', () => {
			it('Returns an iterator for keys and values.', () => {
				const headers = new Headers();

				headers.set('Content-Type', 'application/json');
				headers.set('Content-Type', 'x-www-form-urlencoded');
				headers.set('Content-Encoding', 'gzip');

				const entries = {};

				for (const [key, value] of headers) {
					entries[key] = value;
				}

				expect(entries).toEqual({
					'Content-Type': 'x-www-form-urlencoded',
					'Content-Encoding': 'gzip'
				});
			});
		});
	});
});

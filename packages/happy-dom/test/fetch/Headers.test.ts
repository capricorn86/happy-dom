import Headers from '../../src/fetch/Headers.js';
import { describe, it, expect } from 'vitest';

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

			it('Returns the value of Header as it is, set with an empty string.', () => {
				const headers = new Headers();

				headers.append('X-A', '');

				expect(headers.get('X-A')).toBe('');
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

		describe('getSetCookie()', () => {
			it('Returns an empty list if there is no Set-Cookie header.', () => {
				const headers = new Headers();

				expect(headers.getSetCookie()).toEqual([]);
			});

			it('Returns as a list of empty characters if the Set-Cookie header is set to an empty string.', () => {
				const headers = new Headers();
				headers.append('Set-Cookie', '');

				expect(headers.getSetCookie()).toEqual(['']);
			});

			it('Returns an array of strings representing the values of all the different Set-Cookie headers.', () => {
				const headers = new Headers();

				headers.append('Content-Type', 'application/json');
				headers.append('Set-Cookie', 'a=1');
				headers.append('Set-Cookie', 'b=2; Expires=Fri, 01 Jan 2100 00:00:00 GMT');

				expect(headers.getSetCookie()).toEqual([
					'a=1',
					'b=2; Expires=Fri, 01 Jan 2100 00:00:00 GMT'
				]);

				const headers2 = new Headers();

				headers2.append(
					'Set-Cookie',
					'key=value; HttpOnly; Path=/; Expires=Fri, 01 Jan 2100 00:00:00 GMT'
				);

				expect(headers2.getSetCookie()).toEqual([
					'key=value; HttpOnly; Path=/; Expires=Fri, 01 Jan 2100 00:00:00 GMT'
				]);

				const headers3 = new Headers();

				headers3.append(
					'Set-Cookie',
					'key1=value1; HttpOnly; Path=/; Expires=Fri, 01 Jan 2100 00:00:00 GMT'
				);

				headers3.append('Set-Cookie', 'key2=value2; Domain=example.com; Max-Age=1');

				expect(headers3.getSetCookie()).toEqual([
					'key1=value1; HttpOnly; Path=/; Expires=Fri, 01 Jan 2100 00:00:00 GMT',
					'key2=value2; Domain=example.com; Max-Age=1'
				]);
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

				const keys: string[] = [];

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

				const values: string[] = [];

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

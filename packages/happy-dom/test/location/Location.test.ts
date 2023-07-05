import DOMException from '../../src/exception/DOMException.js';
import DOMExceptionNameEnum from '../../src/exception/DOMExceptionNameEnum.js';
import Location from '../../src/location/Location.js';
import { beforeEach, describe, it, expect } from 'vitest';

const HREF = 'https://google.com/some-path/?key=value&key2=value2#hash';

describe('Location', () => {
	let location: Location;

	beforeEach(() => {
		location = new Location();
	});

	describe('replace()', () => {
		it('Replaces the url.', () => {
			location.replace(HREF);
			expect(location.href).toBe(HREF);
		});
	});

	describe('assign()', () => {
		it('Assign the url.', () => {
			location.assign(HREF);
			expect(location.href).toBe(HREF);
		});
	});

	describe('reload()', () => {
		it('Does nothing.', () => {
			location.replace(HREF);
			location.reload();
			expect(location.href).toBe(HREF);
		});
	});

	describe('href', () => {
		it('Successully sets a relative URL.', () => {
			location.href = HREF;
			expect(location.href).toBe(HREF);
			location.href = '/foo';
			expect(location.href).toBe('https://google.com/foo');
		});

		it('Fails when it is not possible to construct a relative URL.', () => {
			let error: Error | null = null;

			try {
				location.href = '/foo';
			} catch (e) {
				error = e;
			}

			expect(error).toEqual(
				new DOMException(
					`Failed to construct URL from string "/foo" relative to URL "about:blank".`,
					DOMExceptionNameEnum.uriMismatchError
				)
			);
		});
	});
});

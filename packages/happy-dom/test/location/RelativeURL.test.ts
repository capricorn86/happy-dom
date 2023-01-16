import { URL } from 'url';
import Location from '../../src/location/Location';

describe('RelativeURL', () => {
	let location: Location;

	beforeEach(() => {
		location = new Location();
	});

	describe('getAbsoluteURL()', () => {
		it('Returns absolute URL when location is "https://localhost:8080/base/" and URL is "path/to/resource/".', () => {
			location.href = 'https://localhost:8080/base/';
			expect(new URL('path/to/resource/', location).href).toBe(
				'https://localhost:8080/base/path/to/resource/'
			);
		});

		it('Returns absolute URL when location is "https://localhost:8080" and URL is "path/to/resource/".', () => {
			location.href = 'https://localhost:8080';
			expect(new URL('path/to/resource/', location).href).toBe(
				'https://localhost:8080/path/to/resource/'
			);
		});

		it('Returns absolute URL when URL is "https://localhost:8080/path/to/resource/".', () => {
			expect(new URL('https://localhost:8080/path/to/resource/', location).href).toBe(
				'https://localhost:8080/path/to/resource/'
			);
		});
	});
});

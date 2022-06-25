import Location from '../../src/location/Location';
import RelativeURL from '../../src/location/RelativeURL';

describe('RelativeURL', () => {
	let location: Location;

	beforeEach(() => {
		location = new Location();
	});

	describe('getAbsoluteURL()', () => {
		it('Returns absolute URL when location is "https://localhost:8080/base/" and URL is "path/to/resource/".', () => {
			location.href = 'https://localhost:8080/base/';
			expect(RelativeURL.getAbsoluteURL(location, 'path/to/resource/')).toBe(
				'https://localhost:8080/path/to/resource/'
			);
		});

		it('Returns absolute URL when location is "https://localhost:8080" and URL is "path/to/resource/".', () => {
			location.href = 'https://localhost:8080';
			expect(RelativeURL.getAbsoluteURL(location, 'path/to/resource/')).toBe(
				'https://localhost:8080/path/to/resource/'
			);
		});

		it('Returns absolute URL when URL is "https://localhost:8080/path/to/resource/".', () => {
			expect(RelativeURL.getAbsoluteURL(location, 'https://localhost:8080/path/to/resource/')).toBe(
				'https://localhost:8080/path/to/resource/'
			);
		});
	});
});

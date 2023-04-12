import Location from '../../src/location/Location';

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
		it('Replaces the url.', () => {
			location.replace(HREF);
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
		it('Set href.', () => {
			location.href = HREF;
			location.href = '/foo';
			expect(location.href).toBe('https://google.com/foo/');
		});
	});
});

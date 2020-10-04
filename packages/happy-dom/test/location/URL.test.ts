import URL from '../../src/location/URL';

describe('URL', () => {
	describe('constructor()', () => {
		test('Parses "https://google.com/some-path/?key=value&key2=value2#hash".', () => {
			const href = 'https://google.com/some-path/?key=value&key2=value2#hash';
			const url = new URL(href);
			expect(url.href).toBe(href);
			expect(url.protocol).toBe('https:');
			expect(url.hostname).toBe('google.com');
			expect(url.port).toBe('');
			expect(url.pathname).toBe('/some-path/');
			expect(url.search).toBe('?key=value&key2=value2');
			expect(url.hash).toBe('#hash');
			expect(url.username).toBe('');
			expect(url.password).toBe('');
			expect(url.host).toBe('google.com');
			expect(url.origin).toBe('https://google.com');
		});

		test('Parses "https://user:password@google.com/some-path/".', () => {
			const href = 'https://user:password@google.com/some-path/';
			const url = new URL(href);
			expect(url.href).toBe(href);
			expect(url.protocol).toBe('https:');
			expect(url.hostname).toBe('google.com');
			expect(url.port).toBe('');
			expect(url.pathname).toBe('/some-path/');
			expect(url.search).toBe('');
			expect(url.hash).toBe('');
			expect(url.username).toBe('user');
			expect(url.password).toBe('password');
			expect(url.host).toBe('google.com');
			expect(url.origin).toBe('https://google.com');
		});

		test('Parses "https://google.com:8080/some-path/".', () => {
			const href = 'https://google.com:8080/some-path/';
			const url = new URL(href);
			expect(url.href).toBe(href);
			expect(url.protocol).toBe('https:');
			expect(url.hostname).toBe('google.com');
			expect(url.port).toBe(':8080');
			expect(url.pathname).toBe('/some-path/');
			expect(url.search).toBe('');
			expect(url.hash).toBe('');
			expect(url.username).toBe('');
			expect(url.password).toBe('');
			expect(url.host).toBe('google.com:8080');
			expect(url.origin).toBe('https://google.com:8080');
		});
	});
});

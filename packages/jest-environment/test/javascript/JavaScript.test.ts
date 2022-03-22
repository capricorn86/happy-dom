describe('JavaScript', () => {
	it('Functions should have the constructor global.Function', () => {
		expect((() => {}).constructor).toBe(Function);
	});

	it('Object should have the constructor global.Object', () => {
		expect({}.constructor).toBe(Object);
	});

	it('Can perform a real fetch() to Github.com', async () => {
		const response = await fetch(
			'https://raw.githubusercontent.com/capricorn86/happy-dom/master/.gitignore'
		);

		expect(response.headers.get('content-type')).toBe('text/plain; charset=utf-8');
		expect(response.ok).toBe(true);
		expect(response.status).toBe(200);
		expect(response.statusText).toBe('OK');
		expect(response.url).toBe(
			'https://raw.githubusercontent.com/capricorn86/happy-dom/master/.gitignore'
		);
		expect(response.redirected).toBe(false);

		const body = await response.text();

		expect(body.includes('node_modules')).toBe(true);
	});
});

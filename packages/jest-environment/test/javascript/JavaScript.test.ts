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

	it('Can perform a real asynchronous XMLHttpRequest request to Github.com', (done) => {
		const request = new XMLHttpRequest();

		request.open(
			'GET',
			'https://raw.githubusercontent.com/capricorn86/happy-dom/master/.gitignore',
			true
		);

		request.addEventListener('load', () => {
			expect(request.getResponseHeader('content-type')).toBe('text/plain; charset=utf-8');
			expect(request.responseText.includes('node_modules')).toBe(true);
			expect(request.status).toBe(200);
			expect(request.statusText).toBe('OK');
			expect(request.responseURL).toBe(
				'https://raw.githubusercontent.com/capricorn86/happy-dom/master/.gitignore'
			);
			done();
		});

		request.send();
	});

	it('Can perform a real synchronous XMLHttpRequest request to Github.com', () => {
		const request = new XMLHttpRequest();

		request.open(
			'GET',
			'https://raw.githubusercontent.com/capricorn86/happy-dom/master/.gitignore',
			false
		);

		request.send();

		expect(request.getResponseHeader('content-type')).toBe('text/plain; charset=utf-8');
		expect(request.responseText.includes('node_modules')).toBe(true);
		expect(request.status).toBe(200);
		expect(request.statusText).toBe('OK');
		expect(request.responseURL).toBe(
			'https://raw.githubusercontent.com/capricorn86/happy-dom/master/.gitignore'
		);
	});

	it('Binds global methods to the Window context', () => {
		const eventListener = (): void => {};
		addEventListener('click', eventListener);
		removeEventListener('click', eventListener);
		clearTimeout(setTimeout(eventListener));
	});
});

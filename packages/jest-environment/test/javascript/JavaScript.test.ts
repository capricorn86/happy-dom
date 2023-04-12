import Express from 'express';

describe('JavaScript', () => {
	it('Functions should have the constructor global.Function', () => {
		expect((() => {}).constructor).toBe(Function);
	});

	it('Object should have the constructor global.Object', () => {
		expect({}.constructor).toBe(Object);
	});

	it('Can perform a real fetch()', async () => {
		const express = Express();

		express.get('/get/json', (_req, res) => {
			res.set('Content-Type', 'application/json');
			res.send('{ "key1": "value1" }');
		});

		const server = express.listen(3000);

		const response = await fetch('http://localhost:3000/get/json');

		server.close();

		expect(response.headers.get('content-type')).toBe('application/json; charset=utf-8');
		expect(response.ok).toBe(true);
		expect(response.status).toBe(200);
		expect(response.statusText).toBe('OK');
		expect(response.url).toBe('http://localhost:3000/get/json');
		expect(response.redirected).toBe(false);

		const json = await response.json();

		expect(json.key1).toBe('value1');
	});

	it('Can perform a real FormData post request using fetch()', async () => {
		const express = Express();

		express.post('/post/formdata', (req, res) => {
			let body = '';
			res.set('Content-Type', 'text/html');
			req.on('data', function (chunk) {
				body += chunk.toString();
			});
			req.on('end', function () {
				res.send(`header:\n${req.headers['content-type']}\n\nbody:\n${body}`);
			});
		});

		const server = express.listen(3000);

		const requestFormData = new FormData();

		requestFormData.append('key1', 'value1');
		requestFormData.append('key2', 'value2');

		const response = await fetch('http://localhost:3000/post/formdata', {
			method: 'POST',
			body: requestFormData
		});

		expect(response.headers.get('content-type')).toBe('text/html; charset=utf-8');
		expect(response.ok).toBe(true);
		expect(response.status).toBe(200);
		expect(response.statusText).toBe('OK');
		expect(response.url).toBe('http://localhost:3000/post/formdata');
		expect(response.redirected).toBe(false);

		const text = await response.text();

		server.close();

		expect(
			text.replace(
				/\-\-\-\-HappyDOMFormDataBoundary0\.[a-zA-Z0-9]+/gm,
				'----HappyDOMFormDataBoundary0.noRandom'
			)
		).toBe(
			'header:\nmultipart/form-data; boundary=----HappyDOMFormDataBoundary0.noRandom\n\nbody:\n------HappyDOMFormDataBoundary0.noRandom\r\nContent-Disposition: form-data; name="key1"\r\n\r\nvalue1\r\n------HappyDOMFormDataBoundary0.noRandom\r\nContent-Disposition: form-data; name="key2"\r\n\r\nvalue2\r\n'
		);
	});

	it('Can perform a real asynchronous XMLHttpRequest request', (done) => {
		const express = Express();

		express.get('/get/json', (_req, res) => {
			res.set('Content-Type', 'application/json');
			res.send('{ "key1": "value1" }');
		});

		const server = express.listen(3000);

		const request = new XMLHttpRequest();

		request.open('GET', 'http://localhost:3000/get/json', true);

		request.addEventListener('load', () => {
			expect(request.getResponseHeader('content-type')).toBe('application/json; charset=utf-8');
			expect(request.responseText).toBe('{ "key1": "value1" }');
			expect(request.status).toBe(200);
			expect(request.statusText).toBe('OK');
			expect(request.responseURL).toBe('http://localhost:3000/get/json');

			server.close();

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

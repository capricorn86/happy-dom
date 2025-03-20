import { describe, it, expect } from '../utilities/TestFunctions.js';
import { Window } from 'happy-dom';
import Express from 'express';

describe('Fetch', () => {
	it('Can perform a real fetch()', async () => {
		const window = new Window({
			url: 'http://localhost:3000'
		});
		const express = Express();

		express.get('/get/json', (_req, res) => {
			res.set('Content-Type', 'application/json');
			res.send('{ "key1": "value1" }');
		});

		const server = express.listen(3000);

		const response = await window.fetch('http://localhost:3000/get/json');

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
		const window = new Window({
			url: 'http://localhost:3000'
		});
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

		const requestFormData = new window.FormData();

		requestFormData.append('key1', 'value1');
		requestFormData.append('key2', 'value2');

		const response = await window.fetch('http://localhost:3000/post/formdata', {
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
			'header:\nmultipart/form-data; boundary=----HappyDOMFormDataBoundary0.noRandom\n\nbody:\n------HappyDOMFormDataBoundary0.noRandom\r\nContent-Disposition: form-data; name="key1"\r\n\r\nvalue1\r\n------HappyDOMFormDataBoundary0.noRandom\r\nContent-Disposition: form-data; name="key2"\r\n\r\nvalue2\r\n------HappyDOMFormDataBoundary0.noRandom--\r\n'
		);
	});
});

import { Window } from 'happy-dom';
import Express from 'express';
import { describe, it } from 'node:test';
import assert from 'node:assert';

describe('Fetch', () => {
	it('Can perform a real fetch()', async () => {
		const window = new Window({
			url: 'http://localhost:3001'
		});
		const express = Express();

		express.get('/get/json', (_req, res) => {
			res.set('Content-Type', 'application/json');
			res.send('{ "key1": "value1" }');
		});

		const server = express.listen(3001);

		const response = await window.fetch('http://localhost:3001/get/json');

		await server.close();

		assert.strictEqual(response.headers.get('content-type'), 'application/json; charset=utf-8');
		assert.strictEqual(response.ok, true);
		assert.strictEqual(response.status, 200);
		assert.strictEqual(response.statusText, 'OK');
		assert.strictEqual(response.url, 'http://localhost:3001/get/json');
		assert.strictEqual(response.redirected, false);

		const json = await response.json();

		assert.strictEqual(json.key1, 'value1');
	});

	it('Can perform a real FormData post request using fetch()', async () => {
		const window = new Window({
			url: 'http://localhost:3001'
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

		const server = express.listen(3001);

		const requestFormData = new window.FormData();

		requestFormData.append('key1', 'value1');
		requestFormData.append('key2', 'value2');

		const response = await window.fetch('http://localhost:3001/post/formdata', {
			method: 'POST',
			body: requestFormData
		});

		assert.strictEqual(response.headers.get('content-type'), 'text/html; charset=utf-8');
		assert.strictEqual(response.ok, true);
		assert.strictEqual(response.status, 200);
		assert.strictEqual(response.statusText, 'OK');
		assert.strictEqual(response.url, 'http://localhost:3001/post/formdata');
		assert.strictEqual(response.redirected, false);

		const text = await response.text();

		await server.close();

		assert.strictEqual(
			text.replace(
				/\-\-\-\-HappyDOMFormDataBoundary0\.[a-zA-Z0-9]+/gm,
				'----HappyDOMFormDataBoundary0.noRandom'
			),
			'header:\nmultipart/form-data; boundary=----HappyDOMFormDataBoundary0.noRandom\n\nbody:\n------HappyDOMFormDataBoundary0.noRandom\r\nContent-Disposition: form-data; name="key1"\r\n\r\nvalue1\r\n------HappyDOMFormDataBoundary0.noRandom\r\nContent-Disposition: form-data; name="key2"\r\n\r\nvalue2\r\n------HappyDOMFormDataBoundary0.noRandom--\r\n'
		);
	});
});

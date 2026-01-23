import { Window } from 'happy-dom';
import Express from 'express';
import { describe, it } from 'node:test';
import assert from 'node:assert';

describe('XMLHttpRequest', () => {
	it('Can perform a real asynchronous XMLHttpRequest request', async () => {
		await new Promise((resolve) => {
			const window = new Window({
				url: 'http://localhost:3000/'
			});
			const express = Express();

			express.get('/get/json', (_req, res) => {
				res.set('Content-Type', 'application/json');
				res.send('{ "key1": "value1" }');
			});

			const server = express.listen(3000);
			const request = new window.XMLHttpRequest();

			request.open('GET', 'http://localhost:3000/get/json', true);

			request.addEventListener('load', () => {
				assert.strictEqual(
					request.getResponseHeader('content-type'),
					'application/json; charset=utf-8'
				);
				assert.strictEqual(request.responseText, '{ "key1": "value1" }');
				assert.strictEqual(request.status, 200);
				assert.strictEqual(request.statusText, 'OK');
				assert.strictEqual(request.responseURL, 'http://localhost:3000/get/json');

				server.close();

				resolve(null);
			});

			request.send();
		});
	});

	it('Send Authorization header in case of same origin request', async () => {
		await new Promise((resolve) => {
			const window = new Window({
				url: 'http://localhost:3000/'
			});
			const express = Express();

			express.get('/get/json', (req, res) => {
				if (req.get('Authorization') === 'Basic test') {
					res.sendStatus(200);
				} else {
					res.sendStatus(401);
				}
			});

			const server = express.listen(3000);
			const request = new window.XMLHttpRequest();

			request.open('GET', 'http://localhost:3000/get/json', true);

			request.setRequestHeader('Authorization', 'Basic test');

			request.addEventListener('load', () => {
				assert.strictEqual(request.status, 200);
				assert.strictEqual(request.statusText, 'OK');
				assert.strictEqual(request.responseURL, 'http://localhost:3000/get/json');

				server.close();

				resolve(null);
			});

			request.send();
		});
	});

	it('Can perform a real synchronous XMLHttpRequest request to Github.com', () => {
		const window = new Window({
			url: 'https://raw.githubusercontent.com/'
		});
		const request = new window.XMLHttpRequest();

		request.open(
			'GET',
			'https://raw.githubusercontent.com/capricorn86/happy-dom/master/.gitignore',
			false
		);

		request.send();

		assert.strictEqual(request.getResponseHeader('content-type'), 'text/plain; charset=utf-8');
		assert.strictEqual(request.responseText.includes('node_modules'), true);
		assert.strictEqual(request.status, 200);
		assert.strictEqual(request.statusText, 'OK');
		assert.strictEqual(
			request.responseURL,
			'https://raw.githubusercontent.com/capricorn86/happy-dom/master/.gitignore'
		);
	});
});

import { describe, it, expect } from '../utilities/TestFunctions.js';
import { Window } from 'happy-dom';
import Express from 'express';

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
				expect(request.getResponseHeader('content-type')).toBe('application/json; charset=utf-8');
				expect(request.responseText).toBe('{ "key1": "value1" }');
				expect(request.status).toBe(200);
				expect(request.statusText).toBe('OK');
				expect(request.responseURL).toBe('http://localhost:3000/get/json');

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
				expect(request.status).toBe(200);
				expect(request.statusText).toBe('OK');
				expect(request.responseURL).toBe('http://localhost:3000/get/json');

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

		expect(request.getResponseHeader('content-type')).toBe('text/plain; charset=utf-8');
		expect(request.responseText.includes('node_modules')).toBe(true);
		expect(request.status).toBe(200);
		expect(request.statusText).toBe('OK');
		expect(request.responseURL).toBe(
			'https://raw.githubusercontent.com/capricorn86/happy-dom/master/.gitignore'
		);
	});
});

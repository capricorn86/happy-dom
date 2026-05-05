import { Window } from 'happy-dom';
import { describe, it } from 'node:test';
import assert from 'node:assert';

describe('WebSocket', () => {
	it('Can use WebSocket on a real endpoint', async () => {
		const window = new Window({
			url: 'http://localhost:3001'
		});

		await new Promise((resolve, reject) => {
			const socket = new window.WebSocket('wss://echo.websocket.org');

			// Connection opened
			socket.addEventListener('open', () => {
				// Send a test message
				socket.send('Hello, WebSocket Echo Server!');

				// Send JSON data
				socket.send(
					JSON.stringify({
						type: 'test',
						timestamp: Date.now(),
						message: 'Testing echo functionality'
					})
				);

				// Close the connection after receiving the messages
				socket.close(4000, 'Normal Closure');
			});

			// Listen for echoed messages
			socket.addEventListener('message', (event) => {
				let parsed = null;
				try {
					parsed = JSON.parse(event.data);
				} catch (e) {
					// Not JSON
				}

				if (parsed) {
					assert.strictEqual(parsed.type, 'test');
					assert.strictEqual(parsed.message, 'Testing echo functionality');
					assert.ok(typeof parsed.timestamp === 'number');
				} else {
					assert.strictEqual(event.data, 'Hello, WebSocket Echo Server!');
				}
			});

			// Handle errors
			socket.addEventListener('error', (event) => {
				reject(event.error);
			});

			// Connection closed
			socket.addEventListener('close', (event) => {
				assert.strictEqual(event.code, 4000);
				resolve(null);
			});
		});
	});
});

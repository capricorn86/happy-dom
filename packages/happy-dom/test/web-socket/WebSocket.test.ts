import Window from '../../src/window/Window.js';
import { beforeEach, describe, it, vi, expect } from 'vitest';
import Event from '../../src/event/Event.js';
import * as PropertySymbol from '../../src/PropertySymbol.js';
import MessageEvent from '../../src/event/events/MessageEvent.js';
import CloseEvent from '../../src/event/events/CloseEvent.js';
import DOMExceptionNameEnum from '../../src/exception/DOMExceptionNameEnum.js';

vi.mock('ws', () => {
	/* eslint-disable jsdoc/require-jsdoc */
	class WebSocketMock {
		public internalInit: {
			url: string;
			protocols?: string | string[];
			options?: { headers?: Record<string, string>; rejectUnauthorized?: boolean };
		};
		public internalListeners: Record<string, Function[]> = {};
		public internalState: 'open' | 'closed' | 'terminated' = 'open';
		public internalMessagesSent: Array<{ data: any; options?: { binary?: boolean } }> = [];
		public extensions: Record<string, string> = { extension1: 'value1', extensions2: 'value2' };
		public protocol: string = 'protocol1';
		constructor(
			url: string,
			protocols?: string | string[],
			options?: { headers?: Record<string, string>; rejectUnauthorized?: boolean }
		) {
			this.internalInit = { url, protocols, options };
		}
		public on(event: string, listener: Function): void {
			if (!this.internalListeners[event]) {
				this.internalListeners[event] = [];
			}
			this.internalListeners[event].push(listener);
		}
		public once(event: string, listener: Function): void {
			const onceListener = (...args: any[]): void => {
				listener(...args);
				this.off(event, onceListener);
			};
			this.on(event, onceListener);
		}
		public off(event: string, listener: Function): void {
			const index = this.internalListeners[event]?.indexOf(listener);
			if (index === undefined || index === -1) {
				return;
			}
			this.internalListeners[event].splice(index, 1);
		}
		public close(code?: number, reason?: string): void {
			this.internalState = 'closed';
			this.internalListeners.close?.forEach((listener) =>
				listener(code ?? 3000, reason ?? 'close() called')
			);
		}
		public terminate(): void {
			this.internalState = 'terminated';
			this.internalListeners.close?.forEach((listener) => listener(4000, 'terminate() called'));
		}
		public send(data: any, options?: { binary?: boolean }): void {
			this.internalMessagesSent.push({ data, options });
		}
	}
	/* eslint-enable jsdoc/require-jsdoc */
	return { default: WebSocketMock };
});

describe('WebSocket', () => {
	let window: Window;

	beforeEach(() => {
		window = new Window({ url: 'https://localhost:8080' });
	});

	describe('get static CONNECTING()', () => {
		it('Returns CONNECTING constant.', () => {
			expect(window.WebSocket.CONNECTING).toBe(0);
		});
	});

	describe('get static OPEN()', () => {
		it('Returns OPEN constant.', () => {
			expect(window.WebSocket.OPEN).toBe(1);
		});
	});

	describe('get static CLOSING()', () => {
		it('Returns CLOSING constant.', () => {
			expect(window.WebSocket.CLOSING).toBe(2);
		});
	});
	describe('get static CLOSED()', () => {
		it('Returns CLOSED constant.', () => {
			expect(window.WebSocket.CLOSED).toBe(3);
		});
	});

	describe('constructor()', () => {
		it('Connects to web socket with a path in the URL.', async () => {
			const socket = new window.WebSocket('ws://echo.websocket.org/chat/room1');
			const ws = <any>socket[PropertySymbol.webSocket];

			expect(ws.internalInit).toEqual({
				url: new URL('ws://echo.websocket.org/chat/room1'),
				protocols: [],
				options: {
					headers: {
						'user-agent': window.navigator.userAgent,
						cookie: '',
						origin: 'https://localhost:8080'
					},
					rejectUnauthorized: true
				}
			});

			expect(socket.url).toBe('ws://echo.websocket.org/chat/room1');
		});

		it('Removes fragment from URL.', async () => {
			const socket = new window.WebSocket('ws://echo.websocket.org/chat#section');
			const ws = <any>socket[PropertySymbol.webSocket];

			expect(ws.internalInit).toEqual({
				url: new URL('ws://echo.websocket.org/chat'),
				protocols: [],
				options: {
					headers: {
						'user-agent': window.navigator.userAgent,
						cookie: '',
						origin: 'https://localhost:8080'
					},
					rejectUnauthorized: true
				}
			});

			expect(socket.url).toBe('ws://echo.websocket.org/chat');
		});

		it('Connects to web socket and listens to "open" event.', async () => {
			window.document.cookie = 'sessionId=abc123';

			const socket = new window.WebSocket('ws://echo.websocket.org');
			const ws = <any>socket[PropertySymbol.webSocket];

			expect(ws.internalInit).toEqual({
				url: new URL('ws://echo.websocket.org'),
				protocols: [],
				options: {
					headers: {
						'user-agent': window.navigator.userAgent,
						cookie: 'sessionId=abc123',
						origin: 'https://localhost:8080'
					},
					rejectUnauthorized: true
				}
			});

			let event: Event | null = null;

			socket.addEventListener('open', (e) => (event = e));
			ws.internalListeners['open'][0]();

			expect(socket.readyState).toBe(window.WebSocket.OPEN);
			expect(event!.type).toBe('open');

			expect(ws.internalListeners['open'].length).toBe(0);
		});

		it('Connects to web socket with multiple protocols specified.', async () => {
			window.document.cookie = 'sessionId=abc123';

			const socket = new window.WebSocket('ws://echo.websocket.org', ['protocol1', 'protocol2']);
			const ws = <any>socket[PropertySymbol.webSocket];

			expect(ws.internalInit).toEqual({
				url: new URL('ws://echo.websocket.org'),
				protocols: ['protocol1', 'protocol2'],
				options: {
					headers: {
						'user-agent': window.navigator.userAgent,
						cookie: 'sessionId=abc123',
						origin: 'https://localhost:8080'
					},
					rejectUnauthorized: true
				}
			});
		});

		it('Connects to web socket with a single protocol specified.', async () => {
			window.document.cookie = 'sessionId=abc123';

			const socket = new window.WebSocket('ws://echo.websocket.org', 'protocol1');
			const ws = <any>socket[PropertySymbol.webSocket];

			expect(ws.internalInit).toEqual({
				url: new URL('ws://echo.websocket.org'),
				protocols: ['protocol1'],
				options: {
					headers: {
						'user-agent': window.navigator.userAgent,
						cookie: 'sessionId=abc123',
						origin: 'https://localhost:8080'
					},
					rejectUnauthorized: true
				}
			});
		});

		it('Connects to web socket and listens to "message" event with string data.', async () => {
			const socket = new window.WebSocket('ws://echo.websocket.org');
			const ws = <any>socket[PropertySymbol.webSocket];

			ws.internalListeners['open'][0]();

			let event: MessageEvent | null = null;

			socket.addEventListener('message', (e) => (event = <MessageEvent>e));
			ws.internalListeners['message'][0]('Hello World', false);

			expect(event!.type).toBe('message');
			expect(event!.data).toBe('Hello World');
		});

		it('Connects to web socket and listens to "message" event with array buffer data.', async () => {
			const socket = new window.WebSocket('ws://echo.websocket.org');
			const ws = <any>socket[PropertySymbol.webSocket];

			socket.binaryType = 'arraybuffer';

			ws.internalListeners['open'][0]();

			const buffer = Buffer.from('Hello World');
			const arrayBuffer = new window.ArrayBuffer(buffer.byteLength);
			const view = new Uint8Array(arrayBuffer);

			view.set(buffer);

			let event: MessageEvent | null = null;

			socket.addEventListener('message', (e) => (event = <MessageEvent>e));
			ws.internalListeners['message'][0](arrayBuffer, true);

			expect(event!.type).toBe('message');
			expect(event!.data).toBeInstanceOf(window.ArrayBuffer);
			expect(new window.TextDecoder('utf-8').decode(<ArrayBuffer>event!.data)).toBe('Hello World');

			event = null;

			ws.internalListeners['message'][0](view, true);

			expect(event!.type).toBe('message');
			expect(event!.data).toBeInstanceOf(window.ArrayBuffer);
			expect(new window.TextDecoder('utf-8').decode(<ArrayBuffer>event!.data)).toBe('Hello World');

			event = null;

			ws.internalListeners['message'][0](buffer, true);

			expect(event!.type).toBe('message');
			expect(event!.data).toBeInstanceOf(window.ArrayBuffer);
			expect(new window.TextDecoder('utf-8').decode(<ArrayBuffer>event!.data)).toBe('Hello World');
		});

		it('Connects to web socket and listens to "message" event with blob data.', async () => {
			const socket = new window.WebSocket('ws://echo.websocket.org');
			const ws = <any>socket[PropertySymbol.webSocket];

			ws.internalListeners['open'][0]();

			const buffer = Buffer.from('Hello Blob');
			const blob = new window.Blob([buffer], { type: 'text/plain' });

			let event: MessageEvent | null = null;

			socket.addEventListener('message', (e) => (event = <MessageEvent>e));

			ws.internalListeners['message'][0](blob, true);

			expect(event!.type).toBe('message');
			expect(event!.data).toBeInstanceOf(window.Blob);

			const text = await (<Blob>event!.data).text();
			expect(text).toBe('Hello Blob');

			event = null;

			ws.internalListeners['message'][0](buffer, true);

			expect(event!.type).toBe('message');
			expect(event!.data).toBeInstanceOf(window.Blob);

			const textFromBuffer = await (<Blob>event!.data).text();
			expect(textFromBuffer).toBe('Hello Blob');
		});

		it('Connects to web socket and listens to "close" event.', async () => {
			const socket = new window.WebSocket('ws://echo.websocket.org');
			const ws = <any>socket[PropertySymbol.webSocket];

			expect(window[PropertySymbol.openWebSockets].includes(socket)).toBe(true);

			ws.internalListeners['open'][0]();

			let event: CloseEvent | null = null;

			socket.addEventListener('close', (e) => (event = <CloseEvent>e));
			ws.internalListeners['close'][0](1000, 'Normal Closure');
			expect(socket.readyState).toBe(window.WebSocket.CLOSED);
			expect(event!.type).toBe('close');
			expect(event!.code).toBe(1000);
			expect(event!.reason).toBe('Normal Closure');
			expect(event!.wasClean).toBe(true);

			expect(window[PropertySymbol.openWebSockets].includes(socket)).toBe(false);
			expect(ws.internalListeners['close'].length).toBe(0);
		});

		it('Connects to web socket and listens to "upgrade" event with headers as string.', async () => {
			const socket = new window.WebSocket('ws://echo.websocket.org');
			const ws = <any>socket[PropertySymbol.webSocket];

			expect(window[PropertySymbol.openWebSockets].includes(socket)).toBe(true);

			ws.internalListeners['open'][0]();

			ws.internalListeners['upgrade'][0]({ headers: { 'set-cookie': 'id=123' } });

			expect(window.document.cookie).toBe('id=123');
		});

		it('Connects to web socket and listens to "upgrade" event with headers as array.', async () => {
			const socket = new window.WebSocket('ws://echo.websocket.org');
			const ws = <any>socket[PropertySymbol.webSocket];

			expect(window[PropertySymbol.openWebSockets].includes(socket)).toBe(true);

			ws.internalListeners['open'][0]();

			ws.internalListeners['upgrade'][0]({ headers: { 'set-cookie': ['id1=123', 'id2=456'] } });

			expect(window.document.cookie).toBe('id1=123; id2=456');
		});

		it('Connects to web socket and listens to "error" event.', async () => {
			const socket = new window.WebSocket('ws://echo.websocket.org');
			const ws = <any>socket[PropertySymbol.webSocket];

			expect(window[PropertySymbol.openWebSockets].includes(socket)).toBe(true);

			ws.internalListeners['open'][0]();

			let event: CloseEvent | null = null;

			socket.addEventListener('close', (e) => (event = <CloseEvent>e));
			ws.internalListeners['error'][0](new Error('Error occurred'));
			ws.internalListeners['close'][0](1000, 'Normal Closure');
			expect(socket.readyState).toBe(window.WebSocket.CLOSED);
			expect(event!.type).toBe('close');
			expect(event!.code).toBe(1000);
			expect(event!.reason).toBe('Normal Closure');
			expect(event!.wasClean).toBe(false);

			expect(window[PropertySymbol.openWebSockets].includes(socket)).toBe(false);
			expect(ws.internalListeners['close'].length).toBe(0);
		});
	});

	describe('get readyState()', () => {
		it('Returns the ready state of the WebSocket connection.', () => {
			const socket = new window.WebSocket('ws://echo.websocket.org');
			const ws = <any>socket[PropertySymbol.webSocket];
			expect(socket.readyState).toBe(window.WebSocket.CONNECTING);
			ws.internalListeners['open'][0]();
			expect(socket.readyState).toBe(window.WebSocket.OPEN);
			ws.internalListeners['close'][0](1000, 'Normal Closure');
			expect(socket.readyState).toBe(window.WebSocket.CLOSED);
		});
	});

	describe('get extensions()', () => {
		it('Returns the extensions string.', () => {
			const socket = new window.WebSocket('ws://echo.websocket.org');
			const ws = <any>socket[PropertySymbol.webSocket];
			expect(socket.extensions).toBe('');
			ws.internalListeners['open'][0]();
			expect(socket.extensions).toBe('extension1, extensions2');
		});
	});

	describe('get binaryType()', () => {
		it('Returns the default binary type.', () => {
			const socket = new window.WebSocket('ws://echo.websocket.org');
			expect(socket.binaryType).toBe('blob');
		});
	});

	describe('set binaryType()', () => {
		it('Sets the binary type.', () => {
			const socket = new window.WebSocket('ws://echo.websocket.org');
			socket.binaryType = 'arraybuffer';
			expect(socket.binaryType).toBe('arraybuffer');
		});

		it('Ignores invalid binary type.', () => {
			const socket = new window.WebSocket('ws://echo.websocket.org');
			// @ts-expect-error
			socket.binaryType = 'invalidType';
			expect(socket.binaryType).toBe('blob');
		});
	});

	describe('get protocol()', () => {
		it('Returns the protocol.', () => {
			const socket = new window.WebSocket('ws://echo.websocket.org');
			expect(socket.protocol).toBe('protocol1');
		});
	});

	describe('get url()', () => {
		it('Returns the url.', () => {
			const socket = new window.WebSocket('ws://echo.websocket.org');
			expect(socket.url).toBe('ws://echo.websocket.org/');
		});
	});

	describe('close()', () => {
		it('Closes the WebSocket connection when it is open.', () => {
			const socket = new window.WebSocket('ws://echo.websocket.org');
			const ws = <any>socket[PropertySymbol.webSocket];

			ws.internalListeners['open'][0]();

			expect(socket.readyState).toBe(window.WebSocket.OPEN);

			let event: CloseEvent | null = null;

			socket.addEventListener('close', (e) => (event = <CloseEvent>e));

			socket.close(1000, 'Reason for closing');

			expect(ws.internalState).toBe('closed');
			expect(event!.code).toBe(1000);
			expect(event!.reason).toBe('Reason for closing');
			expect(event!.wasClean).toBe(true);

			expect(socket.readyState).toBe(window.WebSocket.CLOSED);

			expect(socket[PropertySymbol.webSocket]).toBeNull();
			expect(window[PropertySymbol.openWebSockets].includes(socket)).toBe(false);
		});

		it('Terminates the WebSocket connection when it is connecting.', () => {
			const socket = new window.WebSocket('ws://echo.websocket.org');
			const ws = <any>socket[PropertySymbol.webSocket];

			expect(socket.readyState).toBe(window.WebSocket.CONNECTING);

			let event: CloseEvent | null = null;

			socket.addEventListener('close', (e) => (event = <CloseEvent>e));

			socket.close(1000, 'Reason for closing');

			expect(ws.internalState).toBe('terminated');
			expect(event!.code).toBe(4000);
			expect(event!.reason).toBe('terminate() called');
			expect(event!.wasClean).toBe(true);

			expect(socket.readyState).toBe(window.WebSocket.CLOSED);
		});

		it('Does nothing when the WebSocket connection is already closed.', () => {
			const socket = new window.WebSocket('ws://echo.websocket.org');
			const ws = <any>socket[PropertySymbol.webSocket];

			ws.internalListeners['open'][0]();
			ws.internalListeners['close'][0](1000, 'Normal Closure');

			let event: CloseEvent | null = null;

			socket.addEventListener('close', (e) => (event = <CloseEvent>e));

			expect(socket.readyState).toBe(window.WebSocket.CLOSED);
			socket.close(3000, 'Reason for closing');

			expect(event).toBeNull();
		});

		it('Allow for code and reason to be optional.', () => {
			const socket = new window.WebSocket('ws://echo.websocket.org');
			const ws = <any>socket[PropertySymbol.webSocket];
			ws.internalListeners['open'][0]();

			let event: CloseEvent | null = null;
			socket.addEventListener('close', (e) => (event = <CloseEvent>e));
			socket.close();
			expect(ws.internalState).toBe('closed');
			expect(event!.code).toBe(3000);
			expect(event!.reason).toBe('close() called');
			expect(event!.wasClean).toBe(true);
		});
	});

	describe('send()', () => {
		it('Sends string data through the WebSocket connection.', () => {
			const socket = new window.WebSocket('ws://echo.websocket.org');
			const ws = <any>socket[PropertySymbol.webSocket];
			ws.internalListeners['open'][0]();

			socket.send('Hello World');
			expect(ws.internalMessagesSent).toEqual([
				{ data: 'Hello World', options: { binary: false } }
			]);
		});

		it('Sends ArrayBuffer data through the WebSocket connection.', () => {
			const socket = new window.WebSocket('ws://echo.websocket.org');
			const ws = <any>socket[PropertySymbol.webSocket];
			ws.internalListeners['open'][0]();

			const buffer = new Uint8Array([72, 101, 108, 108, 111]); // "Hello" in ASCII
			socket.send(buffer.buffer);
			expect(ws.internalMessagesSent).toEqual([
				{ data: Buffer.from(buffer), options: { binary: true } }
			]);
		});

		it('Sends Blob data through the WebSocket connection.', async () => {
			const socket = new window.WebSocket('ws://echo.websocket.org');
			const ws = <any>socket[PropertySymbol.webSocket];
			ws.internalListeners['open'][0]();
			const blob = new window.Blob(['Hello Blob'], { type: 'text/plain' });
			const arrayBuffer = await blob.arrayBuffer();
			socket.send(blob);
			expect(ws.internalMessagesSent).toEqual([
				{ data: Buffer.from(arrayBuffer), options: { binary: true } }
			]);
		});

		it('Sends ArrayBufferView data through the WebSocket connection.', () => {
			const socket = new window.WebSocket('ws://echo.websocket.org');
			const ws = <any>socket[PropertySymbol.webSocket];
			ws.internalListeners['open'][0]();
			const uint8Array = new Uint8Array([72, 101, 108, 108, 111]); // "Hello" in ASCII
			socket.send(uint8Array);
			expect(ws.internalMessagesSent).toEqual([
				{
					data: Buffer.from(uint8Array.buffer, uint8Array.byteOffset, uint8Array.byteLength),
					options: { binary: true }
				}
			]);
		});

		it('Sends Buffer data through the WebSocket connection.', () => {
			const socket = new window.WebSocket('ws://echo.websocket.org');
			const ws = <any>socket[PropertySymbol.webSocket];
			ws.internalListeners['open'][0]();
			const buffer = Buffer.from('Hello Buffer');
			socket.send(buffer);
			expect(ws.internalMessagesSent).toEqual([{ data: buffer, options: { binary: true } }]);
		});

		it('Throws an error when trying to send data on a connecting WebSocket connection.', () => {
			const socket = new window.WebSocket('ws://echo.websocket.org');
			expect(() => {
				socket.send('Hello World');
			}).toThrowError(
				new window.DOMException(
					'Still in CONNECTING state.',
					DOMExceptionNameEnum.invalidStateError
				)
			);
		});

		it('Ignores sending data on a closed WebSocket connection.', () => {
			const socket = new window.WebSocket('ws://echo.websocket.org');
			const ws = <any>socket[PropertySymbol.webSocket];
			ws.internalListeners['open'][0]();
			ws.internalListeners['close'][0](1000, 'Normal Closure');
			expect(() => {
				socket.send('Hello World');
			}).not.toThrow();
		});
	});

	describe('[PropertySymbol.destroy]()', () => {
		it('Cleans up the WebSocket instance.', () => {
			const socket = new window.WebSocket('ws://echo.websocket.org');
			const ws = <any>socket[PropertySymbol.webSocket];

			ws.internalListeners['open'][0]();

			socket[PropertySymbol.destroy]();

			expect(ws.internalState).toBe('closed');
			expect(socket[PropertySymbol.webSocket]).toBeNull();

			expect(socket[PropertySymbol.listeners].capturing.size).toBe(0);
			expect(socket[PropertySymbol.listeners].bubbling.size).toBe(0);
			expect(socket[PropertySymbol.listenerOptions].capturing.size).toBe(0);
			expect(socket[PropertySymbol.listenerOptions].bubbling.size).toBe(0);

			expect(window[PropertySymbol.openWebSockets].includes(socket)).toBe(false);
		});
	});
});

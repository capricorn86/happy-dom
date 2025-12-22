import Window from '../../src/window/Window.js';
import { beforeEach, describe, it, vi, expect } from 'vitest';
import MessageEvent from '../../src/event/events/MessageEvent.js';
import CloseEvent from '../../src/event/events/CloseEvent.js';

vi.mock('ws', () => {
	/* eslint-disable jsdoc/require-jsdoc */
	class WebSocketMock {
		public initOptions: {
			url: string;
			protocols?: string | string[];
			options?: { headers?: Record<string, string>; rejectUnauthorized?: boolean };
		};
		constructor(
			url: string,
			protocols?: string | string[],
			options?: { headers?: Record<string, string>; rejectUnauthorized?: boolean }
		) {
			this.initOptions = { url, protocols, options };
		}
	}
	/* eslint-enable jsdoc/require-jsdoc */
});

describe('WebSocket', () => {
	let window: Window;

	beforeEach(() => {
		window = new Window();
	});

	describe('constructor()', () => {
		it('Connects to web socket.', async () => {
			const socket = new window.WebSocket('ws://echo.websocket.org');
		});
	});
});

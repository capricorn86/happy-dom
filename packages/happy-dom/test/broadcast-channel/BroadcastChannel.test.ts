import Window from '../../src/window/Window.js';
import Browser from '../../src/browser/Browser.js';
import type BrowserContext from '../../src/browser/BrowserContext.js';
import type BrowserPage from '../../src/browser/BrowserPage.js';
import type MessageEvent from '../../src/event/events/MessageEvent.js';
import DOMExceptionNameEnum from '../../src/exception/DOMExceptionNameEnum.js';
import * as PropertySymbol from '../../src/PropertySymbol.js';
import { beforeEach, afterEach, describe, it, expect } from 'vitest';

describe('BroadcastChannel', () => {
	let window: Window;

	beforeEach(() => {
		window = new Window({ url: 'https://localhost:8080/' });
	});

	afterEach(async () => {
		await window.happyDOM.close();
	});

	/**
	 * Opens a new page in a browser context.
	 *
	 * @param context Browser context.
	 * @param url URL.
	 * @returns Page.
	 */
	function openPage(context: BrowserContext, url: string): BrowserPage {
		const page = context.newPage();
		page.mainFrame.url = url;
		return page;
	}

	describe('constructor()', () => {
		it('Creates a channel with the given name.', () => {
			const channel = new window.BroadcastChannel('test');

			expect(channel).toBeInstanceOf(window.BroadcastChannel);
			expect(channel.name).toBe('test');

			channel.close();
		});

		it('Converts the name to a string.', () => {
			const channel = new window.BroadcastChannel(<string>(<unknown>123));

			expect(channel.name).toBe('123');

			channel.close();
		});

		it('Throws a TypeError if no name is given.', () => {
			expect(() => new (<any>window.BroadcastChannel)()).toThrow(
				new window.TypeError(
					`Failed to construct 'BroadcastChannel': 1 argument required, but only 0 present.`
				)
			);
		});
	});

	describe('postMessage()', () => {
		it('Delivers the message to other channels with the same name, but not to the sender.', async () => {
			const sender = new window.BroadcastChannel('test');
			const receiver1 = new window.BroadcastChannel('test');
			const receiver2 = new window.BroadcastChannel('test');
			const other = new window.BroadcastChannel('other');
			const received: string[] = [];

			sender.addEventListener('message', () => received.push('sender'));
			receiver1.addEventListener('message', (event) =>
				received.push(`receiver1:${(<MessageEvent>event).data}`)
			);
			receiver2.onmessage = (event: MessageEvent) => received.push(`receiver2:${event.data}`);
			other.addEventListener('message', () => received.push('other'));

			sender.postMessage('hello');

			expect(received).toEqual([]);

			await window.happyDOM.waitUntilComplete();

			expect(received).toEqual(['receiver1:hello', 'receiver2:hello']);
		});

		it('Dispatches a MessageEvent with the origin of the sender.', async () => {
			const sender = new window.BroadcastChannel('test');
			const receiver = new window.BroadcastChannel('test');
			let receivedEvent: MessageEvent | null = null;

			receiver.addEventListener('message', (event) => (receivedEvent = <MessageEvent>event));
			sender.postMessage({ key: 'value' });

			await window.happyDOM.waitUntilComplete();

			expect(receivedEvent).toBeInstanceOf(window.MessageEvent);
			expect(receivedEvent!.type).toBe('message');
			expect(receivedEvent!.data).toEqual({ key: 'value' });
			expect(receivedEvent!.origin).toBe('https://localhost:8080');
		});

		it('Gives each receiver its own copy of the message.', async () => {
			const sender = new window.BroadcastChannel('test');
			const receiver1 = new window.BroadcastChannel('test');
			const receiver2 = new window.BroadcastChannel('test');
			const message = { list: [1, 2, 3] };
			const received: unknown[] = [];

			receiver1.addEventListener('message', (event) => received.push((<MessageEvent>event).data));
			receiver2.addEventListener('message', (event) => received.push((<MessageEvent>event).data));

			sender.postMessage(message);
			message.list.push(4);

			await window.happyDOM.waitUntilComplete();

			expect(received).toEqual([{ list: [1, 2, 3] }, { list: [1, 2, 3] }]);
			expect(received[0]).not.toBe(received[1]);
			expect(received[0]).not.toBe(message);
		});

		it('Throws a DataCloneError if the message can not be cloned.', () => {
			const channel = new window.BroadcastChannel('test');

			let error: Error | null = null;

			try {
				channel.postMessage(() => {});
			} catch (e) {
				error = <Error>e;
			}

			expect(error).toBeInstanceOf(window.DOMException);
			expect(error!.name).toBe(DOMExceptionNameEnum.dataCloneError);

			channel.close();
		});

		it('Throws an InvalidStateError if the channel is closed.', () => {
			const channel = new window.BroadcastChannel('test');

			channel.close();

			expect(() => channel.postMessage('hello')).toThrow(
				new window.DOMException(
					`Failed to execute 'postMessage' on 'BroadcastChannel': Channel is closed`,
					DOMExceptionNameEnum.invalidStateError
				)
			);
		});

		it('Delivers messages between pages with the same origin in the same browser context.', async () => {
			const browser = new Browser();
			const window1 = openPage(browser.defaultContext, 'https://localhost:8080/page1').mainFrame
				.window;
			const window2 = openPage(browser.defaultContext, 'https://localhost:8080/page2').mainFrame
				.window;
			const window3 = openPage(browser.defaultContext, 'https://example.com/').mainFrame.window;
			const window4 = openPage(browser.newIncognitoContext(), 'https://localhost:8080/page1')
				.mainFrame.window;
			const received: string[] = [];

			const sender = new window1.BroadcastChannel('test');
			new window2.BroadcastChannel('test').addEventListener('message', (event) =>
				received.push(`window2:${(<MessageEvent>event).data}`)
			);
			new window3.BroadcastChannel('test').addEventListener('message', () =>
				received.push('window3')
			);
			new window4.BroadcastChannel('test').addEventListener('message', () =>
				received.push('window4')
			);

			sender.postMessage('hello');

			await browser.waitUntilComplete();

			expect(received).toEqual(['window2:hello']);

			await browser.close();
		});

		it("Doesn't deliver messages between separate windows with opaque origins.", async () => {
			const browser = new Browser();
			const window1 = browser.newPage().mainFrame.window;
			const window2 = browser.newPage().mainFrame.window;
			const received: string[] = [];

			expect(window1.location.origin).toBe('null');

			const sender = new window1.BroadcastChannel('test');
			new window1.BroadcastChannel('test').addEventListener('message', () =>
				received.push('window1')
			);
			new window2.BroadcastChannel('test').addEventListener('message', () =>
				received.push('window2')
			);

			sender.postMessage('hello');

			await browser.waitUntilComplete();

			expect(received).toEqual(['window1']);

			await browser.close();
		});
	});

	describe('close()', () => {
		it("Doesn't deliver messages to a closed channel, including messages queued before it was closed.", async () => {
			const sender = new window.BroadcastChannel('test');
			const receiver = new window.BroadcastChannel('test');
			const received: unknown[] = [];

			receiver.addEventListener('message', (event) => received.push((<MessageEvent>event).data));

			sender.postMessage('before');
			receiver.close();
			sender.postMessage('after');

			await window.happyDOM.waitUntilComplete();

			expect(received).toEqual([]);
		});

		it('Closes all channels of a window when the window is closed.', async () => {
			const browser = new Browser();
			const window1 = openPage(browser.defaultContext, 'https://localhost:8080/').mainFrame.window;
			const page2 = openPage(browser.defaultContext, 'https://localhost:8080/');
			const window2 = page2.mainFrame.window;
			const channel = new window2.BroadcastChannel('test');
			const received: unknown[] = [];

			channel.addEventListener('message', (event) => received.push((<MessageEvent>event).data));

			expect(window2[PropertySymbol.openBroadcastChannels].size).toBe(1);

			await page2.close();

			expect(window2[PropertySymbol.openBroadcastChannels].size).toBe(0);
			expect(() => channel.postMessage('hello')).toThrow();

			new window1.BroadcastChannel('test').postMessage('hello');

			await browser.waitUntilComplete();

			expect(received).toEqual([]);

			await browser.close();
		});
	});
});

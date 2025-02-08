import HTMLAreaElement from '../../../src/nodes/html-area-element/HTMLAreaElement.js';
import Window from '../../../src/window/Window.js';
import Document from '../../../src/nodes/document/Document.js';
import { beforeEach, describe, it, expect, vi } from 'vitest';
import PointerEvent from '../../../src/event/events/PointerEvent.js';
import Request from '../../../src/fetch/Request.js';
import Response from '../../../src/fetch/Response.js';
import Browser from '../../../src/browser/Browser.js';
import Fetch from '../../../src/fetch/Fetch.js';
import DOMTokenList from '../../../src/dom/DOMTokenList.js';

describe('HTMLAreaElement', () => {
	let window: Window;
	let document: Document;

	beforeEach(() => {
		window = new Window({ url: 'https://www.somesite.com/test.html' });
		document = window.document;
	});

	describe('constructor()', () => {
		it('Should be an instanceof HTMLAreaElement', () => {
			const element = document.createElement('area');
			expect(element instanceof HTMLAreaElement).toBe(true);
		});
	});

	describe('Object.prototype.toString', () => {
		it('Returns `[object HTMLAreaElement]`', () => {
			const element = document.createElement('area');
			expect(Object.prototype.toString.call(element)).toBe('[object HTMLAreaElement]');
		});
	});

	for (const property of [
		'download',
		'ping',
		'target',
		'referrerPolicy',
		'rel',
		'alt',
		'coords',
		'shape'
	]) {
		describe(`get ${property}()`, () => {
			it(`Returns the "${property}" attribute.`, () => {
				const element = document.createElement('area');
				element.setAttribute(property, 'test');
				expect(element[property]).toBe('test');
			});
		});

		describe(`set ${property}()`, () => {
			it(`Sets the attribute "${property}".`, () => {
				const element = document.createElement('area');
				element[property] = 'test';
				expect(element.getAttribute(property)).toBe('test');
			});
		});
	}

	describe('get relList()', () => {
		it('Returns a DOMTokenList object.', () => {
			const element = document.createElement('area');
			element.setAttribute('rel', 'value1 value2');
			expect(element.relList).toBeInstanceOf(DOMTokenList);
			expect(element.relList.value).toBe('value1 value2');
			expect(element.relList.length).toBe(2);
			expect(element.relList[0]).toBe('value1');
			expect(element.relList[1]).toBe('value2');
		});
	});

	describe('set relList()', () => {
		it('Sets the attribute "rel".', () => {
			const element = document.createElement('area');
			element.relList = 'value1 value2';
			expect(element.getAttribute('rel')).toBe('value1 value2');
		});
	});

	describe('get href()', () => {
		it('Returns the "href" attribute.', () => {
			const element = document.createElement('area');
			element.setAttribute('href', 'test');
			expect(element.href).toBe('https://www.somesite.com/test');
		});

		it('Returns the "href" attribute when scheme is http.', () => {
			const element = document.createElement('area');
			element.setAttribute('href', 'http://www.example.com');
			expect(element.href).toBe('http://www.example.com/');
		});

		it('Returns the "href" attribute when scheme is tel.', () => {
			const element = document.createElement('area');
			element.setAttribute('href', 'tel:+123456789');
			expect(element.href).toBe('tel:+123456789');
		});

		it('Returns the "href" attribute when scheme-relative', () => {
			const element = document.createElement('area');
			element.setAttribute('href', '//example.com');
			expect(element.href).toBe('https://example.com/');
		});

		it('Returns empty string if "href" attribute is empty.', () => {
			const element = document.createElement('area');
			expect(element.href).toBe('');
		});
	});

	describe('toString()', () => {
		it('Returns the "href" attribute.', () => {
			const element = document.createElement('area');
			element.setAttribute('href', 'test');
			expect(element.toString()).toBe('https://www.somesite.com/test');
		});

		it('Returns the "href" attribute when scheme is http.', () => {
			const element = document.createElement('area');
			element.setAttribute('href', 'http://www.example.com');
			expect(element.toString()).toBe('http://www.example.com/');
		});

		it('Returns the "href" attribute when scheme is tel.', () => {
			const element = document.createElement('area');
			element.setAttribute('href', 'tel:+123456789');
			expect(element.toString()).toBe('tel:+123456789');
		});

		it('Returns the "href" attribute when scheme-relative', () => {
			const element = document.createElement('area');
			element.setAttribute('href', '//example.com');
			expect(element.toString()).toBe('https://example.com/');
		});

		it('Returns empty string if "href" attribute is empty.', () => {
			const element = document.createElement('area');
			expect(element.toString()).toBe('');
		});
	});

	describe('set href()', () => {
		it('Sets the attribute "href".', () => {
			const element = document.createElement('area');
			element.href = 'test';
			expect(element.getAttribute('href')).toBe('test');
		});
	});

	describe('get origin()', () => {
		it("Returns the href URL's origin.", () => {
			const element = document.createElement('area');
			element.setAttribute('href', 'https://www.example.com:443/path?q1=a#xyz');
			expect(element.origin).toBe('https://www.example.com');
		});

		it("Returns the href URL's origin with port when non-standard.", () => {
			const element = document.createElement('area');
			element.setAttribute('href', 'http://www.example.com:8080/path?q1=a#xyz');
			expect(element.origin).toBe('http://www.example.com:8080');
		});

		it("Returns the page's origin when href is relative.", () => {
			const element = document.createElement('area');
			element.setAttribute('href', '/path?q1=a#xyz');
			expect(element.origin).toBe('https://www.somesite.com');
		});
	});

	describe('get protocol()', () => {
		it("Returns the href URL's protocol.", () => {
			const element = document.createElement('area');
			element.setAttribute('href', 'https://www.example.com:443/path?q1=a#xyz');
			expect(element.protocol).toBe('https:');
		});
	});

	describe('set protocol()', () => {
		it("Sets the href URL's protocol.", () => {
			const element = document.createElement('area');
			element.setAttribute('href', 'https://www.example.com:443/path?q1=a#xyz');

			expect(element.protocol).toBe('https:');

			element.protocol = 'http';
			expect(element.protocol).toBe('http:');
			expect(element.href).toBe('http://www.example.com/path?q1=a#xyz');
		});
	});

	describe('get username()', () => {
		it("Returns the href URL's username.", () => {
			const element = document.createElement('area');
			element.setAttribute('href', 'https://user:pw@www.example.com:443/path?q1=a#xyz');
			expect(element.username).toBe('user');
		});
	});

	describe('set username()', () => {
		it("Sets the href URL's username.", () => {
			const element = document.createElement('area');
			element.setAttribute('href', 'https://user:pw@www.example.com:443/path?q1=a#xyz');

			expect(element.username).toBe('user');

			element.username = 'user2';
			expect(element.username).toBe('user2');
			expect(element.href).toBe('https://user2:pw@www.example.com/path?q1=a#xyz');
		});
	});

	describe('get password()', () => {
		it("Returns the href URL's password.", () => {
			const element = document.createElement('area');
			element.setAttribute('href', 'https://user:pw@www.example.com:443/path?q1=a#xyz');
			expect(element.password).toBe('pw');
		});
	});

	describe('set password()', () => {
		it("Sets the href URL's password.", () => {
			const element = document.createElement('area');
			element.setAttribute('href', 'https://user:pw@www.example.com:443/path?q1=a#xyz');

			expect(element.password).toBe('pw');

			element.password = 'pw2';
			expect(element.password).toBe('pw2');
			expect(element.href).toBe('https://user:pw2@www.example.com/path?q1=a#xyz');
		});
	});

	describe('get host()', () => {
		it("Returns the href URL's host.", () => {
			const element = document.createElement('area');
			element.setAttribute('href', 'https://www.example.com:443/path?q1=a#xyz');
			expect(element.host).toBe('www.example.com');
		});
	});

	describe('set host()', () => {
		it("Sets the href URL's host.", () => {
			const element = document.createElement('area');
			element.setAttribute('href', 'https://www.example.com:443/path?q1=a#xyz');

			expect(element.host).toBe('www.example.com');

			element.host = 'abc.example2.com';
			expect(element.host).toBe('abc.example2.com');
			expect(element.href).toBe('https://abc.example2.com/path?q1=a#xyz');
		});
	});

	describe('get hostname()', () => {
		it("Returns the href URL's hostname.", () => {
			const element = document.createElement('area');
			element.setAttribute('href', 'https://www.example.com:443/path?q1=a#xyz');
			expect(element.hostname).toBe('www.example.com');
		});
	});

	describe('set hostname()', () => {
		it("Sets the href URL's hostname.", () => {
			const element = document.createElement('area');
			element.setAttribute('href', 'https://www.example.com:443/path?q1=a#xyz');

			expect(element.hostname).toBe('www.example.com');

			element.hostname = 'abc.example2.com';
			expect(element.hostname).toBe('abc.example2.com');
			expect(element.href).toBe('https://abc.example2.com/path?q1=a#xyz');
		});
	});

	describe('get port()', () => {
		it("Returns the href URL's port.", () => {
			const element = document.createElement('area');
			element.setAttribute('href', 'https://www.example.com:443/path?q1=a#xyz');
			expect(element.port).toBe('');

			element.setAttribute('href', 'https://www.example.com:444/path?q1=a#xyz');
			expect(element.port).toBe('444');
		});
	});

	describe('set port()', () => {
		it("Sets the href URL's port.", () => {
			const element = document.createElement('area');
			element.setAttribute('href', 'https://www.example.com:443/path?q1=a#xyz');

			expect(element.port).toBe('');

			element.port = '8080';
			expect(element.port).toBe('8080');
			expect(element.href).toBe('https://www.example.com:8080/path?q1=a#xyz');
		});
	});

	describe('get pathname()', () => {
		it("Returns the href URL's pathname.", () => {
			const element = document.createElement('area');
			element.setAttribute('href', 'https://www.example.com:443/path?q1=a#xyz');
			expect(element.pathname).toBe('/path');
		});
	});

	describe('set pathname()', () => {
		it("Sets the href URL's pathname.", () => {
			const element = document.createElement('area');
			element.setAttribute('href', 'https://www.example.com:443/path?q1=a#xyz');

			expect(element.pathname).toBe('/path');

			element.pathname = '/path2';
			expect(element.pathname).toBe('/path2');
			expect(element.href).toBe('https://www.example.com/path2?q1=a#xyz');
		});
	});

	describe('get search()', () => {
		it("Returns the href URL's search.", () => {
			const element = document.createElement('area');
			element.setAttribute('href', 'https://www.example.com:443/path?q1=a#xyz');
			expect(element.search).toBe('?q1=a');
		});
	});

	describe('set search()', () => {
		it("Sets the href URL's search.", () => {
			const element = document.createElement('area');
			element.setAttribute('href', 'https://www.example.com:443/path?q1=a#xyz');

			expect(element.search).toBe('?q1=a');

			element.search = '?q1=b';
			expect(element.search).toBe('?q1=b');
			expect(element.href).toBe('https://www.example.com/path?q1=b#xyz');
		});
	});

	describe('get hash()', () => {
		it("Returns the href URL's hash.", () => {
			const element = document.createElement('area');
			element.setAttribute('href', 'https://www.example.com:443/path?q1=a#xyz');
			expect(element.hash).toBe('#xyz');
		});
	});

	describe('set hash()', () => {
		it("Sets the href URL's hash.", () => {
			const element = document.createElement('area');
			element.setAttribute('href', 'https://www.example.com:443/path?q1=a#xyz');

			expect(element.hash).toBe('#xyz');

			element.hash = '#fgh';
			expect(element.hash).toBe('#fgh');
			expect(element.href).toBe('https://www.example.com/path?q1=a#fgh');
		});
	});

	describe('get tabIndex()', () => {
		it('Returns "0" by default.', () => {
			const element = document.createElement('area');
			expect(element.tabIndex).toBe(0);
		});

		it('Returns the attribute "tabindex" as a number.', () => {
			const element = document.createElement('area');
			element.setAttribute('tabindex', '5');
			expect(element.tabIndex).toBe(5);
		});

		it('Returns "0" for NaN numbers.', () => {
			const element = document.createElement('area');
			element.setAttribute('tabindex', 'invalid');
			expect(element.tabIndex).toBe(0);
		});
	});

	describe('set tabIndex()', () => {
		it('Sets the attribute "tabindex".', () => {
			const element = document.createElement('area');
			element.tabIndex = 5;
			expect(element.getAttribute('tabindex')).toBe('5');
			element.tabIndex = -1;
			expect(element.getAttribute('tabindex')).toBe('-1');
			element.tabIndex = <number>(<unknown>'invalid');
			expect(element.getAttribute('tabindex')).toBe('0');
		});
	});

	describe('dispatchEvent()', () => {
		it('Navigates the browser when a "click" event is dispatched on an element.', async () => {
			const browser = new Browser();
			const page = browser.newPage();
			const window = page.mainFrame.window;

			vi.spyOn(Fetch.prototype, 'send').mockImplementation(function (): Promise<Response> {
				return Promise.resolve(<Response>{
					text: () => Promise.resolve('Test')
				});
			});

			const element = <HTMLAreaElement>window.document.createElement('area');
			element.href = 'https://www.example.com';
			window.document.body.appendChild(element);
			element.dispatchEvent(new PointerEvent('click'));

			const newWindow = page.mainFrame.window;

			expect(newWindow === window).toBe(false);
			expect(newWindow.location.href).toBe('https://www.example.com/');

			await browser.waitUntilComplete();

			expect(newWindow.document.body.innerHTML).toBe('Test');

			newWindow.close();

			expect(newWindow.closed).toBe(true);
		});

		it('Navigates the browser when a "click" event is dispatched on an element with target "_blank".', async () => {
			const browser = new Browser();
			const page = browser.newPage();
			const window = page.mainFrame.window;

			vi.spyOn(Fetch.prototype, 'send').mockImplementation(function (): Promise<Response> {
				return Promise.resolve(<Response>{
					text: () => Promise.resolve('Test')
				});
			});

			const element = <HTMLAreaElement>window.document.createElement('area');
			element.href = 'https://www.example.com';
			element.target = '_blank';
			window.document.body.appendChild(element);
			element.dispatchEvent(new PointerEvent('click'));

			const newWindow = browser.defaultContext.pages[1].mainFrame.window;

			expect(newWindow === window).toBe(false);
			expect(newWindow.location.href).toBe('https://www.example.com/');

			await browser.waitUntilComplete();

			expect(newWindow.document.body.innerHTML).toBe('Test');

			newWindow.close();

			expect(newWindow.closed).toBe(true);
		});

		it('Navigates the browser when a "click" event is dispatched on an element, even if the element is not connected to DOM.', async () => {
			const browser = new Browser();
			const page = browser.newPage();
			const window = page.mainFrame.window;

			vi.spyOn(Fetch.prototype, 'send').mockImplementation(function (): Promise<Response> {
				return Promise.resolve(<Response>{
					text: () => Promise.resolve('Test')
				});
			});

			const element = <HTMLAreaElement>window.document.createElement('area');
			element.href = 'https://www.example.com';
			element.dispatchEvent(new PointerEvent('click'));

			const newWindow = page.mainFrame.window;

			expect(newWindow === window).toBe(false);
			expect(newWindow.location.href).toBe('https://www.example.com/');

			await browser.waitUntilComplete();

			expect(newWindow.document.body.innerHTML).toBe('Test');
		});

		it(`Doesn't navigate or change the location when a "click" event is dispatched inside the main frame of a detached browser when the Happy DOM setting "navigation.disableFallbackToSetURL" is set to "true".`, () => {
			const window = new Window({
				settings: {
					navigation: {
						disableFallbackToSetURL: true
					}
				}
			});
			document = window.document;

			vi.spyOn(Fetch.prototype, 'send').mockImplementation(function (): Promise<Response> {
				throw new Error('Fetch should not be called.');
			});

			const element = document.createElement('area');
			element.href = 'https://www.example.com';
			document.body.appendChild(element);
			element.dispatchEvent(new PointerEvent('click'));
			expect(window.location.href).toBe('about:blank');
		});

		it(`Doesn't navigate, but changes the location of a new window when a "click" event is dispatched inside the main frame of a detached browser when the Happy DOM setting "navigation.disableFallbackToSetURL" is set to "false" and "navigation.disableChildPageNavigation" is set to "true".`, () => {
			const window = new Window({
				settings: {
					navigation: {
						disableFallbackToSetURL: false,
						disableChildPageNavigation: true
					}
				}
			});
			document = window.document;

			vi.spyOn(Fetch.prototype, 'send').mockImplementation(function (): Promise<Response> {
				throw new Error('Fetch should not be called.');
			});

			const newWindow = <Window>window.open();

			const element = <HTMLAreaElement>newWindow.document.createElement('area');
			element.href = 'https://www.example.com';
			newWindow.document.body.appendChild(element);
			element.dispatchEvent(new PointerEvent('click'));
			expect(newWindow.closed).toBe(false);
			expect(newWindow.location.href).toBe('https://www.example.com/');
		});

		it('Changes the location when a "click" event is dispatched inside the main frame of a detached browser when the Happy DOM setting "navigation.disableFallbackToSetURL" is set to "false".', () => {
			const window = new Window({
				settings: {
					navigation: {
						disableFallbackToSetURL: false
					}
				}
			});
			document = window.document;

			vi.spyOn(Fetch.prototype, 'send').mockImplementation(function (): Promise<Response> {
				throw new Error('Fetch should not be called.');
			});

			const element = document.createElement('area');
			element.href = 'https://www.example.com';
			document.body.appendChild(element);
			element.dispatchEvent(new PointerEvent('click'));
			expect(window.location.href).toBe('https://www.example.com/');
		});

		it('Opens a window when a "click" event is dispatched on an element with target set to "_blank" inside the main frame of a detached browser.', () => {
			let request: Request | null = null;

			vi.spyOn(Fetch.prototype, 'send').mockImplementation(function (): Promise<Response> {
				request = <Request>this.request;
				return Promise.resolve(<Response>{
					text: () => Promise.resolve('Test')
				});
			});

			const element = document.createElement('area');
			element.target = '_blank';
			element.href = 'https://www.example.com';
			document.body.appendChild(element);
			element.dispatchEvent(new PointerEvent('click'));
			expect((<Request>(<unknown>request)).url).toBe('https://www.example.com/');
		});

		it('Navigates the browser when a "click" event is dispatched on an element inside a non-main frame of a detached browser.', () => {
			let request: Request | null = null;

			vi.spyOn(Fetch.prototype, 'send').mockImplementation(function (): Promise<Response> {
				request = <Request>this.request;
				return Promise.resolve(<Response>{
					text: () => Promise.resolve('Test')
				});
			});

			const newWindow = <Window>window.open();

			const element = <HTMLAreaElement>newWindow.document.createElement('area');
			element.href = 'https://www.example.com';
			newWindow.document.body.appendChild(element);
			element.dispatchEvent(new PointerEvent('click'));
			expect((<Request>(<unknown>request)).url).toBe('https://www.example.com/');
			expect(newWindow.closed).toBe(true);
		});
	});
});

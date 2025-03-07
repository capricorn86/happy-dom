import HTMLBodyElement from '../../../src/nodes/html-body-element/HTMLBodyElement.js';
import Window from '../../../src/window/Window.js';
import Document from '../../../src/nodes/document/Document.js';
import { beforeEach, describe, it, expect } from 'vitest';
import Event from '../../../src/event/Event.js';

describe('HTMLBodyElement', () => {
	let window: Window;
	let document: Document;
	let element: HTMLBodyElement;

	beforeEach(() => {
		window = new Window();
		document = window.document;
		element = document.createElement('body');
	});

	describe('constructor()', () => {
		it('Should be an instanceof HTMLBodyElement', () => {
			expect(element instanceof HTMLBodyElement).toBe(true);
		});
	});

	for (const event of [
		'afterprint',
		'beforeprint',
		'beforeunload',
		'gamepadconnected',
		'gamepaddisconnected',
		'hashchange',
		'languagechange',
		'message',
		'messageerror',
		'offline',
		'online',
		'pagehide',
		'pageshow',
		'popstate',
		'rejectionhandled',
		'storage',
		'unhandledrejection',
		'unload'
	]) {
		describe(`get on${event}()`, () => {
			it('Returns the event listener.', () => {
				element.setAttribute(`on${event}`, 'window.test = 1');
				expect(element[`on${event}`]).toBeTypeOf('function');
				element[`on${event}`](new Event(event));
				expect(window['test']).toBe(1);
			});
		});

		describe(`set on${event}()`, () => {
			it('Sets the event listener.', () => {
				element[`on${event}`] = () => {
					window['test'] = 1;
				};
				element.dispatchEvent(new Event(event));
				expect(element.getAttribute(`on${event}`)).toBe(null);
				expect(window['test']).toBe(1);
			});
		});
	}
});

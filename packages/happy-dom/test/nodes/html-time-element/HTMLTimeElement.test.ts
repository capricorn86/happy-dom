import { beforeEach, describe, expect, it } from 'vitest';
import Document from '../../../src/nodes/document/Document.js';
import HTMLTimeElement from '../../../src/nodes/html-time-element/HTMLTimeElement.js';
import Window from '../../../src/window/Window.js';

describe('HTMLTimeElement', () => {
	let window: Window;
	let document: Document;
	let element: HTMLTimeElement;

	beforeEach(() => {
		window = new Window();
		document = window.document;
		element = document.createElement('time');
	});

	describe('constructor()', () => {
		it('Should be an instanceof HTMLTimeElement', () => {
			expect(element instanceof HTMLTimeElement).toBe(true);
		});
	});

	describe('get dateTime()', () => {
		it('Gets the attribute value "datetime".', () => {
			element.setAttribute('datetime', '1969-07-20');
			expect(element.dateTime).toBe('1969-07-20');
		});

		it('Returns "" if the "datetime" attribute is not set.', () => {
			expect(element.dateTime).toBe('');
		});
	});

	describe('set dateTime()', () => {
		it('Sets the attribute value "datetime".', () => {
			element.dateTime = '1969-07-20';
			expect(element.getAttribute('datetime')).toBe('1969-07-20');
		});
	});
});

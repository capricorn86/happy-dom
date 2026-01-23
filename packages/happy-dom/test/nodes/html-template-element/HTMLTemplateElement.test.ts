import Window from '../../../src/window/Window.js';
import Document from '../../../src/nodes/document/Document.js';
import HTMLTemplateElement from '../../../src/nodes/html-template-element/HTMLTemplateElement.js';
import HTMLSerializer from '../../../src/html-serializer/HTMLSerializer.js';
import { beforeEach, afterEach, describe, it, expect, vi } from 'vitest';
import CustomElement from '../../CustomElement.js';

describe('HTMLTemplateElement', () => {
	let window: Window;
	let document: Document;
	let element: HTMLTemplateElement;

	beforeEach(() => {
		window = new Window();
		document = window.document;
		element = <HTMLTemplateElement>document.createElement('template');
	});

	afterEach(() => {
		CustomElement.serializable = false;
		vi.restoreAllMocks();
	});

	describe('Object.prototype.toString', () => {
		it('Returns `[object HTMLTemplateElement]`', () => {
			expect(Object.prototype.toString.call(element)).toBe('[object HTMLTemplateElement]');
		});
	});

	describe('get innerHTML()', () => {
		it('Returns inner HTML of the "content" node.', () => {
			const div = document.createElement('div');

			div.innerHTML = 'Test';

			expect(element.content.childNodes.length).toBe(0);
			expect(element.innerHTML).toBe('');

			element.appendChild(div);

			expect(element.childNodes.length).toBe(0);
			expect(element.innerHTML).toBe('<div>Test</div>');
			expect(new HTMLSerializer().serializeToString(element.content)).toBe('<div>Test</div>');

			element.removeChild(div);

			expect(element.content.childNodes.length).toBe(0);
			expect(element.innerHTML).toBe('');
		});
	});

	describe('set innerHTML()', () => {
		it('Serializes the HTML into nodes and appends them to the "content" node.', () => {
			expect(element.content.childNodes.length).toBe(0);
			expect(element.innerHTML).toBe('');

			element.innerHTML = '<div>Test</div>';

			expect(element.childNodes.length).toBe(0);
			expect(element.innerHTML).toBe('<div>Test</div>');
			expect(new HTMLSerializer().serializeToString(element.content)).toBe('<div>Test</div>');

			element.innerHTML = '';

			expect(element.content.childNodes.length).toBe(0);
			expect(element.innerHTML).toBe('');
		});
	});

	describe('get outerHTML()', () => {
		it('Serializes the HTML into nodes and appends them to the "content" node.', () => {
			expect(element.content.childNodes.length).toBe(0);
			expect(element.innerHTML).toBe('');

			element.innerHTML = '<div>Test</div>';

			expect(element.childNodes.length).toBe(0);
			expect(element.outerHTML).toBe('<template><div>Test</div></template>');

			element.innerHTML = '';

			expect(element.outerHTML).toBe('<template></template>');
		});
	});

	describe('set outerHTML()', () => {
		it('Replaces the template with a span.', () => {
			element.innerHTML = '<div>Test</div>';

			document.body.appendChild(element);

			expect(document.body.innerHTML).toBe('<template><div>Test</div></template>');

			element.outerHTML = '<span>Test</span>';

			expect(document.body.innerHTML).toBe('<span>Test</span>');
		});
	});

	describe('get firstChild()', () => {
		it('Returns first child.', () => {
			const div = document.createElement('div');
			const span = document.createElement('span');
			element.appendChild(div);
			element.appendChild(span);
			expect(element.firstChild).toBe(div);
		});
	});

	describe('get lastChild()', () => {
		it('Returns last child.', () => {
			const div = document.createElement('div');
			const span = document.createElement('span');
			element.appendChild(div);
			element.appendChild(span);
			expect(element.lastChild).toBe(span);
		});
	});

	describe('getInnerHTML()', () => {
		it('Returns inner HTML of the "content" node.', () => {
			const div = document.createElement('div');

			div.innerHTML = 'Test';

			expect(element.content.childNodes.length).toBe(0);
			expect(element.getInnerHTML()).toBe('');

			element.appendChild(div);

			expect(element.childNodes.length).toBe(0);
			expect(element.getInnerHTML()).toBe('<div>Test</div>');
			expect(new HTMLSerializer().serializeToString(element.content)).toBe('<div>Test</div>');

			element.removeChild(div);

			expect(element.content.childNodes.length).toBe(0);
			expect(element.getInnerHTML()).toBe('');
		});

		it('Should ignore shadow roots, as they should not be included in HTMLTemplateElement.', () => {
			window.customElements.define('custom-element', CustomElement);

			element.innerHTML = '<div><custom-element></custom-element></div>';

			expect(element.getInnerHTML({ includeShadowRoots: true })).toBe(
				'<div><custom-element></custom-element></div>'
			);
		});
	});

	describe('getHTML()', () => {
		it('Returns HTML of children as a concatenated string.', () => {
			const div = document.createElement('div');

			div.innerHTML = 'Test';

			expect(element.content.childNodes.length).toBe(0);
			expect(element.getHTML()).toBe('');

			element.appendChild(div);

			expect(element.childNodes.length).toBe(0);
			expect(element.getHTML()).toBe('<div>Test</div>');
			expect(new HTMLSerializer().serializeToString(element.content)).toBe('<div>Test</div>');

			element.removeChild(div);

			expect(element.content.childNodes.length).toBe(0);
			expect(element.getHTML()).toBe('');
		});

		it('Should ignore shadow roots, as they should not be included in HTMLTemplateElement.', () => {
			CustomElement.serializable = true;

			window.customElements.define('custom-element', CustomElement);

			element.innerHTML = '<div><custom-element></custom-element></div>';

			document.body.appendChild(element);

			expect(element.getHTML({ serializableShadowRoots: true })).toBe(
				'<div><custom-element></custom-element></div>'
			);
		});
	});

	describe('appendChild()', () => {
		it('Appends a node to the "content" node.', () => {
			const div = document.createElement('div');

			expect(element.childNodes.length).toBe(0);
			expect(element.content.childNodes.length).toBe(0);

			element.appendChild(div);

			expect(element.childNodes.length).toBe(0);
			expect(element.content.childNodes.length).toBe(1);
			expect(element.content.childNodes[0] === div).toBe(true);

			element.removeChild(div);

			expect(element.childNodes.length).toBe(0);
			expect(element.content.childNodes.length).toBe(0);
		});
	});

	describe('removeChild()', () => {
		it('Removes a node from the "content" node.', () => {
			const div = document.createElement('div');

			element.appendChild(div);

			expect(element.childNodes.length).toBe(0);
			expect(element.content.childNodes.length).toBe(1);

			element.removeChild(div);

			expect(element.childNodes.length).toBe(0);
			expect(element.content.childNodes.length).toBe(0);
		});
	});

	describe('insertBefore()', () => {
		it('Inserts a node before another node in the "content" node.', () => {
			const div = document.createElement('div');
			const span = document.createElement('span');
			const underline = document.createElement('u');
			element.appendChild(div);
			element.appendChild(span);
			element.insertBefore(underline, span);
			expect(element.innerHTML).toBe('<div></div><u></u><span></span>');
		});
	});

	describe('replaceChild()', () => {
		it('Removes a node from the "content" node.', () => {
			const div = document.createElement('div');
			const span = document.createElement('span');
			const underline = document.createElement('u');
			const bold = document.createElement('b');
			element.appendChild(div);
			element.appendChild(underline);
			element.appendChild(span);
			element.replaceChild(bold, underline);
			expect(element.innerHTML).toBe('<div></div><b></b><span></span>');
		});
	});

	describe('cloneNode()', () => {
		it('Clones the nodes of the "content" node.', () => {
			element.innerHTML = '<div></div><b></b><span></span>';
			const clone = element.cloneNode(true);
			expect(clone.innerHTML).toBe('<div></div><b></b><span></span>');
		});
	});
});

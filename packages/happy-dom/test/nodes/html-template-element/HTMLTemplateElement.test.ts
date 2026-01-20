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
		it('Returns first child of content.', () => {
			element.innerHTML = '<div></div><span></span>';
			expect(element.firstChild?.nodeName).toBe('DIV');
		});
	});

	describe('get lastChild()', () => {
		it('Returns last child of content.', () => {
			element.innerHTML = '<div></div><span></span>';
			expect(element.lastChild?.nodeName).toBe('SPAN');
		});
	});

	describe('getInnerHTML()', () => {
		it('Returns inner HTML of the "content" node.', () => {
			expect(element.content.childNodes.length).toBe(0);
			expect(element.getInnerHTML()).toBe('');

			element.innerHTML = '<div>Test</div>';

			expect(element.childNodes.length).toBe(0);
			expect(element.getInnerHTML()).toBe('<div>Test</div>');
			expect(new HTMLSerializer().serializeToString(element.content)).toBe('<div>Test</div>');

			element.innerHTML = '';

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
			expect(element.content.childNodes.length).toBe(0);
			expect(element.getHTML()).toBe('');

			element.innerHTML = '<div>Test</div>';

			expect(element.childNodes.length).toBe(0);
			expect(element.getHTML()).toBe('<div>Test</div>');
			expect(new HTMLSerializer().serializeToString(element.content)).toBe('<div>Test</div>');

			element.innerHTML = '';

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
		it('Appends a node as a direct child of the template element.', () => {
			const div = document.createElement('div');

			expect(element.childNodes.length).toBe(0);
			expect(element.content.childNodes.length).toBe(0);

			element.appendChild(div);

			// Per browser behavior, appendChild should add direct children, not to content
			expect(element.childNodes.length).toBe(1);
			expect(element.childNodes[0]).toBe(div);
			expect(element.content.childNodes.length).toBe(0);
		});
	});

	describe('removeChild()', () => {
		it('Removes a direct child from the template element.', () => {
			const div = document.createElement('div');

			element.appendChild(div);

			expect(element.childNodes.length).toBe(1);
			expect(element.content.childNodes.length).toBe(0);

			element.removeChild(div);

			expect(element.childNodes.length).toBe(0);
			expect(element.content.childNodes.length).toBe(0);
		});
	});

	describe('insertBefore()', () => {
		it('Inserts a node as a direct child of the template element.', () => {
			const div = document.createElement('div');
			const span = document.createElement('span');
			// First add div as a child
			element.appendChild(div);
			// Then insert span before div
			element.insertBefore(span, div);
			// Per browser behavior, insertBefore should add direct children, not to content
			expect(element.childNodes.length).toBe(2);
			expect(element.childNodes[0]).toBe(span);
			expect(element.childNodes[1]).toBe(div);
			expect(element.content.childNodes.length).toBe(0);
		});

		it('Appends node when referenceNode is null.', () => {
			const div = document.createElement('div');
			const span = document.createElement('span');
			element.insertBefore(div, null);
			element.insertBefore(span, null);
			expect(element.childNodes.length).toBe(2);
			expect(element.childNodes[0]).toBe(div);
			expect(element.childNodes[1]).toBe(span);
		});
	});

	describe('replaceChild()', () => {
		it('Replaces a direct child of the template element.', () => {
			const div = document.createElement('div');
			const span = document.createElement('span');
			element.appendChild(div);
			element.replaceChild(span, div);
			expect(element.childNodes.length).toBe(1);
			expect(element.childNodes[0]).toBe(span);
			expect(element.content.childNodes.length).toBe(0);
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

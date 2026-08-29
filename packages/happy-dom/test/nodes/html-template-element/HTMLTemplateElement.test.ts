import Window from '../../../src/window/Window.js';
import type Document from '../../../src/nodes/document/Document.js';
import type HTMLTemplateElement from '../../../src/nodes/html-template-element/HTMLTemplateElement.js';
import HTMLSerializer from '../../../src/html-serializer/HTMLSerializer.js';
import type MutationRecord from '../../../src/mutation-observer/MutationRecord.js';
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

	describe('get/set innerHTML()', () => {
		it('Populates the "content" node, not direct children.', () => {
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
		it('Wraps content innerHTML in template tags.', () => {
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
		it('Should ignore shadow roots, as they should not be included in HTMLTemplateElement.', () => {
			window.customElements.define('custom-element', CustomElement);

			element.innerHTML = '<div><custom-element></custom-element></div>';

			expect(element.getInnerHTML({ includeShadowRoots: true })).toBe(
				'<div><custom-element></custom-element></div>'
			);
		});
	});

	describe('getHTML()', () => {
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

			element.appendChild(div);

			expect(element.childNodes.length).toBe(1);
			expect(element.childNodes[0]).toBe(div);
			expect(element.content.childNodes.length).toBe(0);
		});

		it('Appends DocumentFragment children directly.', () => {
			const fragment = document.createDocumentFragment();
			const div = document.createElement('div');
			const span = document.createElement('span');
			fragment.appendChild(div);
			fragment.appendChild(span);

			element.appendChild(fragment);

			expect(element.childNodes.length).toBe(2);
			expect(element.childNodes[0]).toBe(div);
			expect(element.childNodes[1]).toBe(span);
			expect(fragment.childNodes.length).toBe(0);
			expect(element.content.childNodes.length).toBe(0);
		});

		it('Triggers MutationObserver.', async () => {
			let records: MutationRecord[] = [];
			const observer = new window.MutationObserver((mutationRecords) => {
				records = mutationRecords;
			});
			observer.observe(element, { childList: true });

			const div = document.createElement('div');
			element.appendChild(div);

			await new Promise((resolve) => setTimeout(resolve, 1));

			expect(records.length).toBe(1);
			expect(records[0].type).toBe('childList');
			expect(records[0].addedNodes[0]).toBe(div);

			observer.disconnect();
		});
	});

	describe('removeChild()', () => {
		it('Removes a direct child from the template element.', () => {
			const div = document.createElement('div');

			element.appendChild(div);

			expect(element.childNodes.length).toBe(1);

			element.removeChild(div);

			expect(element.childNodes.length).toBe(0);
			expect(element.content.childNodes.length).toBe(0);
		});
	});

	describe('insertBefore()', () => {
		it('Inserts a node as a direct child of the template element.', () => {
			const div = document.createElement('div');
			const span = document.createElement('span');
			element.appendChild(div);
			element.insertBefore(span, div);
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

		it('Inserts DocumentFragment children directly.', () => {
			const existing = document.createElement('p');
			element.appendChild(existing);

			const fragment = document.createDocumentFragment();
			const div = document.createElement('div');
			const span = document.createElement('span');
			fragment.appendChild(div);
			fragment.appendChild(span);

			element.insertBefore(fragment, existing);

			expect(element.childNodes.length).toBe(3);
			expect(element.childNodes[0]).toBe(div);
			expect(element.childNodes[1]).toBe(span);
			expect(element.childNodes[2]).toBe(existing);
			expect(fragment.childNodes.length).toBe(0);
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

		it('Replaces with DocumentFragment children.', () => {
			const div = document.createElement('div');
			element.appendChild(div);

			const fragment = document.createDocumentFragment();
			const a = document.createElement('a');
			const b = document.createElement('b');
			fragment.appendChild(a);
			fragment.appendChild(b);

			element.replaceChild(fragment, div);

			expect(element.childNodes.length).toBe(2);
			expect(element.childNodes[0]).toBe(a);
			expect(element.childNodes[1]).toBe(b);
			expect(div.parentNode).toBe(null);
		});
	});

	describe('innerHTML and public methods are independent', () => {
		it('innerHTML populates content while appendChild adds direct children.', () => {
			element.innerHTML = '<div>from parser</div>';
			const span = document.createElement('span');
			element.appendChild(span);

			expect(element.content.childNodes.length).toBe(1);
			expect(element.innerHTML).toBe('<div>from parser</div>');
			expect(element.childNodes.length).toBe(1);
			expect(element.childNodes[0]).toBe(span);
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

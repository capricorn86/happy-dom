import Window from '../../../src/window/Window.js';
import Document from '../../../src/nodes/document/Document.js';
import { beforeEach, describe, it, expect } from 'vitest';
import * as PropertySymbol from '../../../src/PropertySymbol.js';
import NodeList from '../../../src/nodes/node/NodeList.js';
import Node from '../../../src/nodes/node/Node.js';

describe('NodeList', () => {
	let window: Window;
	let document: Document;

	beforeEach(() => {
		window = new Window();
		document = window.document;
	});

	describe('constructor()', () => {
		it('Should throw an error if the "illegalConstructor" symbol is not sent to the constructor', () => {
			expect(() => new NodeList()).toThrow(new TypeError('Illegal constructor'));
		});

		it('Should not throw an error if the "illegalConstructor" symbol is provided', () => {
			expect(() => new NodeList(PropertySymbol.illegalConstructor)).not.toThrow();
		});

		it('Should return undefined when accessing invalid index on childNodes', () => {
			document.body.innerHTML =
				'<div class="container">' +
				'<div class="tab" data-track-id="one"></div>' +
				'<div class="tab" data-track-id="two"></div>' +
				'</div>';
			const container = document.querySelector('.container')!;
			expect(container.childNodes[{}]).toBe(undefined);
			expect(container.childNodes[[]]).toBe(undefined);
			expect(container.childNodes[-1]).toBe(undefined);
			expect(container.childNodes[999]).toBe(undefined);
			expect(container.childNodes[null]).toBe(undefined);
			expect(container.childNodes[undefined]).toBe(undefined);
		});
	});

	describe('item()', () => {
		it('Returns node at index.', () => {
			const text = document.createTextNode('test');
			const comment = document.createComment('test');
			document.body.appendChild(text);
			document.body.appendChild(comment);
			expect(document.body.childNodes.item(0) === text).toBe(true);
			expect(document.body.childNodes.item(1) === comment).toBe(true);
		});
	});

	describe('[Symbol.iterator]()', () => {
		it('Returns iterator', () => {
			const nodes: Node[] = [];

			const parent = document.createElement('div');
			const node1 = document.createTextNode('node1');
			const node2 = document.createComment('node2');
			const node3 = document.createTextNode('node3');

			parent.appendChild(node1);
			parent.appendChild(node2);
			parent.appendChild(node3);

			for (const node of parent.childNodes) {
				nodes.push(node);
			}

			expect(nodes).toEqual([node1, node2, node3]);
		});
	});

	describe('Array.from()', () => {
		it('Should support Array.from()', () => {
			const items: Node[] = [];
			const nodeList = new NodeList(PropertySymbol.illegalConstructor, items);
			const node1 = document.createTextNode('node1');
			const node2 = document.createComment('node2');
			const node3 = document.createTextNode('node3');

			items.push(node1);
			items.push(node2);
			items.push(node3);

			expect(Array.from(nodeList)).toEqual([node1, node2, node3]);
		});
	});
});

import Window from '../../../src/window/Window.js';
import Document from '../../../src/nodes/document/Document.js';
import { beforeEach, describe, it, expect } from 'vitest';
import * as PropertySymbol from '../../../src/PropertySymbol.js';
import NodeList from '../../../src/nodes/node/NodeList.js';

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
});

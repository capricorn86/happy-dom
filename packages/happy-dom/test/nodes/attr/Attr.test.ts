import Window from '../../../src/window/Window.js';
import Document from '../../../src/nodes/document/Document.js';
import { beforeEach, describe, it, expect } from 'vitest';
import * as PropertySymbol from '../../../src/PropertySymbol.js';
import NodeTypeEnum from '../../../src/nodes/node/NodeTypeEnum.js';

describe('Attr', () => {
	let window: Window;
	let document: Document;

	beforeEach(() => {
		window = new Window();
		document = window.document;
	});

	describe('get nodeType()', () => {
		it('Returns attribute node type.', () => {
			const attr = document.createAttribute('test');
			expect(attr.nodeType).toBe(NodeTypeEnum.attributeNode);
		});
	});

	describe('get namespaceURI()', () => {
		it('Returns namespace URI.', () => {
			const attr = document.createAttribute('test');
			attr[PropertySymbol.namespaceURI] = 'namespaceURI';
			expect(attr.namespaceURI).toBe('namespaceURI');
		});
	});

	describe('get name()', () => {
		it('Returns name.', () => {
			const attr = document.createAttribute('test');
			attr[PropertySymbol.name] = 'name';
			expect(attr.name).toBe('name');
		});
	});

	describe('get localName()', () => {
		it('Returns local name.', () => {
			const attr = document.createAttribute('test');
			attr[PropertySymbol.localName] = 'localName';
			expect(attr.localName).toBe('localName');
		});
	});

	describe('get prefix()', () => {
		it('Returns prefix.', () => {
			const attr = document.createAttribute('test');
			attr[PropertySymbol.prefix] = 'prefix';
			expect(attr.prefix).toBe('prefix');
		});
	});

	describe('get value()', () => {
		it('Returns value.', () => {
			const attr = document.createAttribute('test');
			attr[PropertySymbol.value] = 'value';
			expect(attr.value).toBe('value');
		});
	});

	describe('get specified()', () => {
		it('Returns specified.', () => {
			const attr = document.createAttribute('test');
			attr[PropertySymbol.specified] = true;
			expect(attr.specified).toBe(true);
		});
	});

	describe('get ownerElement()', () => {
		it('Returns owner element.', () => {
			const attr = document.createAttribute('test');
			const ownerElement = document.createElement('div');
			attr[PropertySymbol.ownerElement] = ownerElement;
			expect(attr.ownerElement === ownerElement).toBe(true);
		});
	});

	describe('cloneNode()', () => {
		it('Clones the node.', () => {
			const attr = document.createAttribute('test');

			attr[PropertySymbol.namespaceURI] = 'namespaceURI';
			attr[PropertySymbol.name] = 'name';
			attr[PropertySymbol.localName] = 'localName';
			attr[PropertySymbol.prefix] = 'prefix';
			attr[PropertySymbol.value] = 'value';
			attr[PropertySymbol.specified] = false;
			attr[PropertySymbol.ownerElement] = document.createElement('div');

			const clone = attr.cloneNode();

			expect(clone.namespaceURI).toBe(attr.namespaceURI);
			expect(clone.name).toBe(attr.name);
			expect(clone.localName).toBe(attr.localName);
			expect(clone.prefix).toBe(attr.prefix);
			expect(clone.value).toBe(attr.value);
			expect(clone.specified).toBe(attr.specified);
			expect(clone.ownerElement).toBe(null);
		});
	});
});

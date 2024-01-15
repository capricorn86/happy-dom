import Window from '../../../src/window/Window.js';
import IWindow from '../../../src/window/IWindow.js';
import IDocument from '../../../src/nodes/document/IDocument.js';
import HTMLUnknownElement from '../../../src/nodes/html-unknown-element/HTMLUnknownElement.js';
import CustomElement from '../../CustomElement.js';
import { beforeEach, describe, it, expect } from 'vitest';
import CustomElementRegistry from '../../../src/custom-element/CustomElementRegistry.js';
import * as PropertySymbol from '../../../src/PropertySymbol.js';

describe('HTMLUnknownElement', () => {
	let window: IWindow;
	let document: IDocument;

	beforeEach(() => {
		window = new Window();
		document = window.document;
	});

	describe('_connectNode()', () => {
		it('Waits for a custom element to be defined and replace it when it is.', () => {
			const element = <HTMLUnknownElement>document.createElement('custom-element');
			const parent = document.createElement('div');

			parent.appendChild(element);

			expect(window.customElements[PropertySymbol.callbacks]['CUSTOM-ELEMENT'].length).toBe(1);

			parent.removeChild(element);

			expect(Object.keys(window.customElements[PropertySymbol.callbacks]).length).toBe(0);

			parent.appendChild(element);

			window.customElements.define('custom-element', CustomElement);

			expect(parent.children.length).toBe(1);

			expect(parent.children[0] instanceof CustomElement).toBe(true);
			expect(parent.children[0].shadowRoot.children.length).toBe(0);

			document.body.appendChild(parent);

			expect(parent.children[0].shadowRoot.children.length).toBe(2);
		});

		it('Copies all properties from the unknown element to the new instance.', () => {
			const element = <HTMLUnknownElement>document.createElement('custom-element');
			const child1 = document.createElement('div');
			const child2 = document.createElement('div');

			element.appendChild(child1);
			element.appendChild(child2);

			document.body.appendChild(element);

			const attribute1 = document.createAttribute('test');
			attribute1.value = 'test';
			element.attributes.setNamedItem(attribute1);

			const childNodes = element.childNodes;
			const children = element.children;
			const rootNode = (element[PropertySymbol.rootNode] = document.createElement('div'));
			const formNode = (element[PropertySymbol.formNode] = document.createElement('div'));
			const selectNode = (element[PropertySymbol.selectNode] = document.createElement('div'));
			const textAreaNode = (element[PropertySymbol.textAreaNode] = document.createElement('div'));
			const observers = element[PropertySymbol.observers];
			const isValue = (element[PropertySymbol.isValue] = 'test');

			window.customElements.define('custom-element', CustomElement);

			const customElement = <CustomElement>document.body.children[0];

			expect(document.body.children.length).toBe(1);
			expect(customElement instanceof CustomElement).toBe(true);

			expect(customElement.isConnected).toBe(true);
			expect(customElement.shadowRoot?.children.length).toBe(2);

			expect(customElement.childNodes === childNodes).toBe(true);
			expect(customElement.children === children).toBe(true);
			expect(customElement[PropertySymbol.rootNode] === rootNode).toBe(true);
			expect(customElement[PropertySymbol.formNode] === formNode).toBe(true);
			expect(customElement[PropertySymbol.selectNode] === selectNode).toBe(true);
			expect(customElement[PropertySymbol.textAreaNode] === textAreaNode).toBe(true);
			expect(customElement[PropertySymbol.observers] === observers).toBe(true);
			expect(customElement[PropertySymbol.isValue] === isValue).toBe(true);
			expect(customElement.attributes.length).toBe(1);
			expect(customElement.attributes[0] === attribute1).toBe(true);
		});

		it('Does nothing if the property "_callback" doesn\'t exist on Window.customElements.', () => {
			(<CustomElementRegistry>window.customElements) = <CustomElementRegistry>(<unknown>{
				get: () => undefined
			});

			const element = <HTMLUnknownElement>document.createElement('custom-element');
			const parent = document.createElement('div');

			expect(() => {
				parent.appendChild(element);
			}).not.toThrow();
		});
	});
});

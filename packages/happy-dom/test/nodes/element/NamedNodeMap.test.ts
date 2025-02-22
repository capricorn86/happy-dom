import Window from '../../../src/window/Window.js';
import Document from '../../../src/nodes/document/Document.js';
import Element from '../../../src/nodes/element/Element.js';
import NamedNodeMap from '../../../src/nodes/element/NamedNodeMap.js';
import Attr from '../../../src/nodes/attr/Attr.js';
import DOMException from '../../../src/exception/DOMException.js';
import DOMExceptionNameEnum from '../../../src/exception/DOMExceptionNameEnum.js';
import { beforeEach, describe, it, expect } from 'vitest';

describe('NamedNodeMap', () => {
	let window: Window;
	let document: Document;
	let element: Element;

	beforeEach(() => {
		window = new Window();
		document = window.document;
		element = document.createElement('div');
	});

	describe('get toString()', () => {
		it('Returns a string.', () => {
			expect(element.attributes.toString()).toBe('[object NamedNodeMap]');
		});
	});

	describe('get toString()', () => {
		it('Returns a string.', () => {
			expect(element.attributes.toString()).toBe('[object NamedNodeMap]');
		});
	});

	describe('Symbol.iterator()', () => {
		it('Handles being an iterator.', () => {
			element.setAttribute('key1', 'value1');
			element.setAttribute('key2', 'value2');

			const attributeList: Attr[] = [];

			for (const attribute of element.attributes) {
				attributeList.push(attribute);
			}

			expect(element.attributes.length).toBe(2);
			expect(attributeList[0].name).toBe('key1');
			expect(attributeList[0].value).toBe('value1');
			expect(attributeList[1].name).toBe('key2');
			expect(attributeList[1].value).toBe('value2');

			element.setAttribute('key3', 'value3');

			expect(element.attributes.length).toBe(3);
		});

		it('Returns iterator using the same local name with different prefix.', () => {
			element.setAttribute('ns1:key', 'value1');
			element.setAttribute('ns2:key', 'value1');
			element.setAttribute('key1', 'value1');
			element.setAttribute('key2', '');

			const attributeList: Attr[] = [];

			for (const attribute of element.attributes) {
				attributeList.push(attribute);
			}

			// 'ns2:key=value1', 'key1=value1', 'key2='

			expect(attributeList.length).toBe(4);

			expect(attributeList[0].name).toBe('ns1:key');
			expect(attributeList[0].value).toBe('value1');

			expect(attributeList[1].name).toBe('ns2:key');
			expect(attributeList[1].value).toBe('value1');

			expect(attributeList[2].name).toBe('key1');
			expect(attributeList[2].value).toBe('value1');

			expect(attributeList[3].name).toBe('key2');
			expect(attributeList[3].value).toBe('');
		});

		it('Returns iterator when using namespaces.', () => {
			element.setAttributeNS('namespace', 'key', 'value1');
			element.setAttributeNS('namespace', 'key', 'value2');
			element.setAttributeNS('namespace2', 'key', 'value3');
			element.setAttributeNS('namespace3', 'key', 'value4');

			const attributeList: Attr[] = [];

			for (const attribute of element.attributes) {
				attributeList.push(attribute);
			}

			expect(attributeList.length).toBe(3);

			expect(attributeList[0].value).toBe('value2');
			expect(attributeList[1].value).toBe('value3');
			expect(attributeList[2].value).toBe('value4');
		});
	});

	describe('item()', () => {
		it('Returns an attribute by index.', () => {
			element.setAttribute('key1', 'value1');
			element.setAttribute('key2', 'value2');

			expect(element.attributes.item(0)?.name).toBe('key1');
			expect(element.attributes.item(0)?.value).toBe('value1');
			expect(element.attributes.item(1)?.name).toBe('key2');
			expect(element.attributes.item(1)?.value).toBe('value2');
		});

		it('Returns item by index using the same local name with different prefix.', () => {
			element.setAttribute('ns1:key', 'value1');
			element.setAttribute('ns2:key', 'value1');
			element.setAttribute('key1', 'value1');
			element.setAttribute('key2', '');

			expect(element.attributes.item(0)?.name).toBe('ns1:key');
			expect(element.attributes.item(0)?.value).toBe('value1');

			expect(element.attributes.item(1)?.name).toBe('ns2:key');
			expect(element.attributes.item(1)?.value).toBe('value1');

			expect(element.attributes.item(2)?.name).toBe('key1');
			expect(element.attributes.item(2)?.value).toBe('value1');

			expect(element.attributes.item(3)?.name).toBe('key2');
			expect(element.attributes.item(3)?.value).toBe('');

			expect(element.attributes.item(4)).toBe(null);
		});

		it('Returns item by index when using namespaces.', () => {
			element.setAttributeNS('namespace', 'key', 'value1');
			element.setAttributeNS('namespace', 'key', 'value2');
			element.setAttributeNS('namespace2', 'key', 'value3');
			element.setAttributeNS('namespace3', 'key', 'value4');

			expect(element.attributes.item(0)?.value).toBe('value2');
			expect(element.attributes.item(1)?.value).toBe('value3');
			expect(element.attributes.item(2)?.value).toBe('value4');
			expect(element.attributes.item(3)).toBe(null);
		});
	});

	describe('getNamedItem()', () => {
		it('Returns an attribute by name.', () => {
			element.setAttribute('key1', 'value1');
			element.setAttribute('key2', 'value2');

			expect(element.attributes.getNamedItem('key1')?.name).toBe('key1');
			expect(element.attributes.getNamedItem('key1')?.value).toBe('value1');
			expect(element.attributes.getNamedItem('key2')?.name).toBe('key2');
			expect(element.attributes.getNamedItem('key2')?.value).toBe('value2');
		});
	});

	describe('getNamedItemNS()', () => {
		it('Returns an attribute by name.', () => {
			element.setAttributeNS('namespace', 'key1', 'value1');
			element.setAttributeNS('namespace', 'key2', 'value2');

			expect(element.attributes.getNamedItemNS('namespace', 'key1')?.name).toBe('key1');
			expect(element.attributes.getNamedItemNS('namespace', 'key1')?.value).toBe('value1');
			expect(element.attributes.getNamedItemNS('namespace', 'key2')?.name).toBe('key2');
			expect(element.attributes.getNamedItemNS('namespace', 'key2')?.value).toBe('value2');
		});
	});

	describe('setNamedItem()', () => {
		it('Adds an attribute when not existing.', () => {
			element.setAttribute('key', 'value');
			const attr = element.attributes.removeNamedItem('key');

			expect(element.attributes.getNamedItem('key')).toBe(null);

			if (attr) {
				element.attributes.setNamedItem(attr);
			}

			expect(element.attributes.getNamedItem('key')).toBe(attr);
		});

		it('Replaces an attribute when existing.', () => {
			element.setAttribute('key', 'value1');
			const attr = document.createAttribute('key');
			attr.value = 'value2';

			const replaced = element.attributes.setNamedItem(attr);

			expect(replaced?.name).toBe('key');
			expect(replaced?.value).toBe('value1');
			expect(element.attributes.getNamedItem('key')).toBe(attr);
			expect(element.getAttribute('key')).toBe('value2');
		});

		it("Doesn't replace item with different namespace.", () => {
			element.setAttribute('key', 'value1');
			const attr = document.createAttributeNS('namespace', 'key');
			attr.value = 'value2';

			const replaced = element.attributes.setNamedItem(attr);

			expect(replaced).toBe(null);
			expect(element.attributes.getNamedItem('key') === attr).toBe(false);
			expect(element.attributes.getNamedItemNS('namespace', 'key') === attr).toBe(true);
			expect(element.getAttribute('key')).toBe('value1');
			expect(element.getAttributeNS('namespace', 'key')).toBe('value2');
		});

		it('Handles non string keys as strings', () => {
			element.setAttribute('undefined', 'value1');
			expect(element.getAttribute(<string>(<unknown>undefined))).toBe('value1');
		});
	});

	describe('setNamedItemNS()', () => {
		it('Adds an namespaced attribute when not existing.', () => {
			element.setAttributeNS('namespace', 'key', 'value');
			const attr = element.attributes.removeNamedItemNS('namespace', 'key');

			if (attr) {
				element.attributes.setNamedItemNS(attr);
			}

			expect(element.attributes.getNamedItem('key')).toBe(attr);
			expect(element.getAttributeNS('namespace', 'key')).toBe('value');
		});

		it('Replaces an attribute when existing.', () => {
			element.setAttributeNS('namespace', 'key', 'value1');
			const attr = document.createAttributeNS('namespace', 'key');
			attr.value = 'value2';

			const replaced = element.attributes.setNamedItemNS(attr);

			expect(replaced?.name).toBe('key');
			expect(replaced?.value).toBe('value1');

			expect(element.attributes.getNamedItemNS('namespace', 'key')).toBe(attr);
			expect(element.getAttributeNS('namespace', 'key')).toBe('value2');
		});
	});

	describe('removeNamedItem()', () => {
		it('Removes an attribute from the list.', () => {
			element.setAttribute('key', 'value');
			const removed = element.attributes.removeNamedItem('key');

			expect(removed?.name).toBe('key');
			expect(removed?.value).toBe('value');

			expect(element.getAttribute('key')).toBe(null);
		});

		it('Uses the last attribute when multiple attributes have the same name.', () => {
			element.setAttributeNS('namespace', 'key', 'value1');
			element.setAttributeNS('namespace', 'key', 'value2');
			element.setAttributeNS('namespace2', 'key', 'value3');
			element.setAttributeNS('namespace3', 'key', 'value4');

			expect(element.attributes.getNamedItem('key')?.value).toBe('value2');

			expect(element.attributes.removeNamedItem('key')?.value).toBe('value2');

			expect(element.attributes.getNamedItem('key')?.value).toBe('value3');

			expect(element.attributes.removeNamedItem('key')?.value).toBe('value3');

			expect(element.attributes.getNamedItem('key')?.value).toBe('value4');

			expect(element.attributes.removeNamedItem('key')?.value).toBe('value4');

			expect(element.attributes.getNamedItem('key')).toBe(null);
		});

		it('Throws a NotFoundError on a missing attribute.', () => {
			let error: Error | null = null;
			try {
				element.attributes.removeNamedItem('non-existent-attribute');
			} catch (e) {
				error = e;
			}
			expect(error).toEqual(
				new DOMException(
					"Failed to execute 'removeNamedItem' on 'NamedNodeMap': No item with name 'non-existent-attribute' was found.",
					DOMExceptionNameEnum.notFoundError
				)
			);
		});
	});
});

import Window from '../../../src/window/Window.js';
import type Document from '../../../src/nodes/document/Document.js';
import type Element from '../../../src/nodes/element/Element.js';
import type Attr from '../../../src/nodes/attr/Attr.js';
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
				new window.DOMException(
					"Failed to execute 'removeNamedItem' on 'NamedNodeMap': No item with name 'non-existent-attribute' was found.",
					DOMExceptionNameEnum.notFoundError
				)
			);
		});
	});

	describe('Object.keys()', () => {
		it('Returns only the indices as enumerable own properties.', () => {
			element.setAttribute('href', '/x');
			element.setAttribute('title', 't');

			expect(Object.keys(element.attributes)).toEqual(['0', '1']);
		});

		it('Returns only attributes in Object.values().', () => {
			element.setAttribute('href', '/x');
			element.setAttributeNS('namespace', 'ns1:key', 'value');

			const values = Object.values(element.attributes);

			expect(values.length).toBe(2);
			expect(values[0] === element.attributes.getNamedItem('href')).toBe(true);
			expect(values[1] === element.attributes.getNamedItem('ns1:key')).toBe(true);
		});
	});

	describe('Object.getOwnPropertyNames()', () => {
		it('Returns indices followed by attribute names.', () => {
			element.setAttribute('href', '/x');
			element.setAttribute('title', 't');
			element.setAttributeNS('namespace', 'ns1:key', 'value');

			expect(Object.getOwnPropertyNames(element.attributes)).toEqual([
				'0',
				'1',
				'2',
				'href',
				'title',
				'ns1:key'
			]);
		});

		it('Excludes duplicated qualified names.', () => {
			element.setAttributeNS('namespace1', 'ns:key', 'value1');
			element.setAttributeNS('namespace2', 'ns:key', 'value2');

			expect(Object.getOwnPropertyNames(element.attributes)).toEqual(['0', '1', 'ns:key']);
		});

		it('Excludes names with uppercase letters for HTML elements in an HTML document.', () => {
			element.setAttributeNS(null, 'UPPER', 'value');
			element.setAttribute('lower', 'value');

			expect(Object.getOwnPropertyNames(element.attributes)).toEqual(['0', '1', 'lower']);
		});

		it('Includes names with uppercase letters for elements not in the HTML namespace.', () => {
			const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
			svg.setAttribute('viewBox', '0 0 1 1');

			expect(Object.getOwnPropertyNames(svg.attributes)).toEqual(['0', 'viewBox']);
			expect(Object.keys(svg.attributes)).toEqual(['0']);
		});
	});

	describe('Object.getOwnPropertyDescriptor()', () => {
		it('Returns a non-enumerable descriptor for attribute names.', () => {
			element.setAttribute('href', '/x');

			const descriptor = Object.getOwnPropertyDescriptor(element.attributes, 'href');

			expect(descriptor?.value === element.attributes.getNamedItem('href')).toBe(true);
			expect(descriptor?.enumerable).toBe(false);
			expect(descriptor?.writable).toBe(false);
			expect(descriptor?.configurable).toBe(true);
		});

		it('Returns an enumerable descriptor for indices.', () => {
			element.setAttribute('href', '/x');

			const descriptor = Object.getOwnPropertyDescriptor(element.attributes, '0');

			expect(descriptor?.value === element.attributes.item(0)).toBe(true);
			expect(descriptor?.enumerable).toBe(true);
		});

		it('Returns undefined for internal keys and unsupported names.', () => {
			element.setAttribute('href', '/x');
			element.setAttributeNS(null, 'UPPER', 'value');

			expect(Object.getOwnPropertyDescriptor(element.attributes, ':href')).toBeUndefined();
			expect(Object.getOwnPropertyDescriptor(element.attributes, 'UPPER')).toBeUndefined();
			expect(Object.getOwnPropertyDescriptor(element.attributes, '2')).toBeUndefined();
		});
	});

	describe('in operator', () => {
		it('Returns true for attribute names and indices.', () => {
			element.setAttribute('href', '/x');
			element.setAttributeNS('namespace', 'ns1:key', 'value');

			expect('href' in element.attributes).toBe(true);
			expect('ns1:key' in element.attributes).toBe(true);
			expect('0' in element.attributes).toBe(true);
			expect('1' in element.attributes).toBe(true);
			expect('length' in element.attributes).toBe(true);
		});

		it('Returns false for internal keys and unsupported names.', () => {
			element.setAttribute('href', '/x');
			element.setAttributeNS('namespace', 'ns1:key', 'value');
			element.setAttributeNS(null, 'UPPER', 'value');

			expect(':href' in element.attributes).toBe(false);
			expect('namespace:ns1:key' in element.attributes).toBe(false);
			expect('key' in element.attributes).toBe(false);
			expect('HREF' in element.attributes).toBe(false);
			expect('UPPER' in element.attributes).toBe(false);
			expect('3' in element.attributes).toBe(false);
		});
	});

	describe('Property access', () => {
		it('Returns attributes by name and index.', () => {
			element.setAttribute('href', '/x');
			element.setAttributeNS('namespace', 'ns1:key', 'value');

			const attributes = <{ [key: string]: Attr }>(<unknown>element.attributes);

			expect(attributes['href'] === element.attributes.getNamedItem('href')).toBe(true);
			expect(attributes['ns1:key'] === element.attributes.getNamedItem('ns1:key')).toBe(true);
			expect(attributes['0'] === element.attributes.item(0)).toBe(true);
			expect(attributes['1'] === element.attributes.item(1)).toBe(true);
			expect(attributes[':href']).toBeUndefined();
			expect(attributes['2']).toBeUndefined();
		});

		it('Supports mapping Object.values() to entries.', () => {
			element.setAttribute('href', '/x');
			element.setAttribute('title', 't');

			expect(
				Object.fromEntries(
					Object.values(element.attributes).map((attr) => [
						attr.name,
						element.getAttribute(attr.name)
					])
				)
			).toEqual({ href: '/x', title: 't' });
		});
	});
});

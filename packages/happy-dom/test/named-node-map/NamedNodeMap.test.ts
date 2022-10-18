import IWindow from '../../src/window/IWindow';
import Window from '../../src/window/Window';
import IDocument from '../../src/nodes/document/IDocument';
import IElement from '../../src/nodes/element/IElement';
import INamedNodeMap from 'src/named-node-map/INamedNodeMap';

describe('NamedNodeMap', () => {
	let window: IWindow;
	let document: IDocument;
	let element: IElement;
	let attributes: INamedNodeMap;

	beforeEach(() => {
		window = new Window();
		document = window.document;
		element = document.createElement('div');
		attributes = element.attributes;
	});

	describe('get length()', () => {
		it('Is an integer representing the number of objects stored in the object.', () => {
			element.setAttribute('key1', 'value1');
			element.setAttribute('key2', 'value2');

			expect(attributes.length).toBe(2);

			element.setAttribute('key3', 'value3');

			expect(attributes.length).toBe(3);
		});
	});

	describe('item()', () => {
		it('Returns an attribute by index.', () => {
			element.setAttribute('key1', 'value1');
			element.setAttribute('key2', 'value2');

			expect(attributes.item(0).name).toBe('key1');
			expect(attributes.item(0).value).toBe('value1');
			expect(attributes.item(1).name).toBe('key2');
			expect(attributes.item(1).value).toBe('value2');
		});
	});

	describe('getNamedItem()', () => {
		it('Returns an attribute by name.', () => {
			element.setAttribute('key1', 'value1');
			element.setAttribute('key2', 'value2');

			expect(attributes.getNamedItem('key1').name).toBe('key1');
			expect(attributes.getNamedItem('key1').value).toBe('value1');
			expect(attributes.getNamedItem('key2').name).toBe('key2');
			expect(attributes.getNamedItem('key2').value).toBe('value2');
		});
	});

	describe('getNamedItemNS()', () => {
		it('Returns an attribute by name.', () => {
			element.setAttributeNS('namespace', 'key1', 'value1');
			element.setAttributeNS('namespace', 'key2', 'value2');

			expect(attributes.getNamedItemNS('namespace', 'key1').name).toBe('key1');
			expect(attributes.getNamedItemNS('namespace', 'key1').value).toBe('value1');
			expect(attributes.getNamedItemNS('namespace', 'key2').name).toBe('key2');
			expect(attributes.getNamedItemNS('namespace', 'key2').value).toBe('value2');
		});
	});

	describe('setNamedItem()', () => {
		it('Adds an attribute when not existing.', () => {
			element.setAttribute('key', 'value');
			const attr = attributes.removeNamedItem('key');

			expect(attributes.getNamedItem('key')).toBe(null);

			attributes.setNamedItem(attr);

			expect(attributes.getNamedItem('key')).toBe(attr);
		});

		it('Replaces an attribute when existing.', () => {
			element.setAttribute('key', 'value1');
			const attr = attributes.getNamedItem('key');
			attr.value = 'value2';

			attributes.setNamedItem(attr);

			expect(attributes.getNamedItem('key')).toBe(attr);
			expect(element.getAttribute('key')).toBe('value2');
		});
	});

	describe('setNamedItemNS()', () => {
		it('Adds an namespaced attribute when not existing.', () => {
			element.setAttributeNS('namespace', 'key', 'value');
			const attr = attributes.removeNamedItemNS('namespace', 'key');

			attributes.setNamedItemNS(attr);

			expect(attributes.getNamedItem('key')).toBe(attr);
			expect(element.getAttributeNS('namespace', 'key')).toBe('value');
		});

		it('Replaces an attribute when existing.', () => {
			element.setAttributeNS('namespace', 'key', 'value1');
			const attr = attributes.getNamedItemNS('namespace', 'key');
			attr.value = 'value2';

			attributes.setNamedItemNS(attr);

			expect(attributes.getNamedItemNS('namespace', 'key')).toBe(attr);
			expect(element.getAttributeNS('namespace', 'key')).toBe('value2');
		});
	});

	describe('removeNamedItem()', () => {
		it('Removes an attribute from the list.', () => {
			element.setAttribute('key', 'value');
			attributes.removeNamedItem('key');

			expect(element.getAttribute('key')).toBe(null);
		});
	});
});

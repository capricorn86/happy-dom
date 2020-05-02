import Window from '../../lib/Window';
import Element from '../../lib/nodes/basic-types/element/Element';

describe('Element', () => {
	describe('hasAttribute', () => {
		test('Returns true for the existing attribute.', () => {
			const toTest = new Element();
			const attributeName = 'test';
			toTest.setAttribute(attributeName, 'foo');
			expect(toTest.hasAttribute(attributeName)).toBeTruthy();
		});
	});

	describe('prepend', () => {
		test('should add element at the beginning', () => {
			// given
			const document = new Window().document;
			const baseChild = document.createElement('div');
			const newChild = document.createElement('p');
			// system under test
			const toTest = document.createElement('div');
			toTest.appendChild(baseChild);

			// when
			toTest.prepend(newChild, 'txt');

			// then
			expect(toTest.children).toHaveLength(2);
			expect(toTest.childNodes).toHaveLength(3);
			expect(toTest.childNodes[0]).toBe(newChild);
			expect(toTest.childNodes[1]).toHaveProperty('textContent', 'txt');
			expect(toTest.childNodes[2]).toBe(baseChild);
		});
	});

	describe('append', () => {
		test('should add elements at the end', () => {
			// given
			const document = new Window().document;
			const baseChild = document.createElement('div');
			const newChild = document.createElement('p');
			// system under test
			const toTest = document.createElement('div');
			toTest.appendChild(baseChild);

			// when
			toTest.append(newChild, 'txt');

			// then
			expect(toTest.children).toHaveLength(2);
			expect(toTest.childNodes).toHaveLength(3);
			expect(toTest.childNodes[0]).toBe(baseChild);
			expect(toTest.childNodes[1]).toBe(newChild);
			expect(toTest.childNodes[2]).toHaveProperty('textContent', 'txt');
		});
	});
});

import Element from '../../src/nodes/basic-types/element/Element';

describe('HTMLParser', () => {
	describe('hasAttribute', () => {
		test('Returns true for the existing attribute.', () => {
			const toTest = new Element();
			const attributeName = 'test';
			toTest.setAttribute(attributeName, 'foo');
			expect(toTest.hasAttribute(attributeName)).toBeTruthy();
		});
	});
});

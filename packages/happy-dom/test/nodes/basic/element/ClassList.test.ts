import Window from '../../../../src/window/Window';
import ClassList from '../../../../src/nodes/basic/element/ClassList';

describe('ClassList', () => {
	let window, document, element, classList;

	beforeEach(() => {
		window = new Window();
		document = window.document;
		element = document.createElement('div');
		classList = new ClassList(element);
	});

	describe('add()', () => {
		test('Adds a class to the list.', () => {
			classList.add('class');
			expect(element.className).toBe('class');
			classList.add('class2');
			classList.add('class3');
			expect(element.className).toBe('class class2 class3');
		});
		test('Adds multiple classes to the list.', () => {
			classList.add('class1');
			classList.add('class2');
			expect(element.className).toBe('class1 class2');
		});
	});

	describe('remove()', () => {
		test('Removes a class from the list.', () => {
			classList.add('class');
			classList.remove('class');
			expect(element.className).toBe('');
		});
	});

	describe('contains()', () => {
		test('Returns "true" if the list contains a class.', () => {
			classList.add('class');
			expect(classList.contains('class')).toBe(true);
		});
	});
});

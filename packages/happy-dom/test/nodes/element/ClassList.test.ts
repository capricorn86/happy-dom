import Window from '../../../src/window/Window';
import ClassList from '../../../src/nodes/element/ClassList';

describe('ClassList', () => {
	let window;
	let document;
	let element;
	let classList;

	beforeEach(() => {
		window = new Window();
		document = window.document;
		element = document.createElement('div');
		classList = new ClassList(element);
	});

	describe('add()', () => {
		it('Adds a class to the list.', () => {
			classList.add('class');
			expect(element.className).toBe('class');
			classList.add('class2');
			classList.add('class3');
			expect(element.className).toBe('class class2 class3');
		});
		it('Adds multiple classes to the list.', () => {
			classList.add('class1');
			classList.add('class2');
			expect(element.className).toBe('class1 class2');
		});
	});

	describe('remove()', () => {
		it('Removes a class from the list.', () => {
			classList.add('class');
			classList.remove('class');
			expect(element.className).toBe('');
		});
	});

	describe('contains()', () => {
		it('Returns "true" if the list contains a class.', () => {
			classList.add('class');
			expect(classList.contains('class')).toBe(true);
		});
	});

	describe('toggle()', () => {
		it('Adds a class from the list when not existing.', () => {
			expect(classList.toggle('class')).toBe(true);
			expect(element.className).toBe('class');
		});
		it('Adds a class from the list when force is set.', () => {
			classList.add('classA');
			expect(classList.toggle('classA', true)).toBe(true);
			expect(classList.toggle('classB', true)).toBe(true);
			expect(element.className).toBe('classA classB');
		});
		it('Removes a class from the list when existing.', () => {
			classList.add('class');
			expect(classList.toggle('class')).toBe(false);
			expect(element.className).toBe('');
		});
		it('Adds a class from the list when force is set.', () => {
			classList.add('classA');
			expect(classList.toggle('classA', false)).toBe(false);
			expect(classList.toggle('classB', false)).toBe(false);
			expect(element.className).toBe('');
		});
	});
});

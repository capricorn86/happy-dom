import Window from '../../../src/window/Window';
import DOMTokenList from '../../../src/nodes/element/DOMTokenList';

describe('DOMTokenList', () => {
	let window;
	let document;
	let element;
	let classList;

	beforeEach(() => {
		window = new Window();
		document = window.document;
		element = document.createElement('div');
		classList = new DOMTokenList(element);
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

	describe('length', () => {
		it('Is an integer representing the number of objects stored in the object.', () => {
			expect(classList.length).toBe(0);
			classList.add('class1');
			expect(classList.length).toBe(1);
		});
	});

	describe('value', () => {
		it('A stringifier property that returns the value of the list as a string.', () => {
			classList.add('class');
			classList.add('class1');
			classList.add('class2');
			expect(classList.value).toBe('class class1 class2');

			classList.add('class1');
			classList.add('class2');
			expect(classList.value).toBe('class class1 class2');
		});
		it('Set Value.', () => {
			classList.value = 'class class1 class2';
			expect(classList.length).toBe(3);
			expect(classList.value).toBe('class class1 class2');
		});
	});

	describe('item()', () => {
		it('Returns an item in the list.', () => {
			classList.add('class');
			expect(classList.item(0)).toBe('class');
			expect(classList.item('0')).toBe('class');
			expect(classList.item('a')).toBe(null);
		});
	});

	describe('replace()', () => {
		it('Replaces the token with another one.', () => {
			classList.add('class');
			classList.add('class1');
			classList.add('class3');
			expect(classList.replace('class', 'class4')).toBe(true);
			expect(classList.contains('class4')).toBe(true);
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

	describe('values()', () => {
		it('A stringifier property that returns the value of the list as a string.', () => {
			const classNames = ['class', 'class1', 'class2'];
			for (const className of classNames) {
				classList.add(className);
			}

			for (const value of classList.values()) {
				const index = classNames.indexOf(value);
				expect(classList.item(index)).toBe(value);
			}
		});
	});

	describe('entries()', () => {
		it('Returns an iterator, allowing you to go through all key/value pairs contained in this object.', () => {
			const classNames = ['class', 'class1', 'class2'];
			for (const className of classNames) {
				classList.add(className);
			}

			for (const [key, value] of classList.entries()) {
				expect(classList.item(key)).toBe(value);
			}
		});
	});

	describe('forEach()', () => {
		it('Executes a provided callback function once for each DOMTokenList element.', () => {
			const classNames = ['class', 'class1', 'class2'];
			for (const className of classNames) {
				classList.add(className);
			}
			classList.forEach((currentValue, currentIndex, _) => {
				expect(classList.item(currentIndex)).toBe(currentValue);
			}, this);
		});
	});

	describe('keys()', () => {
		it('Returns an iterator, allowing you to go through all keys of the key/value pairs contained in this object.', () => {
			const classNames = ['class', 'class1', 'class2'];
			for (const className of classNames) {
				classList.add(className);
			}

			for (const key of classList.keys()) {
				expect(classList.item(key)).toBe(classNames[key]);
			}
		});
	});
});

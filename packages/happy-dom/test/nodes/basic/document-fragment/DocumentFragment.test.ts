import Window from '../../../../src/window/Window';

describe('DocumentFragment', () => {
	let window, document, documentFragment;

	beforeEach(() => {
		window = new Window();
		document = window.document;
		documentFragment = document.createDocumentFragment();
	});

	describe('get children()', () => {
		test('Returns Element child nodes.', () => {
			const text = document.createTextNode('test');
			const div = document.createElement('div');
			const comment = document.createComment('test');
			documentFragment.appendChild(text);
			documentFragment.appendChild(div);
			documentFragment.appendChild(comment);
			expect(documentFragment.children).toEqual([div]);
		});
	});

	describe('querySelectorAll()', () => {
		test('Returns children matching a query selector.', () => {
			const div = document.createElement('div');
			const div2 = document.createElement('div');

			div.className = 'div';
			div2.className = 'div2';
			div.appendChild(div2);
			documentFragment.appendChild(div);

			expect(documentFragment.querySelectorAll('div')).toEqual([div, div2]);
			expect(documentFragment.querySelectorAll('.div .div2')).toEqual([div2]);
		});
	});

	describe('querySelector()', () => {
		test('Returns the first child matching a query selector.', () => {
			const div = document.createElement('div');
			const div2 = document.createElement('div');

			div.className = 'div';
			div2.className = 'div2';
			div.appendChild(div2);
			documentFragment.appendChild(div);

			expect(documentFragment.querySelector('div')).toEqual(div);
		});
	});

	describe('getElementById()', () => {
		test('Returns an element by id.', () => {
			const div = document.createElement('div');
			const div2 = document.createElement('div');

			div2.id = 'id';
			div.appendChild(div2);
			documentFragment.appendChild(div);

			expect(documentFragment.getElementById('id')).toEqual(div2);
		});
	});

	describe('getElementsByTagName()', () => {
		test('Returns elements by tag name.', () => {
			const div = document.createElement('div');
			const div2 = document.createElement('div');

			div.appendChild(div2);
			documentFragment.appendChild(div);

			expect(documentFragment.getElementsByTagName('div')).toEqual([div, div2]);
		});
	});

	describe('getElementsByClassName()', () => {
		test('Returns elements by class name.', () => {
			const div = document.createElement('div');
			const div2 = document.createElement('div');

			div.className = 'div';
			div2.className = 'div';
			div.appendChild(div2);
			documentFragment.appendChild(div);

			expect(documentFragment.getElementsByClassName('div')).toEqual([div, div2]);
		});
	});
});

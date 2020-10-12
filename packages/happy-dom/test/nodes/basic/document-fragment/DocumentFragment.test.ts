import NamespaceURI from '../../../../src/html-config/NamespaceURI';
import Window from '../../../../src/window/Window';
import Node from '../../../../src/nodes/basic/node/Node';

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
		test('Returns elements matching a tag name.', () => {
			const div1 = document.createElement('div');
			const div2 = document.createElement('div');
			const div3 = document.createElement('div');
			const textNode = document.createTextNode('text');

			documentFragment.appendChild(div1);

			div1.appendChild(div2);
			div2.appendChild(div3);
			div3.appendChild(textNode);

			expect(documentFragment.getElementsByTagName('div')).toEqual([div1, div2, div3]);
		});
	});

	describe('getElementsByTagNameNS()', () => {
		test('Returns elements matching a tag name and namespace.', () => {
			const div1 = document.createElementNS(NamespaceURI.svg, 'div');
			const div2 = document.createElement('div');
			const div3 = document.createElementNS(NamespaceURI.svg, 'div');
			const textNode = document.createTextNode('text');

			documentFragment.appendChild(div1);

			div1.appendChild(div2);
			div2.appendChild(div3);
			div3.appendChild(textNode);

			expect(documentFragment.getElementsByTagNameNS(NamespaceURI.svg, 'div')).toEqual([
				div1,
				div3
			]);
			expect(documentFragment.getElementsByTagNameNS(NamespaceURI.svg, '*')).toEqual([div1, div3]);
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

	describe('cloneNode', () => {
		test('Makes a shallow clone of a node (default behaviour).', () => {
			const text = document.createTextNode('test');
			const div = document.createElement('div');
			const comment = document.createComment('test');

			documentFragment.appendChild(text);
			documentFragment.appendChild(div);
			documentFragment.appendChild(comment);

			const clone = documentFragment.cloneNode(false);

			expect(clone).toEqual({ ...documentFragment, childNodes: [], children: [] });
			expect(documentFragment !== clone).toBe(true);
		});

		test('Makes a deep clone of the document fragment.', () => {
			const text = document.createTextNode('test');
			const div = document.createElement('div');
			const comment = document.createComment('test');

			documentFragment.appendChild(text);
			documentFragment.appendChild(div);
			documentFragment.appendChild(comment);

			const clone = documentFragment.cloneNode(true);

			expect(clone).toEqual(documentFragment);
			expect(clone.childNodes.length).toBe(3);
			expect(clone.children).toEqual(
				clone.childNodes.filter(node => node.nodeType === Node.ELEMENT_NODE)
			);
		});
	});
});

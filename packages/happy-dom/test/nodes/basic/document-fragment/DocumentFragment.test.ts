import Window from '../../../../src/window/Window';
import Node from '../../../../src/nodes/basic/node/Node';
import ParentNodeUtility from '../../../../src/nodes/basic/parent-node/ParentNodeUtility';
import QuerySelector from '../../../../src/query-selector/QuerySelector';

describe('DocumentFragment', () => {
	let window, document, documentFragment;

	beforeEach(() => {
		window = new Window();
		document = window.document;
		documentFragment = document.createDocumentFragment();
	});

	afterEach(() => {
		jest.restoreAllMocks();
	});

	describe('get children()', () => {
		test('Returns Element child nodes.', () => {
			const div = document.createElement('div');
			const span = document.createElement('span');
			documentFragment.appendChild(document.createTextNode('test'));
			documentFragment.appendChild(div);
			documentFragment.appendChild(document.createTextNode('test'));
			documentFragment.appendChild(span);
			expect(documentFragment.children).toEqual([div, span]);
		});
	});

	describe('get childElementCount()', () => {
		test('Returns child element count.', () => {
			const div = document.createElement('div');
			const span = document.createElement('span');
			documentFragment.appendChild(document.createTextNode('test'));
			documentFragment.appendChild(div);
			documentFragment.appendChild(document.createTextNode('test'));
			documentFragment.appendChild(span);
			expect(documentFragment.childElementCount).toEqual(2);
		});
	});

	describe('get firstElementChild()', () => {
		test('Returns first element child.', () => {
			const div = document.createElement('div');
			const span = document.createElement('span');
			documentFragment.appendChild(document.createTextNode('test'));
			documentFragment.appendChild(div);
			documentFragment.appendChild(document.createTextNode('test'));
			documentFragment.appendChild(span);
			expect(documentFragment.firstElementChild).toEqual(div);
		});
	});

	describe('get lastElementChild()', () => {
		test('Returns last element child.', () => {
			const div = document.createElement('div');
			const span = document.createElement('span');
			documentFragment.appendChild(document.createTextNode('test'));
			documentFragment.appendChild(div);
			documentFragment.appendChild(document.createTextNode('test'));
			documentFragment.appendChild(span);
			expect(documentFragment.lastElementChild).toEqual(span);
		});
	});

	describe('append()', () => {
		test('Inserts a set of Node objects or DOMString objects after the last child of the ParentNode. DOMString objects are inserted as equivalent Text nodes.', () => {
			const node1 = document.createComment('test1');
			const node2 = document.createComment('test2');
			let isCalled = false;

			jest.spyOn(ParentNodeUtility, 'append').mockImplementation((parentNode, ...nodes) => {
				expect(parentNode).toBe(documentFragment);
				expect(nodes).toEqual([node1, node2]);
				isCalled = true;
			});

			documentFragment.append(node1, node2);
			expect(isCalled).toBe(true);
		});
	});

	describe('prepend()', () => {
		test('Inserts a set of Node objects or DOMString objects before the first child of the ParentNode. DOMString objects are inserted as equivalent Text nodes.', () => {
			const node1 = document.createComment('test1');
			const node2 = document.createComment('test2');
			let isCalled = false;

			jest.spyOn(ParentNodeUtility, 'prepend').mockImplementation((parentNode, ...nodes) => {
				expect(parentNode).toBe(documentFragment);
				expect(nodes).toEqual([node1, node2]);
				isCalled = true;
			});

			documentFragment.prepend(node1, node2);
			expect(isCalled).toBe(true);
		});
	});

	describe('replaceChildren()', () => {
		test('Replaces the existing children of a ParentNode with a specified new set of children.', () => {
			const node1 = document.createComment('test1');
			const node2 = document.createComment('test2');
			let isCalled = false;

			jest
				.spyOn(ParentNodeUtility, 'replaceChildren')
				.mockImplementation((parentNode, ...nodes) => {
					expect(parentNode).toBe(documentFragment);
					expect(nodes).toEqual([node1, node2]);
					isCalled = true;
				});

			documentFragment.replaceChildren(node1, node2);
			expect(isCalled).toBe(true);
		});
	});

	describe('querySelectorAll()', () => {
		test('Query CSS selector to find matching elements.', () => {
			const element = document.createElement('div');
			const expectedSelector = 'selector';

			jest.spyOn(QuerySelector, 'querySelectorAll').mockImplementation((parentNode, selector) => {
				expect(parentNode).toBe(documentFragment);
				expect(selector).toEqual(expectedSelector);
				return [element];
			});

			expect(documentFragment.querySelectorAll(expectedSelector)).toEqual([element]);
		});
	});

	describe('querySelector()', () => {
		test('Query CSS selector to find a matching element.', () => {
			const element = document.createElement('div');
			const expectedSelector = 'selector';

			jest.spyOn(QuerySelector, 'querySelector').mockImplementation((parentNode, selector) => {
				expect(parentNode).toBe(documentFragment);
				expect(selector).toEqual(expectedSelector);
				return element;
			});

			expect(documentFragment.querySelector(expectedSelector)).toEqual(element);
		});
	});

	describe('appendChild()', () => {
		test('Updates the children property when appending an element child.', () => {
			const div = document.createElement('div');
			const span = document.createElement('span');

			documentFragment.appendChild(document.createComment('test'));
			documentFragment.appendChild(div);
			documentFragment.appendChild(document.createComment('test'));
			documentFragment.appendChild(span);

			expect(documentFragment.children).toEqual([div, span]);
		});
	});

	describe('removeChild()', () => {
		test('Updates the children property when removing an element child.', () => {
			const div = document.createElement('div');
			const span = document.createElement('span');

			documentFragment.appendChild(document.createComment('test'));
			documentFragment.appendChild(div);
			documentFragment.appendChild(document.createComment('test'));
			documentFragment.appendChild(span);

			documentFragment.removeChild(div);

			expect(documentFragment.children).toEqual([span]);
		});
	});

	describe('insertBefore()', () => {
		test('Updates the children property when appending an element child.', () => {
			const div1 = document.createElement('div');
			const div2 = document.createElement('div');
			const span = document.createElement('span');

			documentFragment.appendChild(document.createComment('test'));
			documentFragment.appendChild(div1);
			documentFragment.appendChild(document.createComment('test'));
			documentFragment.appendChild(span);
			documentFragment.insertBefore(div2, div1);

			expect(documentFragment.children).toEqual([div2, div1, span]);
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

import CharacterDataUtility from '../../../src/nodes/character-data/CharacterDataUtility.js';
import NonDocumentChildNodeUtility from '../../../src/nodes/child-node/NonDocumentChildNodeUtility.js';
import ChildNodeUtility from '../../../src/nodes/child-node/ChildNodeUtility.js';
import CharacterData from '../../../src/nodes/character-data/CharacterData.js';
import Window from '../../../src/window/Window.js';
import Document from '../../../src/nodes/document/Document.js';
import { beforeEach, afterEach, describe, it, expect, vi } from 'vitest';

describe('CharaterData', () => {
	let window: Window;
	let document: Document;

	beforeEach(() => {
		window = new Window();
		document = window.document;
	});

	afterEach(() => {
		vi.restoreAllMocks();
	});

	describe('get length()', () => {
		it('Returns "#comment".', () => {
			const node = document.createComment('test');
			expect(node.length).toBe(4);
		});
	});

	describe('get data()', () => {
		it('Returns text content.', () => {
			const node = <CharacterData>document.createComment('test');
			expect(node.data).toBe('test');
		});
	});

	describe('set data()', () => {
		it('Sets text content.', () => {
			const node = <CharacterData>document.createComment('test');
			node.data = 'new text';
			expect(node.data).toBe('new text');
			node.data = <string>(<unknown>0);
			expect(node.data).toBe('0');
		});
	});

	describe('get nodeValue()', () => {
		it('Returns text content.', () => {
			const node = document.createTextNode('test');
			expect(node.nodeValue).toBe('test');
		});
	});

	describe('set nodeValue()', () => {
		it('Sets text content.', () => {
			const node = document.createTextNode('test');
			node.nodeValue = 'new text';
			expect(node.nodeValue).toBe('new text');
			node.nodeValue = <string>(<unknown>0);
			expect(node.nodeValue).toBe('0');
		});
	});

	describe('get textContent()', () => {
		it('Returns text content.', () => {
			const node = document.createComment('test');
			expect(node.textContent).toBe('test');
		});
	});

	describe('set textContent()', () => {
		it('Sets text content.', () => {
			const node = document.createComment('test');
			node.textContent = 'new text';
			expect(node.textContent).toBe('new text');
			node.textContent = <string>(<unknown>0);
			expect(node.textContent).toBe('0');
		});
	});

	describe('appendData()', () => {
		it('Appends data.', () => {
			const node = <CharacterData>document.createComment('test');
			const expectedData = 'data';
			let isCalled = false;

			vi.spyOn(CharacterDataUtility, 'appendData').mockImplementation((characterData, data) => {
				expect(characterData).toBe(node);
				expect(data).toBe(expectedData);
				isCalled = true;
			});

			node.appendData(expectedData);
			expect(isCalled).toBe(true);
		});
	});

	describe('deleteData()', () => {
		it('Deletes data.', () => {
			const node = <CharacterData>document.createComment('test');
			const expectedOffset = -1;
			const expectedCount = -1;
			let isCalled = false;

			vi.spyOn(CharacterDataUtility, 'deleteData').mockImplementation(
				(characterData, offset, count) => {
					expect(characterData).toBe(node);
					expect(offset).toBe(expectedOffset);
					expect(count).toBe(expectedCount);
					isCalled = true;
				}
			);

			node.deleteData(expectedOffset, expectedCount);
			expect(isCalled).toBe(true);
		});
	});

	describe('insertData()', () => {
		it('Inserts data.', () => {
			const node = <CharacterData>document.createComment('test');
			const expectedOffset = -1;
			const expectedData = 'data';
			let isCalled = false;

			vi.spyOn(CharacterDataUtility, 'insertData').mockImplementation(
				(characterData, offset, data) => {
					expect(characterData).toBe(node);
					expect(offset).toBe(expectedOffset);
					expect(data).toBe(expectedData);
					isCalled = true;
				}
			);

			node.insertData(expectedOffset, expectedData);
			expect(isCalled).toBe(true);
		});
	});

	describe('replaceData()', () => {
		it('Replaces data.', () => {
			const node = <CharacterData>document.createComment('test');
			const expectedOffset = -1;
			const expectedCount = -1;
			const expectedData = 'data';
			let isCalled = false;

			vi.spyOn(CharacterDataUtility, 'replaceData').mockImplementation(
				(characterData, offset, count, data) => {
					expect(characterData).toBe(node);
					expect(offset).toBe(expectedOffset);
					expect(count).toBe(expectedCount);
					expect(data).toBe(expectedData);
					isCalled = true;
				}
			);

			node.replaceData(expectedOffset, expectedCount, expectedData);
			expect(isCalled).toBe(true);
		});
	});

	describe('substringData()', () => {
		it('Returns a sub-string.', () => {
			const node = document.createComment('test');
			const expectedOffset = -1;
			const expectedCount = -1;

			vi.spyOn(CharacterDataUtility, 'substringData').mockImplementation(
				(characterData, offset, count) => {
					expect(characterData).toBe(node);
					expect(offset).toBe(expectedOffset);
					expect(count).toBe(expectedCount);
					return 'substring';
				}
			);

			expect(node.substringData(expectedOffset, expectedCount)).toBe('substring');
		});
	});

	describe('get previousElementSibling()', () => {
		it('Returns previous element sibling..', () => {
			const node = document.createComment('test');
			const previousElementSibling = document.createElement('div');
			vi.spyOn(NonDocumentChildNodeUtility, 'previousElementSibling').mockImplementation(
				(childNode) => {
					expect(childNode).toBe(node);
					return previousElementSibling;
				}
			);

			expect(node.previousElementSibling).toBe(previousElementSibling);
		});
	});

	describe('get nextElementSibling()', () => {
		it('Returns next element sibling..', () => {
			const node = document.createComment('test');
			const nextElementSibling = document.createElement('div');
			vi.spyOn(NonDocumentChildNodeUtility, 'nextElementSibling').mockImplementation(
				(childNode) => {
					expect(childNode).toBe(node);
					return nextElementSibling;
				}
			);

			expect(node.nextElementSibling).toBe(nextElementSibling);
		});
	});

	describe('remove()', () => {
		it('Removes the node from its parent.', () => {
			const comment = document.createComment('test');
			let isCalled = false;

			vi.spyOn(ChildNodeUtility, 'remove').mockImplementation((childNode) => {
				expect(childNode).toBe(comment);
				isCalled = true;
			});

			comment.remove();
			expect(isCalled).toBe(true);
		});
	});

	describe('replaceWith()', () => {
		it('Replaces a Node in the children list of its parent with a set of Node or DOMString objects.', () => {
			const comment = document.createComment('test');
			const node1 = document.createComment('test1');
			const node2 = document.createComment('test2');
			let isCalled = false;

			vi.spyOn(ChildNodeUtility, 'replaceWith').mockImplementation((childNode, ...nodes) => {
				expect(childNode).toBe(comment);
				expect(nodes).toEqual([node1, node2]);
				isCalled = true;
			});

			comment.replaceWith(node1, node2);
			expect(isCalled).toBe(true);
		});
	});

	describe('before()', () => {
		it("Inserts a set of Node or DOMString objects in the children list of this ChildNode's parent, just before this ChildNode. DOMString objects are inserted as equivalent Text nodes.", () => {
			const comment = document.createComment('test');
			const node1 = document.createComment('test1');
			const node2 = document.createComment('test2');
			let isCalled = false;

			vi.spyOn(ChildNodeUtility, 'before').mockImplementation((childNode, ...nodes) => {
				expect(childNode).toBe(comment);
				expect(nodes).toEqual([node1, node2]);
				isCalled = true;
			});

			comment.before(node1, node2);
			expect(isCalled).toBe(true);
		});
	});

	describe('after()', () => {
		it("Inserts a set of Node or DOMString objects in the children list of this ChildNode's parent, just after this ChildNode. DOMString objects are inserted as equivalent Text nodes.", () => {
			const comment = document.createComment('test');
			const node1 = document.createComment('test1');
			const node2 = document.createComment('test2');
			let isCalled = false;

			vi.spyOn(ChildNodeUtility, 'after').mockImplementation((childNode, ...nodes) => {
				expect(childNode).toBe(comment);
				expect(nodes).toEqual([node1, node2]);
				isCalled = true;
			});

			comment.after(node1, node2);
			expect(isCalled).toBe(true);
		});
	});

	describe('cloneNode()', () => {
		it('Clones the node.', () => {
			const node = document.createComment('test');
			const clone = node.cloneNode();
			expect(clone.data).toBe(node.data);
		});
	});
});

import NonDocumentChildNodeUtility from '../../../../src/nodes/basic/child-node/NonDocumentChildNodeUtility';
import CharacterDataUtility from '../../../../src/nodes/basic/character-data/CharacterDataUtility';
import Window from '../../../../src/window/Window';

describe('CommentNode', () => {
	let window, document;

	beforeEach(() => {
		window = new Window();
		document = window.document;
	});

	afterEach(() => {
		jest.restoreAllMocks();
	});

	describe('get nodeName()', () => {
		test('Returns "#comment".', () => {
			const node = document.createComment('test');
			expect(node.nodeName).toBe('#comment');
		});
	});

	describe('get length()', () => {
		test('Returns "#comment".', () => {
			const node = document.createComment('test');
			expect(node.length).toBe(4);
		});
	});

	describe('get textContent()', () => {
		test('Returns text content.', () => {
			const node = document.createComment('test');
			expect(node.textContent).toBe('test');
		});
	});

	describe('set textContent()', () => {
		test('Sets text content.', () => {
			const node = document.createComment('test');
			node.textContent = 'new text';
			expect(node.textContent).toBe('new text');
		});
	});

	describe('get nodeValue()', () => {
		test('Returns text content.', () => {
			const node = document.createComment('test');
			expect(node.nodeValue).toBe('test');
		});
	});

	describe('set nodeValue()', () => {
		test('Sets text content.', () => {
			const node = document.createComment('test');
			node.nodeValue = 'new text';
			expect(node.nodeValue).toBe('new text');
		});
	});

	describe('get data()', () => {
		test('Returns text content.', () => {
			const node = document.createComment('test');
			expect(node.data).toBe('test');
		});
	});

	describe('set data()', () => {
		test('Sets text content.', () => {
			const node = document.createComment('test');
			node.data = 'new text';
			expect(node.data).toBe('new text');
		});
	});

	describe('get previousElementSibling()', () => {
		test('Returns previous element sibling..', () => {
			const node = document.createComment('test');
			const previousElementSibling = document.createElement('div');
			jest
				.spyOn(NonDocumentChildNodeUtility, 'previousElementSibling')
				.mockImplementation(childNode => {
					expect(childNode).toBe(node);
					return previousElementSibling;
				});

			expect(node.previousElementSibling).toBe(previousElementSibling);
		});
	});

	describe('get nextElementSibling()', () => {
		test('Returns next element sibling..', () => {
			const node = document.createComment('test');
			const nextElementSibling = document.createElement('div');
			jest
				.spyOn(NonDocumentChildNodeUtility, 'nextElementSibling')
				.mockImplementation(childNode => {
					expect(childNode).toBe(node);
					return nextElementSibling;
				});

			expect(node.nextElementSibling).toBe(nextElementSibling);
		});
	});

	describe('toString()', () => {
		test('Returns "[object Comment]".', () => {
			const node = document.createComment('test');
			expect(node.toString()).toBe('[object Comment]');
		});
	});

	describe('remove()', () => {
		test('Removes the node from its parent.', () => {
			const node = document.createComment('test');
			let isCalled = false;

			jest.spyOn(CharacterDataUtility, 'remove').mockImplementation(childNode => {
				expect(childNode).toBe(node);
				isCalled = true;
			});

			node.remove();
			expect(isCalled).toBe(true);
		});
	});

	describe('appendData()', () => {
		test('Appends data.', () => {
			const node = document.createComment('test');
			const expectedData = 'data';
			let isCalled = false;

			jest.spyOn(CharacterDataUtility, 'appendData').mockImplementation((characterData, data) => {
				expect(characterData).toBe(node);
				expect(data).toBe(expectedData);
				isCalled = true;
			});

			node.appendData(expectedData);
			expect(isCalled).toBe(true);
		});
	});

	describe('deleteData()', () => {
		test('Deletes data.', () => {
			const node = document.createComment('test');
			const expectedOffset = -1;
			const expectedCount = -1;
			let isCalled = false;

			jest
				.spyOn(CharacterDataUtility, 'deleteData')
				.mockImplementation((characterData, offset, count) => {
					expect(characterData).toBe(node);
					expect(offset).toBe(expectedOffset);
					expect(count).toBe(expectedCount);
					isCalled = true;
				});

			node.deleteData(expectedOffset, expectedCount);
			expect(isCalled).toBe(true);
		});
	});

	describe('insertData()', () => {
		test('Inserts data.', () => {
			const node = document.createComment('test');
			const expectedOffset = -1;
			const expectedData = 'data';
			let isCalled = false;

			jest
				.spyOn(CharacterDataUtility, 'insertData')
				.mockImplementation((characterData, offset, data) => {
					expect(characterData).toBe(node);
					expect(offset).toBe(expectedOffset);
					expect(data).toBe(expectedData);
					isCalled = true;
				});

			node.insertData(expectedOffset, expectedData);
			expect(isCalled).toBe(true);
		});
	});

	describe('replaceData()', () => {
		test('Replaces data.', () => {
			const node = document.createComment('test');
			const expectedOffset = -1;
			const expectedCount = -1;
			const expectedData = 'data';
			let isCalled = false;

			jest
				.spyOn(CharacterDataUtility, 'replaceData')
				.mockImplementation((characterData, offset, count, data) => {
					expect(characterData).toBe(node);
					expect(offset).toBe(expectedOffset);
					expect(count).toBe(expectedCount);
					expect(data).toBe(expectedData);
					isCalled = true;
				});

			node.replaceData(expectedOffset, expectedCount, expectedData);
			expect(isCalled).toBe(true);
		});
	});

	describe('substringData()', () => {
		test('Returns a sub-string.', () => {
			const node = document.createComment('test');
			const expectedOffset = -1;
			const expectedCount = -1;

			jest
				.spyOn(CharacterDataUtility, 'substringData')
				.mockImplementation((characterData, offset, count) => {
					expect(characterData).toBe(node);
					expect(offset).toBe(expectedOffset);
					expect(count).toBe(expectedCount);
					return 'substring';
				});

			expect(node.substringData(expectedOffset, expectedCount)).toBe('substring');
		});
	});

	describe('cloneNode()', () => {
		test('Clones the node.', () => {
			const node = document.createComment('test');
			const clone = node.cloneNode();
			expect(clone.data).toBe(node.data);
		});
	});
});

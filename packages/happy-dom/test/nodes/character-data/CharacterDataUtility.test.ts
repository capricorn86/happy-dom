import Window from '../../../src/window/Window';
import CharacterDataUtility from '../../../src/nodes/character-data/CharacterDataUtility';

describe('CharacterDataTest', () => {
	let window, document;

	beforeEach(() => {
		window = new Window();
		document = window.document;
	});

	describe('remove()', () => {
		test('Removes a node.', () => {
			const parent = document.createElement('div');
			const node = document.createComment('test');
			parent.appendChild(node);
			CharacterDataUtility.remove(node);
			expect(node.parentNode).toBe(null);
			expect(parent.childNodes.length).toBe(0);
		});
	});

	describe('appendData()', () => {
		test('Appends data.', () => {
			const node = document.createComment('test');
			CharacterDataUtility.appendData(node, 'appended');
			expect(node.data).toBe('testappended');
		});
	});

	describe('deleteData()', () => {
		test('Deletes data.', () => {
			const node = document.createComment('longstring');
			CharacterDataUtility.deleteData(node, 1, 3);
			expect(node.data).toBe('lstring');
		});
	});

	describe('insertData()', () => {
		test('Inserts data.', () => {
			const node = document.createComment('longstring');
			CharacterDataUtility.insertData(node, 1, 'test');
			expect(node.data).toBe('ltestongstring');
		});
	});

	describe('replaceData()', () => {
		test('Replaces data.', () => {
			const node = document.createComment('longstring');
			CharacterDataUtility.replaceData(node, 1, 3, 'test');
			expect(node.data).toBe('lteststring');
		});
	});

	describe('substringData()', () => {
		test('Returns a sub-string.', () => {
			const node = document.createComment('longstring');
			expect(CharacterDataUtility.substringData(node, 1, 3)).toBe('ong');
		});
	});
});

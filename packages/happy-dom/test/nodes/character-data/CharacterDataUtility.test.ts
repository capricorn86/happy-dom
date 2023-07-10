import Window from '../../../src/window/Window.js';
import Document from '../../../src/nodes/document/Document.js';
import CharacterDataUtility from '../../../src/nodes/character-data/CharacterDataUtility.js';
import { beforeEach, describe, it, expect } from 'vitest';

describe('CharacterDataTest', () => {
	let window: Window;
	let document: Document;

	beforeEach(() => {
		window = new Window();
		document = window.document;
	});

	describe('appendData()', () => {
		it('Appends data.', () => {
			const node = document.createComment('test');
			CharacterDataUtility.appendData(node, 'appended');
			expect(node.data).toBe('testappended');
		});
	});

	describe('deleteData()', () => {
		it('Deletes data.', () => {
			const node = document.createComment('longstring');
			CharacterDataUtility.deleteData(node, 1, 3);
			expect(node.data).toBe('lstring');
		});
	});

	describe('insertData()', () => {
		it('Inserts data.', () => {
			const node = document.createComment('longstring');
			CharacterDataUtility.insertData(node, 1, 'test');
			expect(node.data).toBe('ltestongstring');
		});
	});

	describe('replaceData()', () => {
		it('Replaces data.', () => {
			const node = document.createComment('longstring');
			CharacterDataUtility.replaceData(node, 1, 3, 'test');
			expect(node.data).toBe('lteststring');
		});
	});

	describe('substringData()', () => {
		it('Returns a sub-string.', () => {
			const node = document.createComment('longstring');
			expect(CharacterDataUtility.substringData(node, 1, 3)).toBe('ong');
		});
	});
});

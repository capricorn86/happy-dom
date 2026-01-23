import Window from '../../../src/window/Window.js';
import Document from '../../../src/nodes/document/Document.js';
import File from '../../../src/file/File.js';
import HTMLInputElement from '../../../src/nodes/html-input-element/HTMLInputElement.js';
import { beforeEach, afterEach, describe, it, expect } from 'vitest';

describe('FileList', () => {
	let window: Window;
	let document: Document;

	beforeEach(() => {
		window = new Window();
		document = window.document;
	});

	describe('item()', () => {
		it('Returns file at index.', () => {
			const element = <HTMLInputElement>document.createElement('input');
			const file1 = new File([''], 'file.txt');
			const file2 = new File([''], 'file2.txt');

			element.files.push(file1);
			element.files.push(file2);

			expect(element.files.item(0)).toBe(file1);
			expect(element.files.item(1)).toBe(file2);
		});
	});
});

import Window from '../../../src/window/Window.js';
import IWindow from '../../../src/window/Window.js';
import IDocument from '../../../src/nodes/document/IDocument.js';
import File from '../../../src/file/File.js';
import IHTMLInputElement from '../../../src/nodes/html-input-element/IHTMLInputElement.js';
import { beforeEach, afterEach, describe, it, expect } from 'vitest';

describe('FileList', () => {
	let window: IWindow;
	let document: IDocument;

	beforeEach(() => {
		window = new Window();
		document = window.document;
	});

	describe('item()', () => {
		it('Returns file at index.', () => {
			const element = <IHTMLInputElement>document.createElement('input');
			const file1 = new File([''], 'file.txt');
			const file2 = new File([''], 'file2.txt');

			element.files.push(file1);
			element.files.push(file2);

			expect(element.files.item(0)).toBe(file1);
			expect(element.files.item(1)).toBe(file2);
		});
	});
});

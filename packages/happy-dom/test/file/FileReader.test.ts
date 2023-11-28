import Blob from '../../src/file/Blob.js';
import FileReader from '../../src/file/FileReader.js';
import Window from '../../src/window/Window.js';
import { beforeEach, describe, it, expect } from 'vitest';

describe('FileReader', () => {
	let window: Window;
	let fileReader: FileReader;

	beforeEach(() => {
		window = new Window();
		fileReader = new window.FileReader();
	});

	describe('readAsDataURL()', () => {
		it('Reads Blob as data URL.', async () => {
			const blob = new Blob(['TEST'], {
				type: 'text/plain;charset=utf-8'
			});
			let result: string | null = null;
			fileReader.addEventListener('load', () => {
				result = <string>fileReader.result;
			});
			fileReader.readAsDataURL(blob);
			await window.happyDOM?.whenComplete();
			expect(result).toBe('data:text/plain;charset=utf-8;base64,VEVTVA==');
		});
	});
});

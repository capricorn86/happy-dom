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
			await window.happyDOM?.waitUntilComplete();
			expect(result).toBe('data:text/plain;charset=utf-8;base64,VEVTVA==');
		});

		it('Reads Blob as data URL passing invalid parameter.', () => {
			expect(() => {
				fileReader.readAsDataURL(<any>'invalid');
			}).toThrow(
				`Failed to execute 'readAsDataURL' on 'FileReader': parameter 1 is not of type 'Blob'.`
			);
		});
	});

	describe('readAsText()', () => {
		it('Reads Blob as text.', async () => {
			const blob = new Blob(['TEST'], {
				type: 'text/plain;charset=utf-8'
			});
			let result: string | null = null;
			fileReader.addEventListener('load', () => {
				result = <string>fileReader.result;
			});
			fileReader.readAsText(blob);
			await window.happyDOM?.waitUntilComplete();
			expect(result).toBe('TEST');
		});

		it('Reads Blob as text passing invalid parameter.', () => {
			expect(() => {
				fileReader.readAsText(<any>'invalid');
			}).toThrow(
				`Failed to execute 'readAsText' on 'FileReader': parameter 1 is not of type 'Blob'.`
			);
		});
	});

	describe('readAsArrayBuffer()', () => {
		it('Reads Blob as array buffer.', async () => {
			const blob = new Blob(['TEST'], {
				type: 'text/plain;charset=utf-8'
			});
			let result: ArrayBuffer | null = null;
			fileReader.addEventListener('load', () => {
				result = <ArrayBuffer>fileReader.result;
			});
			fileReader.readAsArrayBuffer(blob);
			await window.happyDOM?.waitUntilComplete();
			expect(result).toBeInstanceOf(ArrayBuffer);
		});

		it('Reads Blob as array buffer passing invalid parameter.', () => {
			expect(() => {
				fileReader.readAsArrayBuffer(<any>'invalid');
			}).toThrow(
				`Failed to execute 'readAsArrayBuffer' on 'FileReader': parameter 1 is not of type 'Blob'.`
			);
		});
	});

	describe('readAsBinaryString()', () => {
		it('Reads Blob as binary string.', async () => {
			const blob = new Blob(['TEST'], {
				type: 'text/plain;charset=utf-8'
			});
			let result: string | null = null;
			fileReader.addEventListener('load', () => {
				result = <string>fileReader.result;
			});
			fileReader.readAsBinaryString(blob);
			await window.happyDOM?.waitUntilComplete();
			expect(result).toBe('TEST');
		});

		it('Reads Blob as binary string passing invalid parameter.', () => {
			expect(() => {
				fileReader.readAsBinaryString(<any>'invalid');
			}).toThrow(
				`Failed to execute 'readAsBinaryString' on 'FileReader': parameter 1 is not of type 'Blob'.`
			);
		});
	});
});

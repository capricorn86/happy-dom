import ClipboardItem from '../../src/clipboard/ClipboardItem.js';
import Blob from '../../src/file/Blob.js';
import Window from '../../src/window/Window.js';
import IWindow from '../../src/window/IWindow.js';
import { beforeEach, describe, it, expect } from 'vitest';

describe('Clipboard', () => {
	let window: IWindow;

	beforeEach(() => {
		window = new Window();
	});

	describe('read()', () => {
		it('Reads from the clipboard.', async () => {
			const items = [
				new ClipboardItem({
					'text/plain': new Blob(['test'], { type: 'text/plain' })
				}),
				new ClipboardItem({
					'text/html': new Blob(['<b>test</b>'], { type: 'text/html' })
				})
			];
			await window.navigator.clipboard.write(items);
			const data = await window.navigator.clipboard.read();
			expect(data).toEqual(items);
		});

		it('Throws an error if the permission is denied.', async () => {
			const permissionStatus = await window.navigator.permissions.query({
				name: 'clipboard-read'
			});
			permissionStatus.state = 'denied';

			let error: Error | null = null;

			try {
				await window.navigator.clipboard.read();
			} catch (e) {
				error = e;
			}

			expect(error?.message).toBe(
				"Failed to execute 'read' on 'Clipboard': The request is not allowed"
			);
		});
	});

	describe('readText()', () => {
		it('Reads text from the clipboard.', async () => {
			const items = [
				new ClipboardItem({
					'text/plain': new Blob(['test'], { type: 'text/plain' })
				}),
				new ClipboardItem({
					'text/html': new Blob(['<b>test</b>'], { type: 'text/html' })
				})
			];
			await window.navigator.clipboard.write(items);
			const data = await window.navigator.clipboard.readText();
			expect(data).toBe('test');
		});

		it('Throws an error if the permission is denied.', async () => {
			const permissionStatus = await window.navigator.permissions.query({
				name: 'clipboard-read'
			});
			permissionStatus.state = 'denied';

			let error: Error | null = null;

			try {
				await window.navigator.clipboard.readText();
			} catch (e) {
				error = e;
			}

			expect(error?.message).toBe(
				"Failed to execute 'readText' on 'Clipboard': The request is not allowed"
			);
		});
	});

	describe('write()', () => {
		it('Writes to the clipboard.', async () => {
			const items = [
				new ClipboardItem({
					'text/plain': new Blob(['test'], { type: 'text/plain' })
				}),
				new ClipboardItem({
					'text/html': new Blob(['<b>test</b>'], { type: 'text/html' })
				})
			];
			await window.navigator.clipboard.write(items);
			const data = await window.navigator.clipboard.read();
			expect(data).toEqual(items);
		});

		it('Throws an error if the permission is denied.', async () => {
			const permissionStatus = await window.navigator.permissions.query({
				name: 'clipboard-write'
			});
			permissionStatus.state = 'denied';

			let error: Error | null = null;

			try {
				await window.navigator.clipboard.write([]);
			} catch (e) {
				error = e;
			}

			expect(error?.message).toBe(
				"Failed to execute 'write' on 'Clipboard': The request is not allowed"
			);
		});
	});

	describe('writeText()', () => {
		it('Writes text to the clipboard.', async () => {
			const text = 'test';
			await window.navigator.clipboard.writeText(text);
			const data = await window.navigator.clipboard.readText();
			expect(data).toBe(text);
		});

		it('Throws an error if the permission is denied.', async () => {
			const permissionStatus = await window.navigator.permissions.query({
				name: 'clipboard-write'
			});
			permissionStatus.state = 'denied';

			let error: Error | null = null;

			try {
				await window.navigator.clipboard.writeText('test');
			} catch (e) {
				error = e;
			}

			expect(error?.message).toBe(
				"Failed to execute 'writeText' on 'Clipboard': The request is not allowed"
			);
		});
	});
});

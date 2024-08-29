import { describe, it, expect, beforeEach } from 'vitest';
import BrowserWindow from '../../../src/window/BrowserWindow.js';
import Window from '../../../src/window/Window.js';

describe('RemotePlayback', () => {
	let window: BrowserWindow;

	beforeEach(() => {
		window = new Window();
	});

	describe('get state()', () => {
		it('Should return "disconnected" by default', () => {
			const remotePlayback = new window.RemotePlayback();
			expect(remotePlayback.state).toBe('disconnected');
		});
	});

	describe('watchAvailability()', () => {
		it('Should return a Promise that resolves to undefined', async () => {
			const remotePlayback = new window.RemotePlayback();
			await expect(remotePlayback.watchAvailability()).resolves.toBeUndefined();
		});
	});

	describe('cancelWatchAvailability()', () => {
		it('Should not throw an error', () => {
			const remotePlayback = new window.RemotePlayback();
			expect(() => remotePlayback.cancelWatchAvailability()).not.toThrow();
		});
	});

	describe('prompt()', () => {
		it('Should not throw an error', () => {
			const remotePlayback = new window.RemotePlayback();
			expect(() => remotePlayback.prompt()).not.toThrow();
		});
	});
});

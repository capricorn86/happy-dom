import { describe, it, expect, beforeEach } from 'vitest';
import RemotePlayback from '../../../src/nodes/html-media-element/RemotePlayback.js';

describe('RemotePlayback', () => {
	describe('get state()', () => {
		it('Should return "disconnected" by default', () => {
			const remotePlayback = new RemotePlayback();
			expect(remotePlayback.state).toBe('disconnected');
		});
	});

	describe('watchAvailability()', () => {
		it('Should return a Promise that resolves to undefined', async () => {
			const remotePlayback = new RemotePlayback();
			await expect(remotePlayback.watchAvailability()).resolves.toBeUndefined();
		});
	});

	describe('cancelWatchAvailability()', () => {
		it('Should not throw an error', () => {
			const remotePlayback = new RemotePlayback();
			expect(() => remotePlayback.cancelWatchAvailability()).not.toThrow();
		});
	});

	describe('prompt()', () => {
		it('Should not throw an error', () => {
			const remotePlayback = new RemotePlayback();
			expect(() => remotePlayback.prompt()).not.toThrow();
		});
	});
});

import { beforeEach, describe, it, expect } from 'vitest';
import Window from '../../src/window/Window.js';
import ScreenDetails from '../../src/screen/ScreenDetails.js';
import ScreenDetailed from '../../src/screen/ScreenDetailed.js';

describe('ScreenDetails', () => {
	let window: Window;

	beforeEach(() => {
		window = new Window();
	});

	it('Exposes ScreenDetails and ScreenDetailed classes on window.', () => {
		expect(window.ScreenDetails).toBe(ScreenDetails);
		expect(window.ScreenDetailed).toBe(ScreenDetailed);
	});

	it('Returns ScreenDetails with currentScreen and screens from getScreenDetails().', async () => {
		const screenDetails = await window.getScreenDetails();

		expect(screenDetails).toBeInstanceOf(ScreenDetails);
		expect(screenDetails.currentScreen).toBeInstanceOf(ScreenDetailed);
		expect(screenDetails.screens).toHaveLength(1);
		expect(screenDetails.screens[0]).toBeInstanceOf(ScreenDetailed);

		// ScreenDetailed inherits Screen properties
		const screen = screenDetails.currentScreen;
		expect(screen.width).toBe(1024);
		expect(screen.height).toBe(768);
		expect(screen.colorDepth).toBe(24);

		// ScreenDetailed-specific properties
		expect(screen.availLeft).toBe(0);
		expect(screen.availTop).toBe(0);
		expect(screen.isPrimary).toBe(true);
		expect(screen.isInternal).toBe(true);
		expect(screen.devicePixelRatio).toBe(1);
		expect(screen.label).toBe('');
	});
});

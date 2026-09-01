import { beforeEach, describe, it, expect } from 'vitest';
import Window from '../../src/window/Window.js';
import Screen from '../../src/screen/Screen.js';
import EventTarget from '../../src/event/EventTarget.js';

describe('Screen', () => {
	let window: Window;

	beforeEach(() => {
		window = new Window();
	});

	it('Exposes Screen classes on window.', () => {
		expect(window.Screen).toBe(Screen);
	});

	it('Returns Screen instance from the "window.screen" property.', async () => {
		const screen = window.screen;

		expect(screen).toBeInstanceOf(Screen);
		expect(screen).toBeInstanceOf(EventTarget);

		expect(screen.width).toBe(1024);
		expect(screen.height).toBe(768);
		expect(screen.availWidth).toBe(1024);
		expect(screen.availHeight).toBe(768);
		expect(screen.colorDepth).toBe(24);
		expect(screen.pixelDepth).toBe(24);

		expect(screen.onchange).toBeNull();
	});
});

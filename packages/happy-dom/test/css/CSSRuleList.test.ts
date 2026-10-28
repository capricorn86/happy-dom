import Window from '../../src/window/Window.js';
import type BrowserWindow from '../../src/window/BrowserWindow.js';
import type CSSStyleSheet from '../../src/css/CSSStyleSheet.js';
import { beforeEach, describe, it, expect } from 'vitest';

describe('CSSRuleList', () => {
	let window: BrowserWindow;
	let cssStyleSheet: CSSStyleSheet;

	beforeEach(() => {
		window = new Window();
		cssStyleSheet = new window.CSSStyleSheet();
	});

	describe('item()', () => {
		it('Returns CSSRule or null at index.', () => {
			cssStyleSheet.insertRule('div { color: black; }');
			expect(cssStyleSheet.cssRules.item(0)).not.toBeNull();
			expect(cssStyleSheet.cssRules.item(0)?.cssText).toBe('div { color: black; }');
			expect(cssStyleSheet.cssRules.item(1)).toBeNull();
		});
	});
});

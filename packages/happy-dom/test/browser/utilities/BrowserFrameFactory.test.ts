import { describe, it, expect } from 'vitest';
import Browser from '../../../src/browser/Browser';
import BrowserFrameFactory from '../../../src/browser/utilities/BrowserFrameFactory';
import * as PropertySymbol from '../../../src/PropertySymbol';

describe('BrowserFrameFactory', () => {
	describe('createChildFrame()', () => {
		it('Adds the child frame to the parent frame.', async () => {
			const browser = new Browser();
			const page = browser.newPage();
			const childFrame = BrowserFrameFactory.createChildFrame(page.mainFrame);

			expect(childFrame.parentFrame).toBe(page.mainFrame);
			expect(page.mainFrame.childFrames).toEqual([childFrame]);
			expect(childFrame.window.parent).toBe(page.mainFrame.window);
			expect(childFrame.window.top).toBe(page.mainFrame.window);
			expect(childFrame[PropertySymbol.contentWindow]).toBe(childFrame.window);

			await browser.close();
		});
	});

	describe('destroyFrame()', () => {
		it('Destroys the frame.', async () => {});
	});
});

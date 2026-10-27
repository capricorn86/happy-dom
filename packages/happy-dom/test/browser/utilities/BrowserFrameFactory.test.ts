import { describe, it, expect } from 'vitest';
import Browser from '../../../src/browser/Browser';
import BrowserFrameFactory from '../../../src/browser/utilities/BrowserFrameFactory';
import * as PropertySymbol from '../../../src/PropertySymbol';

describe('BrowserFrameFactory', () => {
	describe('createChildFrame()', () => {
		it('Adds the child frame to the parent frame.', () => {
			const browser = new Browser();
			const page = browser.newPage();
			const childFrame = BrowserFrameFactory.createChildFrame(page.mainFrame);

			expect(childFrame.parentFrame).toBe(page.mainFrame);
			expect(page.mainFrame.childFrames).toEqual([childFrame]);

			browser.close();
		});

		it('Inherits the origin of the parent frame.', () => {
			const browser = new Browser();
			const page = browser.newPage();
			page.mainFrame.url = 'https://parent.example/';
			const childFrame = BrowserFrameFactory.createChildFrame(page.mainFrame);

			expect(childFrame[PropertySymbol.inheritedOrigin]).toEqual({
				origin: 'https://parent.example',
				window: null
			});

			browser.close();
		});

		it('Gives the parent frame access to the window of the child frame, and the child frame access to its parent and top.', () => {
			const browser = new Browser();
			const page = browser.newPage();
			page.mainFrame.url = 'https://parent.example/';
			const childFrame = BrowserFrameFactory.createChildFrame(page.mainFrame);

			expect(childFrame[PropertySymbol.contentWindow] === childFrame.window).toBe(true);
			expect(childFrame.window.parent === page.mainFrame.window).toBe(true);
			expect(childFrame.window.top === page.mainFrame.window).toBe(true);

			browser.close();
		});
	});

	describe('destroyFrame()', () => {
		it('Clears the inherited origin and content window to not keep windows reachable.', async () => {
			const browser = new Browser();
			const page = browser.defaultContext.newPage();
			const childFrame = BrowserFrameFactory.createChildFrame(page.mainFrame);
			childFrame[PropertySymbol.inheritedOrigin] = {
				origin: 'null',
				window: page.mainFrame.window
			};
			childFrame[PropertySymbol.contentWindow] = childFrame.window;

			await BrowserFrameFactory.destroyFrame(childFrame);

			expect(childFrame[PropertySymbol.inheritedOrigin]).toBe(null);
			expect(childFrame[PropertySymbol.contentWindow]).toBe(null);

			await browser.close();
		});
	});
});

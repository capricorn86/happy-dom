import { describe, it, expect, afterEach, vi } from 'vitest';
import Browser from '../../../src/browser/Browser';
import BrowserFrameURL from '../../../src/browser/utilities/BrowserFrameURL';
import * as PropertySymbol from '../../../src/PropertySymbol';

describe('BrowserFrameURL', () => {
	afterEach(() => {
		vi.restoreAllMocks();
	});

	describe('getRelativeURL()', () => {
		it('Returns URL resolved against frame location.', () => {
			const browser = new Browser();
			const page = browser.defaultContext.newPage();
			page.mainFrame.url = 'http://localhost:3000/path/';

			const result = BrowserFrameURL.getRelativeURL(page.mainFrame, '/test');

			expect(result.href).toBe('http://localhost:3000/test');
			expect(result.origin).toBe('http://localhost:3000');

			browser.close();
		});

		it('Returns about:blank URL for about: protocol.', () => {
			const browser = new Browser();
			const page = browser.defaultContext.newPage();

			const result = BrowserFrameURL.getRelativeURL(page.mainFrame, 'about:blank');

			expect(result.href).toBe('about:blank');

			browser.close();
		});

		it('Returns about:blank URL for javascript: protocol.', () => {
			const browser = new Browser();
			const page = browser.defaultContext.newPage();

			const result = BrowserFrameURL.getRelativeURL(page.mainFrame, 'javascript:void(0)');

			expect(result.href).toBe('javascript:void(0)');

			browser.close();
		});

		it('Returns about:blank when url is null or undefined.', () => {
			const browser = new Browser();
			const page = browser.defaultContext.newPage();

			expect(BrowserFrameURL.getRelativeURL(page.mainFrame, null).href).toBe('about:blank');
			expect(BrowserFrameURL.getRelativeURL(page.mainFrame, undefined).href).toBe('about:blank');

			browser.close();
		});

		it('Returns correct URL when window.location getter is mocked with partial mock.', () => {
			const browser = new Browser();
			const page = browser.defaultContext.newPage();
			page.mainFrame.url = 'http://localhost:3000/path/';

			// Mock window.location getter with a partial mock (missing href, origin, etc.)
			// This simulates what testing frameworks like Jest do when mocking window.location
			const mockLocation = {
				reload: vi.fn()
			};

			Object.defineProperty(page.mainFrame.window, 'location', {
				get: () => mockLocation,
				configurable: true
			});

			// Verify the mock is in place - window.location should return our mock
			expect(page.mainFrame.window.location).toBe(mockLocation);
			expect(page.mainFrame.window.location.href).toBeUndefined();

			// But internal PropertySymbol.location should still return the real location
			expect(page.mainFrame.window[PropertySymbol.location].href).toBe(
				'http://localhost:3000/path/'
			);

			// getRelativeURL should still work correctly using internal location
			const result = BrowserFrameURL.getRelativeURL(page.mainFrame, '/test');

			expect(result.href).toBe('http://localhost:3000/test');
			expect(result.origin).toBe('http://localhost:3000');

			browser.close();
		});
	});
});

import { describe, it, expect, afterEach, vi } from 'vitest';
import Browser from '../../../src/browser/Browser';
import BrowserFrameFactory from '../../../src/browser/utilities/BrowserFrameFactory';
import Fetch from '../../../src/fetch/Fetch';
import BrowserFrameURL from '../../../src/browser/utilities/BrowserFrameURL';
import * as PropertySymbol from '../../../src/PropertySymbol';

describe('BrowserFrameURL', () => {
	afterEach(() => {
		vi.restoreAllMocks();
	});

	describe('isSameOrigin()', () => {
		it('Returns true for frames with the same origin.', () => {
			const browser = new Browser();
			const page = browser.newPage();
			page.mainFrame.url = 'https://example.com/a';
			const frame = BrowserFrameFactory.createChildFrame(page.mainFrame);
			frame.url = 'https://example.com/b';

			expect(BrowserFrameURL.isSameOrigin(page.mainFrame, frame)).toBe(true);

			browser.close();
		});

		it('Returns false for frames with different origins.', () => {
			const browser = new Browser();
			const page = browser.newPage();
			page.mainFrame.url = 'https://example.com/';
			const frame = BrowserFrameFactory.createChildFrame(page.mainFrame);
			frame.url = 'https://other.example/';

			expect(BrowserFrameURL.isSameOrigin(page.mainFrame, frame)).toBe(false);

			browser.close();
		});

		it("Returns true for an 'about:blank' document with the same origin as its parent.", async () => {
			vi.spyOn(Fetch.prototype, 'send').mockImplementation(() =>
				Promise.resolve(new page.mainFrame.window.Response('<body>Child</body>'))
			);

			const browser = new Browser();
			const page = browser.newPage();
			page.mainFrame.url = 'https://parent.example/';
			const frame = BrowserFrameFactory.createChildFrame(page.mainFrame);
			frame.url = 'about:blank';

			// Inherits origin from parent frame
			expect(BrowserFrameURL.isSameOrigin(frame, page.mainFrame)).toBe(true);

			await frame.goto('https://child.example/');

			expect(BrowserFrameURL.isSameOrigin(frame, page.mainFrame)).toBe(false);

			browser.close();
		});

		it("Returns true for an 'about:blank' document with the same origin as its opener.", async () => {
			vi.spyOn(Fetch.prototype, 'send').mockImplementation(() =>
				Promise.resolve(new page.mainFrame.window.Response('<body>Child</body>'))
			);

			const browser = new Browser();
			const page = browser.newPage();
			page.mainFrame.url = 'https://parent.example/';

			const popupPage = browser.newPage();
			const popupFrame = popupPage.mainFrame;

			popupFrame[PropertySymbol.opener] = { frame: page.mainFrame, window: page.mainFrame.window };

			page.mainFrame[PropertySymbol.openedPages].push(popupPage);

			popupFrame.url = 'about:blank';

			// Inherits origin from opener frame
			expect(BrowserFrameURL.isSameOrigin(popupFrame, page.mainFrame)).toBe(true);

			await popupFrame.goto('https://child.example/');

			expect(BrowserFrameURL.isSameOrigin(popupFrame, page.mainFrame)).toBe(false);

			browser.close();
		});

		it('Treats two "data:" documents as different origins.', async () => {
			const browser = new Browser();
			const page = browser.newPage();
			page.mainFrame.url = 'https://parent.example/';
			const frame1 = BrowserFrameFactory.createChildFrame(page.mainFrame);
			const frame2 = BrowserFrameFactory.createChildFrame(page.mainFrame);
			vi.spyOn(Fetch.prototype, 'send').mockImplementation(() =>
				Promise.resolve(new page.mainFrame.window.Response('<body>Child</body>'))
			);

			await Promise.all([
				frame1.goto('data:text/html,<body>1</body>', { referrer: 'https://parent.example' }),
				frame2.goto('data:text/html,<body>2</body>', { referrer: 'https://parent.example' })
			]);

			expect(BrowserFrameURL.isSameOrigin(frame1, frame2)).toBe(false);
			expect(BrowserFrameURL.isSameOrigin(frame1, frame1)).toBe(true);

			await browser.close();
		});
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

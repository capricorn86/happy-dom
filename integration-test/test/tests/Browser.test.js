import { describe, it, expect } from '../utilities/TestFunctions.js';
import { Browser, BrowserErrorCaptureEnum } from 'happy-dom';

describe('Browser', () => {
	it('Goes to a "github.com".', async () => {
		const browser = new Browser({
			settings: {
				errorCapture: BrowserErrorCaptureEnum.processLevel,

				// Github.com has a timer that is very long (hours) and a timer loop that never ends.
				timer: {
					maxTimeout: 1000,
					maxInterval: 100,
					maxIntervalIterations: 1,
					preventTimerLoops: true
				}
			}
		});

		const page = browser.newPage();

		await page.goto('https://github.com/capricorn86');

		const link = page.mainFrame.document.querySelector('a[href="/capricorn86/happy-dom"]');

		// Github is the https://github.com/hydrostack/hydro/, which will load the page using fetch()
		// The links behaviour is disabled by using event.preventDefault() in the click event.
		link.click();

		// We need to wait for Hydro to load the page.
		await page.waitUntilComplete();

		expect(page.mainFrame.url).toBe('https://github.com/capricorn86/happy-dom');
		expect(page.mainFrame.document.title.startsWith('GitHub - capricorn86/happy-dom')).toBe(true);
		expect(
			page.mainFrame.document.querySelector('a[href="/capricorn86/happy-dom"]').textContent.trim()
		).toBe('happy-dom');

		await browser.close();
	});

	it('Goes to "npmjs.com".', async () => {
		const browser = new Browser({
			settings: {
				errorCapture: BrowserErrorCaptureEnum.processLevel
			}
		});
		const page = browser.newPage();

		await page.goto('https://www.npmjs.com/package/happy-dom');

		const link = page.mainFrame.document.querySelector(
			'a[href="https://github.com/capricorn86/happy-dom/wiki/"]'
		);

		link.click();

		await page.waitForNavigation();

		expect(page.mainFrame.url).toBe('https://github.com/capricorn86/happy-dom/wiki/');
		expect(page.mainFrame.document.title).toBe('Home · capricorn86/happy-dom Wiki · GitHub');

		await browser.close();
	});
});

import { describe, it, expect } from '../utilities/TestFunctions.js';
import { Browser, BrowserErrorCaptureEnum } from 'happy-dom';

describe('Browser', () => {
	it('Goes to a real page.', async () => {
		const browser = new Browser({
			settings: { errorCapture: BrowserErrorCaptureEnum.processLevel }
		});
		const page = browser.newPage();

		await page.goto('https://github.com/capricorn86');

		const link = page.mainFrame.document.querySelector('a[href="/capricorn86/happy-dom"]');

		debugger;
		link.click();

		await new Promise((resolve) => setTimeout(resolve, 500));

		await page.waitUntilComplete();

		debugger;

		expect(page.mainFrame.url).toBe('https://github.com/capricorn86/happy-dom');
		expect(page.mainFrame.document.title.startsWith('GitHub - capricorn86/happy-dom')).toBe(true);
		expect(
			page.mainFrame.document.querySelector('a[href="/capricorn86/happy-dom"]').textContent.trim()
		).toBe('happy-dom');

		await browser.close();
	});
});

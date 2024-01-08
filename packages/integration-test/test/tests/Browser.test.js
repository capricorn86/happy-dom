import { describe, it, expect } from '../utilities/TestFunctions.js';
import { Browser, BrowserErrorCapturingEnum } from 'happy-dom';

describe('Browser', () => {
	it('Goes to a real page.', async () => {
		const browser = new Browser({
			settings: { errorCapturing: BrowserErrorCapturingEnum.processLevel }
		});
		const page = browser.newPage();

		await page.goto('https://github.com/capricorn86');
		await page.whenComplete();

		page.mainFrame.document.querySelector('a[href="/capricorn86/happy-dom"]').click();
		await page.whenComplete();

		expect(page.mainFrame.url).toBe('https://github.com/capricorn86/happy-dom');
		expect(
			page.mainFrame.document.title.startsWith('GitHub - capricorn86/happy-dom: Happy DOM')
		).toBe(true);
		expect(
			page.mainFrame.document.querySelector('a[href="/capricorn86/happy-dom"]').textContent.trim()
		).toBe('happy-dom');

		await browser.close();
	});
});

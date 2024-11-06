import DOMException from '../../src/exception/DOMException.js';
import DOMExceptionNameEnum from '../../src/exception/DOMExceptionNameEnum.js';
import CSSStyleSheet from '../../src/css/CSSStyleSheet.js';
import { beforeEach, describe, it, expect } from 'vitest';
import BrowserWindow from '../../src/window/BrowserWindow.js';
import Window from '../../src/window/Window.js';

describe('CSSStyleSheet', () => {
	let window: BrowserWindow;
	let cssStyleSheet: CSSStyleSheet;

	beforeEach(() => {
		window = new Window();
		cssStyleSheet = new window.CSSStyleSheet();
	});

	describe('insertRule()', () => {
		it('Inserts a rule at an index.', () => {
			cssStyleSheet.insertRule('div { background-color: green }');
			cssStyleSheet.insertRule('span { background-color: green }');
			expect(cssStyleSheet.insertRule('button { background-color: green }', 1)).toBe(1);
			expect(cssStyleSheet.cssRules[0].cssText).toBe('div { background-color: green; }');
			expect(cssStyleSheet.cssRules[1].cssText).toBe('button { background-color: green; }');
			expect(cssStyleSheet.cssRules[2].cssText).toBe('span { background-color: green; }');
		});

		it('Inserts a rule.', () => {
			cssStyleSheet.insertRule('div { background-color: green }');
			expect(cssStyleSheet.insertRule('span { background-color: green }')).toBe(1);
		});

		it('Throws error when a rule with invalid CSS is inserted.', () => {
			expect(() => {
				cssStyleSheet.insertRule('background-color: green');
			}).toThrowError(
				new DOMException('Invalid CSS rule.', DOMExceptionNameEnum.hierarchyRequestError)
			);
		});

		it('Throws error when attempting to add more than one rule.', () => {
			expect(() => {
				cssStyleSheet.insertRule(
					'div { background-color: green } span { background-color: green }'
				);
			}).toThrowError(
				new DOMException('Only one rule is allowed to be added.', DOMExceptionNameEnum.syntaxError)
			);
		});

		it('Throws error if index is more than the length of the CSS rule list.', () => {
			cssStyleSheet.insertRule('div { background-color: green }');

			expect(() => {
				cssStyleSheet.insertRule('button { background-color: green }', 2);
			}).toThrowError(
				new DOMException(
					'Index is more than the length of CSSRuleList.',
					DOMExceptionNameEnum.indexSizeError
				)
			);
		});
	});
});

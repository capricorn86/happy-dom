import CSSStyleSheet from '../../src/css/CSSStyleSheet';

describe('CSSStyleSheet', () => {
	let cssStyleSheet: CSSStyleSheet = null;

	beforeEach(() => {
		cssStyleSheet = new CSSStyleSheet();
	});

	describe('insertRule()', () => {
		it('Inserts a rule at an index.', () => {
			cssStyleSheet.insertRule('div { background-color: green }');
			cssStyleSheet.insertRule('span { background-color: green }');
			expect(cssStyleSheet.insertRule('button { background-color: green }', 1)).toBe(1);
		});

		it('Inserts a rule.', () => {
			cssStyleSheet.insertRule('div { background-color: green }');
			expect(cssStyleSheet.insertRule('span { background-color: green }')).toBe(1);
		});
	});
});

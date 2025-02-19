import CSSStyleSheet from '../../src/css/CSSStyleSheet.js';
import CSSParser from '../../src/css/utilities/CSSParser.js';
import CSSStyleRule from '../../src/css/rules/CSSStyleRule.js';
import CSSMediaRule from '../../src/css/rules/CSSMediaRule.js';
import CSSParserInput from './data/CSSParserInput.js';
import CSSKeyframeRule from '../../src/css/rules/CSSKeyframeRule.js';
import CSSKeyframesRule from '../../src/css/rules/CSSKeyframesRule.js';
import CSSContainerRule from '../../src/css/rules/CSSContainerRule.js';
import CSSSupportsRule from '../../src/css/rules/CSSSupportsRule.js';
import { describe, it, expect } from 'vitest';

describe('CSSParser', () => {
	describe('parseFromString()', () => {
		it('Parses CSS into an Array of CSSRule.', () => {
			const cssStyleSheet = new CSSStyleSheet();
			const cssRules = CSSParser.parseFromString(cssStyleSheet, CSSParserInput);

			expect(cssRules.length).toBe(11);

			// CSSStyleRule
			expect((<CSSStyleRule>cssRules[0]).parentRule).toBe(null);
			expect((<CSSStyleRule>cssRules[0]).parentStyleSheet).toBe(cssStyleSheet);
			expect((<CSSStyleRule>cssRules[0]).selectorText).toBe(':host');
			expect((<CSSStyleRule>cssRules[0]).cssText).toBe(
				':host { display: flex; overflow: hidden; width: 100%; }'
			);
			expect((<CSSStyleRule>cssRules[0]).style.parentRule).toBe(cssRules[0]);
			expect((<CSSStyleRule>cssRules[0]).style.length).toBe(3);
			expect((<CSSStyleRule>cssRules[0]).style[0]).toBe('display');
			expect((<CSSStyleRule>cssRules[0]).style[1]).toBe('overflow');
			expect((<CSSStyleRule>cssRules[0]).style[2]).toBe('width');
			expect((<CSSStyleRule>cssRules[0]).style.display).toBe('flex');
			expect((<CSSStyleRule>cssRules[0]).style.overflow).toBe('hidden');
			expect((<CSSStyleRule>cssRules[0]).style.width).toBe('100%');
			expect((<CSSStyleRule>cssRules[0]).style.cssText).toBe(
				'display: flex; overflow: hidden; width: 100%;'
			);

			// CSSStyleRule
			expect((<CSSStyleRule>cssRules[1]).parentRule).toBe(null);
			expect((<CSSStyleRule>cssRules[1]).parentStyleSheet).toBe(cssStyleSheet);
			expect((<CSSStyleRule>cssRules[1]).selectorText).toBe('.container');
			expect((<CSSStyleRule>cssRules[1]).cssText).toBe(
				'.container { flex-grow: 1; display: flex; flex-direction: column; overflow: hidden; --css-variable: 1px; background-image: url("data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mNk+A8AAQUBAScY42YAAAAASUVORK5CYII="), url("test.jpg"); }'
			);
			expect((<CSSStyleRule>cssRules[1]).style.length).toBe(6);
			expect((<CSSStyleRule>cssRules[1]).style.parentRule).toBe(cssRules[1]);
			expect((<CSSStyleRule>cssRules[1]).style[0]).toBe('flex-grow');
			expect((<CSSStyleRule>cssRules[1]).style[1]).toBe('display');
			expect((<CSSStyleRule>cssRules[1]).style[2]).toBe('flex-direction');
			expect((<CSSStyleRule>cssRules[1]).style[3]).toBe('overflow');
			expect((<CSSStyleRule>cssRules[1]).style[4]).toBe('--css-variable');
			expect((<CSSStyleRule>cssRules[1]).style[5]).toBe('background-image');
			expect((<CSSStyleRule>cssRules[1]).style.flexGrow).toBe('1');
			expect((<CSSStyleRule>cssRules[1]).style.display).toBe('flex');
			expect((<CSSStyleRule>cssRules[1]).style.flexDirection).toBe('column');
			expect((<CSSStyleRule>cssRules[1]).style.overflow).toBe('hidden');
			expect((<CSSStyleRule>cssRules[1]).style.getPropertyValue('--css-variable')).toBe('1px');
			expect((<CSSStyleRule>cssRules[1]).style.backgroundImage).toBe(
				'url("data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mNk+A8AAQUBAScY42YAAAAASUVORK5CYII="), url("test.jpg")'
			);
			expect((<CSSStyleRule>cssRules[1]).style.cssText).toBe(
				'flex-grow: 1; display: flex; flex-direction: column; overflow: hidden; --css-variable: 1px; background-image: url("data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mNk+A8AAQUBAScY42YAAAAASUVORK5CYII="), url("test.jpg");'
			);

			// CSSMediaRule
			expect((<CSSMediaRule>cssRules[2]).parentRule).toBe(null);
			expect((<CSSMediaRule>cssRules[2]).parentStyleSheet).toBe(cssStyleSheet);
			expect((<CSSMediaRule>cssRules[2]).media.length).toBe(1);
			expect((<CSSMediaRule>cssRules[2]).media[0]).toBe('screen and (max-width: 36rem)');
			expect((<CSSMediaRule>cssRules[2]).media.mediaText).toBe('screen and (max-width: 36rem)');
			expect((<CSSMediaRule>cssRules[2]).cssText).toBe(
				'@media screen and (max-width: 36rem) { .container { height: 0.5rem; animation: keyframes2 2s linear infinite; } }'
			);
			expect((<CSSMediaRule>cssRules[2]).cssRules.length).toBe(1);
			const children1 = <CSSStyleRule[]>(<CSSMediaRule>cssRules[2]).cssRules;
			expect(children1[0].parentRule).toBe(cssRules[2]);
			expect(children1[0].parentStyleSheet).toBe(cssStyleSheet);
			expect(children1[0].selectorText).toBe('.container');
			expect(children1[0].style.length).toBe(2);
			expect(children1[0].style.parentRule).toBe(children1[0]);
			expect(children1[0].style[0]).toBe('height');
			expect(children1[0].style[1]).toBe('animation');
			expect(children1[0].style.height).toBe('0.5rem');
			expect(children1[0].style.animation).toBe('keyframes2 2s linear infinite');
			expect(children1[0].cssText).toBe(
				'.container { height: 0.5rem; animation: keyframes2 2s linear infinite; }'
			);

			// CSSKeyframesRule
			expect((<CSSKeyframesRule>cssRules[3]).parentRule).toBe(null);
			expect((<CSSKeyframesRule>cssRules[3]).parentStyleSheet).toBe(cssStyleSheet);
			expect((<CSSKeyframesRule>cssRules[3]).name).toBe('keyframes1');
			expect((<CSSKeyframesRule>cssRules[3]).cssText).toBe(
				'@keyframes keyframes1 { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }'
			);
			expect((<CSSMediaRule>cssRules[3]).cssRules.length).toBe(2);
			const children2 = <CSSKeyframeRule[]>(<CSSKeyframesRule>cssRules[3]).cssRules;
			expect(children2[0].parentRule).toBe(cssRules[3]);
			expect(children2[0].parentStyleSheet).toBe(cssStyleSheet);
			expect(children2[0].keyText).toBe('from');
			expect(children2[0].style.length).toBe(1);
			expect(children2[0].style.parentRule).toBe(children2[0]);
			expect(children2[0].style[0]).toBe('transform');
			expect(children2[0].style.transform).toBe('rotate(0deg)');
			expect(children2[0].cssText).toBe('from { transform: rotate(0deg); }');
			expect(children2[1].parentRule).toBe(cssRules[3]);
			expect(children2[1].parentStyleSheet).toBe(cssStyleSheet);
			expect(children2[1].keyText).toBe('to');
			expect(children2[1].style.length).toBe(1);
			expect(children2[1].style[0]).toBe('transform');
			expect(children2[1].style.transform).toBe('rotate(360deg)');
			expect(children2[1].cssText).toBe('to { transform: rotate(360deg); }');

			// CSSKeyframesRule
			expect((<CSSKeyframesRule>cssRules[4]).parentRule).toBe(null);
			expect((<CSSKeyframesRule>cssRules[4]).parentStyleSheet).toBe(cssStyleSheet);
			expect((<CSSKeyframesRule>cssRules[4]).name).toBe('keyframes2');
			expect((<CSSKeyframesRule>cssRules[4]).cssText).toBe(
				'@keyframes keyframes2 { 0% { transform: rotate(0deg); } 100% { transform: rotate(360deg); } }'
			);
			expect((<CSSMediaRule>cssRules[4]).cssRules.length).toBe(2);
			const children3 = <CSSKeyframeRule[]>(<CSSKeyframesRule>cssRules[4]).cssRules;
			expect(children3[0].parentRule).toBe(cssRules[4]);
			expect(children3[0].parentStyleSheet).toBe(cssStyleSheet);
			expect(children3[0].keyText).toBe('0%');
			expect(children3[0].style.length).toBe(1);
			expect(children3[0].style.parentRule).toBe(children3[0]);
			expect(children3[0].style[0]).toBe('transform');
			expect(children3[0].style.transform).toBe('rotate(0deg)');
			expect(children3[0].cssText).toBe('0% { transform: rotate(0deg); }');
			expect(children3[1].parentRule).toBe(cssRules[4]);
			expect(children3[1].parentStyleSheet).toBe(cssStyleSheet);
			expect(children3[1].keyText).toBe('100%');
			expect(children3[1].style.length).toBe(1);
			expect(children3[1].style[0]).toBe('transform');
			expect(children3[1].style.transform).toBe('rotate(360deg)');
			expect(children3[1].cssText).toBe('100% { transform: rotate(360deg); }');

			// CSSContainerRule 1
			expect((<CSSContainerRule>cssRules[5]).parentRule).toBe(null);
			expect((<CSSContainerRule>cssRules[5]).parentStyleSheet).toBe(cssStyleSheet);
			expect((<CSSContainerRule>cssRules[5]).conditionText).toBe('(min-width: 36rem)');
			expect((<CSSContainerRule>cssRules[5]).cssText).toBe(
				'@container (min-width: 36rem) { .container { color: red; } }'
			);
			expect((<CSSMediaRule>cssRules[5]).cssRules.length).toBe(1);
			const children4 = <CSSStyleRule[]>(<CSSContainerRule>cssRules[5]).cssRules;
			expect(children4[0].parentRule).toBe(cssRules[5]);
			expect(children4[0].parentStyleSheet).toBe(cssStyleSheet);
			expect(children4[0].selectorText).toBe('.container');
			expect(children4[0].style.length).toBe(1);
			expect(children4[0].style.parentRule).toBe(children4[0]);
			expect(children4[0].style[0]).toBe('color');
			expect(children4[0].style.color).toBe('red');
			expect(children4[0].cssText).toBe('.container { color: red; }');

			// CSSContainerRule 2
			expect((<CSSContainerRule>cssRules[6]).parentRule).toBe(null);
			expect((<CSSContainerRule>cssRules[6]).parentStyleSheet).toBe(cssStyleSheet);
			expect((<CSSContainerRule>cssRules[6]).conditionText).toBe(
				'containerName (min-width: 36rem)'
			);
			expect((<CSSContainerRule>cssRules[6]).cssText).toBe(
				'@container containerName (min-width: 36rem) { .container { color: red; } }'
			);
			expect((<CSSMediaRule>cssRules[6]).cssRules.length).toBe(1);
			const children5 = <CSSStyleRule[]>(<CSSContainerRule>cssRules[6]).cssRules;
			expect(children5[0].parentRule).toBe(cssRules[6]);
			expect(children5[0].parentStyleSheet).toBe(cssStyleSheet);
			expect(children5[0].selectorText).toBe('.container');
			expect(children5[0].style.length).toBe(1);
			expect(children5[0].style.parentRule).toBe(children5[0]);
			expect(children5[0].style[0]).toBe('color');
			expect(children5[0].style.color).toBe('red');
			expect(children5[0].cssText).toBe('.container { color: red; }');

			// CSSSupportsRule
			expect((<CSSSupportsRule>cssRules[7]).parentRule).toBe(null);
			expect((<CSSSupportsRule>cssRules[7]).parentStyleSheet).toBe(cssStyleSheet);
			expect((<CSSSupportsRule>cssRules[7]).conditionText).toBe('(display: flex)');
			expect((<CSSSupportsRule>cssRules[7]).cssText).toBe(
				'@supports (display: flex) { .container { color: green; } }'
			);
			expect((<CSSSupportsRule>cssRules[7]).cssRules.length).toBe(1);
			const children6 = <CSSStyleRule[]>(<CSSSupportsRule>cssRules[7]).cssRules;
			expect(children6[0].parentRule).toBe(cssRules[7]);
			expect(children6[0].parentStyleSheet).toBe(cssStyleSheet);
			expect(children6[0].selectorText).toBe('.container');
			expect(children6[0].style.length).toBe(1);
			expect(children6[0].style.parentRule).toBe(children6[0]);
			expect(children6[0].style[0]).toBe('color');
			expect(children6[0].style.color).toBe('green');
			expect(children6[0].cssText).toBe('.container { color: green; }');

			expect((<CSSStyleRule>cssRules[8]).parentRule).toBe(null);
			expect((<CSSStyleRule>cssRules[8]).parentStyleSheet).toBe(cssStyleSheet);
			expect((<CSSStyleRule>cssRules[8]).selectorText).toBe(':root');
			expect((<CSSStyleRule>cssRules[8]).cssText).toBe(':root { --my-var: 10px; }');
			expect((<CSSStyleRule>cssRules[8]).style.parentRule).toBe(cssRules[8]);
			expect((<CSSStyleRule>cssRules[8]).style.length).toBe(1);
			expect((<CSSStyleRule>cssRules[8]).style.cssText).toBe('--my-var: 10px;');

			expect((<CSSStyleRule>cssRules[9]).parentRule).toBe(null);
			expect((<CSSStyleRule>cssRules[9]).parentStyleSheet).toBe(cssStyleSheet);
			expect((<CSSStyleRule>cssRules[9]).selectorText).toBe('.foo');
			expect((<CSSStyleRule>cssRules[9]).cssText).toBe('.foo { color: red; }');
			expect((<CSSStyleRule>cssRules[9]).style.parentRule).toBe(cssRules[9]);
			expect((<CSSStyleRule>cssRules[9]).style.length).toBe(1);
			expect((<CSSStyleRule>cssRules[9]).style.cssText).toBe('color: red;');

			expect((<CSSStyleRule>cssRules[10]).parentRule).toBe(null);
			expect((<CSSStyleRule>cssRules[10]).parentStyleSheet).toBe(cssStyleSheet);
			expect((<CSSStyleRule>cssRules[10]).selectorText).toBe('.validAsThereIsNoSemicolon');
			expect((<CSSStyleRule>cssRules[10]).cssText).toBe(
				'.validAsThereIsNoSemicolon { color: pink; }'
			);
			expect((<CSSStyleRule>cssRules[10]).style.parentRule).toBe(cssRules[10]);
			expect((<CSSStyleRule>cssRules[10]).style.length).toBe(1);
			expect((<CSSStyleRule>cssRules[10]).style.cssText).toBe('color: pink;');
		});

		it('Supports @font-face.', () => {
			const css = `
                @font-face {
                    font-family: "Ionicons";
                    src: url("~react-native-vector-icons/Fonts/Ionicons.ttf");
                }
            `;
			const cssStyleSheet = new CSSStyleSheet();
			const cssRules = CSSParser.parseFromString(cssStyleSheet, css);

			expect(cssRules.length).toBe(1);
			expect((<CSSStyleRule>cssRules[0]).cssText).toBe(
				'@font-face { font-family: Ionicons; src: url("~react-native-vector-icons/Fonts/Ionicons.ttf"); }'
			);
			expect((<CSSStyleRule>cssRules[0]).style.fontFamily).toBe('Ionicons');
			expect((<CSSStyleRule>cssRules[0]).style.src).toBe(
				'url("~react-native-vector-icons/Fonts/Ionicons.ttf")'
			);
		});

		it('Supports @media (forced-colors: active).', () => {
			const css = `
                @media (forced-colors: active) {
                    .foo { color: red; }
                }
            `;

			const cssStyleSheet = new CSSStyleSheet();
			const cssRules = CSSParser.parseFromString(cssStyleSheet, css);

			expect(cssRules.length).toBe(1);
			expect((<CSSMediaRule>cssRules[0]).media.length).toBe(1);
			expect((<CSSMediaRule>cssRules[0]).media[0]).toBe('(forced-colors: active)');
			expect((<CSSMediaRule>cssRules[0]).media.mediaText).toBe('(forced-colors: active)');
			expect((<CSSStyleRule>(<CSSMediaRule>cssRules[0]).cssRules[0]).selectorText).toBe('.foo');
			expect((<CSSStyleRule>(<CSSMediaRule>cssRules[0]).cssRules[0]).style.color).toBe('red');
			expect((<CSSMediaRule>cssRules[0]).cssText).toBe(
				'@media (forced-colors: active) { .foo { color: red; } }'
			);
		});

		it('Supports @media rule inside a @media rule', () => {
			const css =
				'@media (forced-colors: active) { @media screen and (max-width: 36rem) { .foo { height: 0.5rem; } } }';

			const cssStyleSheet = new CSSStyleSheet();
			const cssRules = CSSParser.parseFromString(cssStyleSheet, css);

			expect(cssRules.length).toBe(1);
			expect((<CSSMediaRule>cssRules[0]).cssText).toBe(
				'@media (forced-colors: active) { @media screen and (max-width: 36rem) { .foo { height: 0.5rem; } } }'
			);
		});

		it('Supports @media rule inside a @container rule', () => {
			const css =
				'@container (min-width: 36rem) { @media screen and (max-width: 36rem) { .foo { height: 0.5rem; } } }';
			const cssStyleSheet = new CSSStyleSheet();
			const cssRules = CSSParser.parseFromString(cssStyleSheet, css);

			expect(cssRules.length).toBe(1);
			expect((<CSSContainerRule>cssRules[0]).cssText).toBe(
				'@container (min-width: 36rem) { @media screen and (max-width: 36rem) { .foo { height: 0.5rem; } } }'
			);
		});

		it('Supports @media rule inside a @supports rule', () => {
			const css =
				'@supports (display: flex) { @media screen and (max-width: 36rem) { .foo { height: 0.5rem; } } }';
			const cssStyleSheet = new CSSStyleSheet();
			const cssRules = CSSParser.parseFromString(cssStyleSheet, css);

			expect(cssRules.length).toBe(1);
			expect((<CSSSupportsRule>cssRules[0]).cssText).toBe(
				'@supports (display: flex) { @media screen and (max-width: 36rem) { .foo { height: 0.5rem; } } }'
			);
		});

		it('Ignores @media rule inside a @keyframes rule', () => {
			const css =
				'@keyframes keyframes1 { @media screen and (max-width: 36rem) { .foo { height: 0.5rem; } } }';
			const cssStyleSheet = new CSSStyleSheet();
			const cssRules = CSSParser.parseFromString(cssStyleSheet, css);

			expect(cssRules.length).toBe(1);
			expect((<CSSKeyframesRule>cssRules[0]).cssText).toBe('@keyframes keyframes1 { }');
		});

		it('Supports @container rule inside a @container rule', () => {
			const css =
				'@container containerName (min-width: 36rem) { @container containerName (min-width: 36rem) { .foo { height: 0.5rem; } } }';
			const cssStyleSheet = new CSSStyleSheet();
			const cssRules = CSSParser.parseFromString(cssStyleSheet, css);

			expect(cssRules.length).toBe(1);
			expect((<CSSContainerRule>cssRules[0]).cssText).toBe(
				'@container containerName (min-width: 36rem) { @container containerName (min-width: 36rem) { .foo { height: 0.5rem; } } }'
			);
		});

		it('Supports @container rule inside a @supports rule', () => {
			const css =
				'@supports (display: flex) { @container (min-width: 36rem) { .foo { height: 0.5rem; } } }';
			const cssStyleSheet = new CSSStyleSheet();
			const cssRules = CSSParser.parseFromString(cssStyleSheet, css);

			expect(cssRules.length).toBe(1);
			expect((<CSSSupportsRule>cssRules[0]).cssText).toBe(
				'@supports (display: flex) { @container (min-width: 36rem) { .foo { height: 0.5rem; } } }'
			);
		});

		it('Supports @container rule inside a @media rule', () => {
			const css =
				'@media screen and (max-width: 36rem) { @container (min-width: 36rem) { .foo { height: 0.5rem; } } }';
			const cssStyleSheet = new CSSStyleSheet();
			const cssRules = CSSParser.parseFromString(cssStyleSheet, css);

			expect(cssRules.length).toBe(1);
			expect((<CSSMediaRule>cssRules[0]).cssText).toBe(
				'@media screen and (max-width: 36rem) { @container (min-width: 36rem) { .foo { height: 0.5rem; } } }'
			);
		});

		it('Ignores @container rule inside a @keyframes rule', () => {
			const css =
				'@keyframes keyframes1 { @container (min-width: 36rem) { .foo { height: 0.5rem; } } }';
			const cssStyleSheet = new CSSStyleSheet();
			const cssRules = CSSParser.parseFromString(cssStyleSheet, css);

			expect(cssRules.length).toBe(1);
			expect((<CSSKeyframesRule>cssRules[0]).cssText).toBe('@keyframes keyframes1 { }');
		});

		it('Supports @supports rule inside a @supports rule', () => {
			const css =
				'@supports (display: flex) { @supports (display: grid) { .foo { height: 0.5rem; } } }';
			const cssStyleSheet = new CSSStyleSheet();
			const cssRules = CSSParser.parseFromString(cssStyleSheet, css);

			expect(cssRules.length).toBe(1);
			expect((<CSSSupportsRule>cssRules[0]).cssText).toBe(
				'@supports (display: flex) { @supports (display: grid) { .foo { height: 0.5rem; } } }'
			);
		});

		it('Supports @supports rule inside a @media rule', () => {
			const css =
				'@media screen and (max-width: 36rem) { @supports (display: grid) { .foo { height: 0.5rem; } } }';
			const cssStyleSheet = new CSSStyleSheet();
			const cssRules = CSSParser.parseFromString(cssStyleSheet, css);

			expect(cssRules.length).toBe(1);
			expect((<CSSMediaRule>cssRules[0]).cssText).toBe(
				'@media screen and (max-width: 36rem) { @supports (display: grid) { .foo { height: 0.5rem; } } }'
			);
		});

		it('Supports @supports rule inside a @container rule', () => {
			const css =
				'@container (min-width: 36rem) { @supports (display: grid) { .foo { height: 0.5rem; } } }';
			const cssStyleSheet = new CSSStyleSheet();
			const cssRules = CSSParser.parseFromString(cssStyleSheet, css);

			expect(cssRules.length).toBe(1);
			expect((<CSSContainerRule>cssRules[0]).cssText).toBe(
				'@container (min-width: 36rem) { @supports (display: grid) { .foo { height: 0.5rem; } } }'
			);
		});

		it('Ignores @supports rule inside a @keyframes rule', () => {
			const css =
				'@keyframes keyframes1 { @supports (display: grid) { .foo { height: 0.5rem; } } }';
			const cssStyleSheet = new CSSStyleSheet();
			const cssRules = CSSParser.parseFromString(cssStyleSheet, css);

			expect(cssRules.length).toBe(1);
			expect((<CSSKeyframesRule>cssRules[0]).cssText).toBe('@keyframes keyframes1 { }');
		});

		it('Supports @keyframes rule inside a @supports rule', () => {
			const css =
				'@supports (display: flex) { @keyframes keyframes1 { from { transform: rotate(0deg); } to { transform: rotate(360deg); } } }';
			const cssStyleSheet = new CSSStyleSheet();
			const cssRules = CSSParser.parseFromString(cssStyleSheet, css);

			expect(cssRules.length).toBe(1);
			expect((<CSSSupportsRule>cssRules[0]).cssText).toBe(
				'@supports (display: flex) { @keyframes keyframes1 { from { transform: rotate(0deg); } to { transform: rotate(360deg); } } }'
			);
		});

		it('Supports @keyframes rule inside a @media rule', () => {
			const css =
				'@media screen and (max-width: 36rem) { @keyframes keyframes1 { from { transform: rotate(0deg); } to { transform: rotate(360deg); } } }';
			const cssStyleSheet = new CSSStyleSheet();
			const cssRules = CSSParser.parseFromString(cssStyleSheet, css);

			expect(cssRules.length).toBe(1);
			expect((<CSSMediaRule>cssRules[0]).cssText).toBe(
				'@media screen and (max-width: 36rem) { @keyframes keyframes1 { from { transform: rotate(0deg); } to { transform: rotate(360deg); } } }'
			);
		});

		it('Supports @keyframes rule inside a @container rule', () => {
			const css =
				'@container (min-width: 36rem) { @keyframes keyframes1 { from { transform: rotate(0deg); } to { transform: rotate(360deg); } } }';
			const cssStyleSheet = new CSSStyleSheet();
			const cssRules = CSSParser.parseFromString(cssStyleSheet, css);

			expect(cssRules.length).toBe(1);
			expect((<CSSContainerRule>cssRules[0]).cssText).toBe(
				'@container (min-width: 36rem) { @keyframes keyframes1 { from { transform: rotate(0deg); } to { transform: rotate(360deg); } } }'
			);
		});

		it('Ignores @keyframes rule inside a @keyframes rule', () => {
			const css =
				'@keyframes keyframes1 { @keyframes keyframes2 { from { transform: rotate(0deg); } to { transform: rotate(360deg); } } }';
			const cssStyleSheet = new CSSStyleSheet();
			const cssRules = CSSParser.parseFromString(cssStyleSheet, css);

			expect(cssRules.length).toBe(1);
			expect((<CSSKeyframesRule>cssRules[0]).cssText).toBe('@keyframes keyframes1 { }');
		});
	});
});

import GlobalWindow from '../../src/window/GlobalWindow.js';
import * as PropertySymbol from '../../src/PropertySymbol.js';
import { beforeEach, describe, it, expect } from 'vitest';

describe('GlobalWindow', () => {
	let window: GlobalWindow;

	beforeEach(() => {
		window = new GlobalWindow({
			settings: { enableJavaScriptEvaluation: true, suppressCodeGenerationFromStringsWarning: true }
		});
	});

	describe('get Object()', () => {
		it('Is the same as {}.constructor.', () => {
			expect({}.constructor).toBe(window.Object);
		});

		it('Is the same as {}.constructor when using eval().', () => {
			(<any>global)['globalWindow'] = window;
			expect(window.eval('({}).constructor === globalWindow.Object')).toBe(true);
			delete (<any>global)['globalWindow'];
		});
	});

	describe('get Function()', () => {
		it('Is the same as (() => {}).constructor.', () => {
			expect((() => {}).constructor).toBe(window.Function);
		});

		it('Is the same as (() => {}).constructor when using eval().', () => {
			expect(window.Function('return (() => {}).constructor === globalThis.Function')()).toBe(true);
		});

		it('Does not execute unsafe code using import', () => {
			expect(() => window.Function('return import("process")')()).rejects.toThrow();
		});
	});

	describe('get Array()', () => {
		it('Is the same as [].constructor.', () => {
			expect([].constructor).toBe(window.Array);
		});

		it('Is the same as [].constructor when using eval().', () => {
			(<any>global)['globalWindow'] = window;
			expect(window.eval('[].constructor === globalWindow.Array')).toBe(true);
			delete (<any>global)['globalWindow'];
		});
	});

	describe('eval()', () => {
		it('Respects direct eval.', () => {
			const result = window.eval(`
			globalThis.variable = 'globally defined';
			(function () {
				var variable = 'locally defined';
				return eval('variable');
			})()`);

			expect(result).toBe('locally defined');
			expect((<any>globalThis)['variable']).toBe('globally defined');

			delete (<any>globalThis)['variable'];
		});

		it('Respects indirect eval.', () => {
			const result = window.eval(`
			globalThis.variable = 'globally defined';
			(function () {
				var variable = 'locally defined';
				return (0,eval)('variable');
			})()`);

			expect(result).toBe('globally defined');
			expect((<any>globalThis)['variable']).toBe('globally defined');

			delete (<any>globalThis)['variable'];
		});
	});

	describe('[PropertySymbol.evaluateScript]()', () => {
		it('Evaluates script.', () => {
			const result = window[PropertySymbol.evaluateScript]('1 + 1;', {
				filename: 'filename.js'
			});
			expect(result).toBe(2);
		});

		it('Evaluates code from script elements', () => {
			const script = window.document.createElement('script');
			script.textContent = 'globalThis["$scriptResult"] = 1 + 1;';
			window.document.body.appendChild(script);
			expect((<any>globalThis)['$scriptResult']).toBe(2);
			delete (<any>globalThis)['$scriptResult'];
		});
	});

	describe('Object.getOwnPropertyNames()', () => {
		it('Returns property names for Vitest.', () => {
			const expected = [
				'location',
				'history',
				'navigator',
				'screen',
				'sessionStorage',
				'localStorage',
				'opener',
				'scrollX',
				'pageXOffset',
				'scrollY',
				'pageYOffset',
				'CSS',
				'innerWidth',
				'innerHeight',
				'outerWidth',
				'outerHeight',
				'devicePixelRatio'
			];
			const included: string[] = [];
			const propertyNames = Object.getOwnPropertyNames(window);
			for (const name of expected) {
				if (propertyNames.includes(name)) {
					included.push(name);
				}
			}

			expect(included).toEqual(expected);
		});
	});
});

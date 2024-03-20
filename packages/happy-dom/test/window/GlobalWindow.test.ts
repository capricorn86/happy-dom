import GlobalWindow from '../../src/window/GlobalWindow.js';
import Window from '../../src/window/Window.js';
import { beforeEach, describe, it, expect } from 'vitest';

describe('GlobalWindow', () => {
	let window: Window;

	beforeEach(() => {
		window = new GlobalWindow();
	});

	describe('get Object()', () => {
		it('Is the same as {}.constructor.', () => {
			expect({}.constructor).toBe(window.Object);
		});

		it('Is the same as {}.constructor when using eval().', () => {
			global['globalWindow'] = window;
			expect(window.eval('({}).constructor === globalWindow.Object')).toBe(true);
			delete global['globalWindow'];
		});
	});

	describe('get Function()', () => {
		it('Is the same as (() => {}).constructor.', () => {
			expect((() => {}).constructor).toBe(window.Function);
		});

		it('Is the same as (() => {}).constructor when using eval().', () => {
			global['globalWindow'] = window;
			expect(window.eval('(() => {}).constructor === globalWindow.Function')).toBe(true);
			delete global['globalWindow'];
		});
	});

	describe('get Array()', () => {
		it('Is the same as [].constructor.', () => {
			expect([].constructor).toBe(window.Array);
		});

		it('Is the same as [].constructor when using eval().', () => {
			global['globalWindow'] = window;
			expect(window.eval('[].constructor === globalWindow.Array')).toBe(true);
			delete global['globalWindow'];
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
			expect(globalThis['variable']).toBe('globally defined');

			delete globalThis['variable'];
		});

		it('Respects indirect eval.', () => {
			const result = window.eval(`
			globalThis.variable = 'globally defined';
			(function () {
				var variable = 'locally defined';
				return (0,eval)('variable');
			})()`);

			expect(result).toBe('globally defined');
			expect(globalThis['variable']).toBe('globally defined');

			delete globalThis['variable'];
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

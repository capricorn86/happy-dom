import GlobalWindow from '../../src/window/GlobalWindow.js';
import IWindow from '../../src/window/IWindow.js';
import { beforeEach, describe, it, expect } from 'vitest';

describe('GlobalWindow', () => {
	let window: IWindow;

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

	describe('eval', () => {
		it('Respects direct eval.', () => {
			global['globalWindow'] = window;
			const result = window.eval(`
			global.variable = 'globally defined';
			(function () {
				var variable = 'locally defined';
				return eval('variable');
			})()`);
			expect(result).toBe('locally defined');
			expect(global['variable']).toBe('globally defined');
			delete global['globalWindow'];
			delete global['variable'];
		});

		it('Respects indirect eval.', () => {
			global['globalWindow'] = window;
			const result = window.eval(`
			global.variable = 'globally defined';
			(function () {
				var variable = 'locally defined';
				return (0,eval)('variable');
			})()`);
			expect(result).toBe('globally defined');
			expect(global['variable']).toBe('globally defined');
			delete global['globalWindow'];
			delete global['variable'];
		});
	});
});

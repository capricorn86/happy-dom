import { beforeEach, describe, it, expect, vi } from 'vitest';
import JavaScriptCompiler from '../../src/javascript/JavaScriptCompiler.js';
import type BrowserWindow from '../../src/window/BrowserWindow.js';
import Window from '../../src/window/Window.js';
import BrowserErrorCaptureEnum from '../../src/browser/enums/BrowserErrorCaptureEnum.js';

describe('JavaScriptCompiler', () => {
	let window: BrowserWindow;

	beforeEach(() => {
		window = new Window({
			settings: {
				errorCapture: BrowserErrorCaptureEnum.disabled
			}
		});
	});

	describe('compile()', () => {
		it('Rewrites dynamic import() calls to $happy_dom.dynamicImport() and executes them.', () => {
			const code = `
                var promise1 = import('http://localhost:8080/js/utilities/some-module.js');
                var promise2 = import('http://localhost:8080/js/utilities/some-module-2.js');
            `;
			const dynamicImport = vi.fn().mockResolvedValue({});
			const compiler = new JavaScriptCompiler(window);
			const result = compiler.compile('http://localhost:8080/js/app/main.js', code);

			result.execute({ dynamicImport, dispatchError: vi.fn() });

			expect(dynamicImport).toHaveBeenCalledTimes(2);
			expect(dynamicImport).toHaveBeenNthCalledWith(
				1,
				'http://localhost:8080/js/utilities/some-module.js'
			);
			expect(dynamicImport).toHaveBeenNthCalledWith(
				2,
				'http://localhost:8080/js/utilities/some-module-2.js'
			);
		});

		it('Ignores import statements found inside strings, comments and regular expressions.', () => {
			const code = `
                var r = new RegExp(/^([1-9][0-9]*)(["â€³â€'â€²Â´]?)\s*([1-9][0-9]*\\/[1-9][0-9]*)["â€³â€]?$/);
                const hexLookUp=Array.from({length:127},(n,e)=>/[^!"$&'()*+,\-.;=_\`a-z{}~]/u.test(String.fromCharCode(e)))
                class R{constructor(){this.lastTime=Date.now(),this.lastValue=0,this.__speed=0}set value(e){this.__speed=(e-this.lastValue)/(Date.now()-this.lastTime),this.lastValue=e,this.lastTime=Date.now()}}
                const t="";const n=["@import",\`url(\${JSON.stringify(t.href)}) import('@package/debugger')\`];
                function log(){return console.log('To use the debugger you must import "@package/debugger"')}
                var i = "test";
                import("@package/debugger");
            `;
			const dynamicImport = vi.fn().mockResolvedValue({});
			const compiler = new JavaScriptCompiler(window);
			const result = compiler.compile('http://localhost:8080/js/app/main.js', code);

			result.execute({ dynamicImport, dispatchError: vi.fn() });

			expect(dynamicImport).toHaveBeenCalledTimes(1);
			expect(dynamicImport).toHaveBeenCalledWith('@package/debugger');
			expect((<any>window).i).toBe('test');
			expect(typeof (<any>window).log).toBe('function');
		});

		it('Makes top-level "var" and function declarations reach the global object, like a real browser.', () => {
			const code = `
                var exportedValue = 123;
                function exportedFunction() {
                    return 'called';
                }
            `;
			const compiler = new JavaScriptCompiler(window);
			const result = compiler.compile('http://localhost:8080/js/app/main.js', code);

			result.execute({ dynamicImport: vi.fn(), dispatchError: vi.fn() });

			expect((<any>window).exportedValue).toBe(123);
			expect((<any>window).exportedFunction()).toBe('called');
		});

		it('Dispatches runtime errors via $happy_dom.dispatchError() instead of throwing if settings.errorCapture is set to "tryAndCatch".', () => {
			const window = new Window();

			const code = `
                throw new Error('Test error');
            `;
			const compiler = new JavaScriptCompiler(window);
			const result = compiler.compile('http://localhost:8080/js/app/main.js', code);
			const dispatchError = vi.fn();

			expect(() => result.execute({ dynamicImport: vi.fn(), dispatchError })).not.toThrow();
			expect(dispatchError).toHaveBeenCalledTimes(1);
			expect((<Error>dispatchError.mock.calls[0][0]).message).toBe('Test error');
		});

		it('Throws await in top level error', () => {
			const code = `const StringUtility = await import('http://localhost:8080/js/utilities/StringUtility.js');`;
			const compiler = new JavaScriptCompiler(window);
			const result = compiler.compile('http://localhost:8080/js/app/main.js', code);

			expect(() => {
				result.execute({ dynamicImport: vi.fn(), dispatchError: vi.fn() });
			}).toThrow(
				`Failed to parse JavaScript in 'http://localhost:8080/js/app/main.js': await is only valid in async functions and the top level bodies of modules`
			);
		});
	});
});

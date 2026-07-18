import { beforeEach, describe, it, expect, vi } from 'vitest';
import JavaScriptCompiler from '../../src/javascript/JavaScriptCompiler.js';
import type BrowserWindow from '../../src/window/BrowserWindow.js';
import Window from '../../src/window/Window.js';
import BrowserErrorCaptureEnum from '../../src/browser/enums/BrowserErrorCaptureEnum.js';
import * as PropertySymbol from '../../src/PropertySymbol.js';

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
		it('Handles dynamic import of a basic module.', () => {
			const code = `
                const variable = 'hello';

                class TestClass {
                    constructor() {
                        console.log('Hello \\'World');
                    }

                    async greet() {
                        const someModule = await import('http://localhost:8080/js/utilities/some-module.js');
                        const someModule2 = await import('http://localhost:8080/js/utilities/some-module-2.js');
                        return someModule.getGreeting();
                    }
                }
            `;
			const compiler = new JavaScriptCompiler(window);
			const result = compiler.compile('http://localhost:8080/js/app/main.js', code);
			const evaluateScript = vi.spyOn(<any>window, PropertySymbol.evaluateScript);

			result.execute({ dispatchError: () => {}, dynamicImport: vi.fn() });

			expect(evaluateScript.mock.calls[0][0]).toBe(`
                const variable = 'hello';

                class TestClass {
                    constructor() {
                        console.log('Hello \\'World');
                    }

                    async greet() {
                        const someModule = await $happy_dom.dynamicImport('http://localhost:8080/js/utilities/some-module.js');
                        const someModule2 = await $happy_dom.dynamicImport('http://localhost:8080/js/utilities/some-module-2.js');
                        return someModule.getGreeting();
                    }
                }
            `);
		});

		it('Handles import statement in strings.', () => {
			const code = `
                var r = new RegExp(/^([1-9][0-9]*)(["â€³â€'â€²Ã´]?)\s*([1-9][0-9]*\\/[1-9][0-9]*)["â€³â€]?$/);
                const hexLookUp=Array.from({length:127},(n,e)=>/[^!"$&'()*+,\-.;=_\`a-z{}~]/u.test(String.fromCharCode(e)))
                class R{constructor(){this.lastTime=Date.now(),this.lastValue=0,this.__speed=0}set value(e){this.__speed=(e-this.lastValue)/(Date.now()-this.lastTime),this.lastValue=e,this.lastTime=Date.now()}}
                const n=["@import",\`url(\${JSON.stringify(t.href)}) import('@package/debugger')\`];const t="";
                function log(){return console.log('To use the debugger you must import "@package/debugger"')}
                var i = "test";
                import("@package/debugger");
            `;
			const compiler = new JavaScriptCompiler(window);
			const result = compiler.compile('http://localhost:8080/js/app/main.js', code);
			const evaluateScript = vi
				.spyOn(<any>window, PropertySymbol.evaluateScript)
				.mockImplementation(() => {});

			result.execute({ dispatchError: () => {}, dynamicImport: vi.fn() });

			expect(evaluateScript.mock.calls[0][0]).toBe(`
                var r = new RegExp(/^([1-9][0-9]*)(["â€³â€'â€²Ã´]?)\s*([1-9][0-9]*\\/[1-9][0-9]*)["â€³â€]?$/);
                const hexLookUp=Array.from({length:127},(n,e)=>/[^!"$&'()*+,-.;=_\`a-z{}~]/u.test(String.fromCharCode(e)))
                class R{constructor(){this.lastTime=Date.now(),this.lastValue=0,this.__speed=0}set value(e){this.__speed=(e-this.lastValue)/(Date.now()-this.lastTime),this.lastValue=e,this.lastTime=Date.now()}}
                const n=["@import",\`url(\${JSON.stringify(t.href)}) import('@package/debugger')\`];const t="";
                function log(){return console.log('To use the debugger you must import "@package/debugger"')}
                var i = "test";
                $happy_dom.dynamicImport("@package/debugger");
            `);
		});

		it('Adds try and catch statement if settings.errorCapture is set to "tryAndCatch".', () => {
			const window = new Window();

			const code = `throw new Error('Hello World');`;
			const compiler = new JavaScriptCompiler(window);
			const result = compiler.compile('http://localhost:8080/js/app/main.js', code);
			const dispatchError = vi.fn();

			result.execute({ dispatchError, dynamicImport: vi.fn() });

			expect(dispatchError).toHaveBeenCalledWith(new Error('Hello World'));
		});

		it('Throws await in top level error', () => {
			const code = `const StringUtility = await import('http://localhost:8080/js/utilities/StringUtility.js');`;
			const compiler = new JavaScriptCompiler(window);
			const result = compiler.compile('http://localhost:8080/js/app/main.js', code);

			expect(() => {
				result.execute({ dispatchError: () => {}, dynamicImport: vi.fn() });
			}).toThrow(
				`Failed to parse JavaScript in 'http://localhost:8080/js/app/main.js': await is only valid in async functions and the top level bodies of modules`
			);
		});
	});
});

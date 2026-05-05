import { beforeEach, describe, it, expect } from 'vitest';
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
		it('Handles dynamic import of a basic module.', () => {
			const code = `
                const variable = 'hello';

                class TestClass {
                    constructor() {
                        console.log('Hello \\\'World');
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

			expect(result.execute.toString()).toBe(`function anonymous($happy_dom) {
                const variable = 'hello';

                class TestClass {
                    constructor() {
                        console.log('Hello \\\'World');
                    }

                    async greet() {
                        const someModule = await $happy_dom.dynamicImport('http://localhost:8080/js/utilities/some-module.js');
                        const someModule2 = await $happy_dom.dynamicImport('http://localhost:8080/js/utilities/some-module-2.js');
                        return someModule.getGreeting();
                    }
                }
            }`);
		});

		it('Handles import statement in strings.', () => {
			const code = `
                var r = new RegExp(/^([1-9][0-9]*)(["â€³â€'â€²Â´]?)\s*([1-9][0-9]*\\/[1-9][0-9]*)["â€³â€]?$/);
                const hexLookUp=Array.from({length:127},(n,e)=>/[^!"$&'()*+,\-.;=_\`a-z{}~]/u.test(String.fromCharCode(e)))
                class R{constructor(){this.lastTime=Date.now(),this.lastValue=0,this.__speed=0}set value(e){this.__speed=(e-this.lastValue)/(Date.now()-this.lastTime),this.lastValue=e,this.lastTime=Date.now()}}
                const n=["@import",\`url(\${JSON.stringify(t.href)}) import('@package/debugger')\`];const t="";
                function log(){return console.log('To use the debugger you must import "@package/debugger"')}
                var i = "test";
                import("@package/debugger");
            `;
			const compiler = new JavaScriptCompiler(window);
			const result = compiler.compile('http://localhost:8080/js/app/main.js', code);

			expect(result.execute.toString()).toBe(`function anonymous($happy_dom) {
                var r = new RegExp(/^([1-9][0-9]*)(["â€³â€'â€²Â´]?)\s*([1-9][0-9]*\\/[1-9][0-9]*)["â€³â€]?$/);
                const hexLookUp=Array.from({length:127},(n,e)=>/[^!"$&'()*+,-.;=_\`a-z{}~]/u.test(String.fromCharCode(e)))
                class R{constructor(){this.lastTime=Date.now(),this.lastValue=0,this.__speed=0}set value(e){this.__speed=(e-this.lastValue)/(Date.now()-this.lastTime),this.lastValue=e,this.lastTime=Date.now()}}
                const n=["@import",\`url(\${JSON.stringify(t.href)}) import('@package/debugger')\`];const t="";
                function log(){return console.log('To use the debugger you must import "@package/debugger"')}
                var i = "test";
                $happy_dom.dynamicImport("@package/debugger");
            }`);
		});

		it('Adds try and catch statement if settings.errorCapture is set to "tryAndCatch".', () => {
			const window = new Window();

			const code = `
                const variable = 'hello';
                console.log('Hello \\\'World');
            `;
			const compiler = new JavaScriptCompiler(window);
			const result = compiler.compile('http://localhost:8080/js/app/main.js', code);

			expect(result.execute.toString()).toBe(`function anonymous($happy_dom) {try {
                const variable = 'hello';
                console.log('Hello \\'World');
            } catch (error) { $happy_dom.dispatchError(error); }}`);
		});

		it('Throws await in top level error', () => {
			const code = `const StringUtility = await import('http://localhost:8080/js/utilities/StringUtility.js');`;
			const compiler = new JavaScriptCompiler(window);
			expect(() => {
				compiler.compile('http://localhost:8080/js/app/main.js', code);
			}).toThrowError(
				`Failed to parse JavaScript in 'http://localhost:8080/js/app/main.js': await is only valid in async functions and the top level bodies of modules`
			);
		});
	});
});

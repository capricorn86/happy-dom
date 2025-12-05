import { beforeEach, describe, it, expect } from 'vitest';
import JavaScriptCompiler from '../../src/javascript/JavaScriptCompiler.js';
import BrowserWindow from '../../src/window/BrowserWindow.js';
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

import { beforeEach, describe, it, expect } from 'vitest';
import ModuleParser from '../../src/dynamic-import/ModuleParser.js';
import BrowserWindow from '../../src/window/BrowserWindow.js';
import Window from '../../src/window/Window.js';

describe('ModuleParser', () => {
	let window: BrowserWindow;

	beforeEach(() => {
		window = new Window();
	});

	describe('parse()', () => {
		it('Parses imports and exports of a basic module.', () => {
			const code = `
                import StringUtility from "../utilities/StringUtility.js";
                import { default as DefaultImageUtility } from "../utilities/ImageUtility.js";
                import * as NumberUtility from "../utilities/NumberUtility.js";

                const result = await import('http://localhost:8080/js/utilities/StringUtility.js');

                export const variable = 'hello';

                export default class TestClass {
                    constructor() {
                        console.log('Hello World');
                    }
                }
            `;
			const parser = new ModuleParser(window);
			const result = parser.parse('http://localhost:8080/js/app/main.js', code);

			expect(result.imports).toEqual([
				{ url: 'http://localhost:8080/js/utilities/StringUtility.js', type: 'javascript' },
				{ url: 'http://localhost:8080/js/utilities/ImageUtility.js', type: 'javascript' },
				{ url: 'http://localhost:8080/js/utilities/NumberUtility.js', type: 'javascript' }
			]);
			expect(result.code).toBe(`
                const StringUtility = $happy_dom.imports.get('http://localhost:8080/js/utilities/StringUtility.js').default;
                const { default: DefaultImageUtility } = $happy_dom.imports.get('http://localhost:8080/js/utilities/ImageUtility.js');
                const NumberUtility = $happy_dom.imports.get('http://localhost:8080/js/utilities/NumberUtility.js');

                const result = await $happy_dom.dynamicImport('http://localhost:8080/js/utilities/StringUtility.js');

                $happy_dom.exports['variable'] = 'hello';

                $happy_dom.exports.default = class TestClass {
                    constructor() {
                        console.log('Hello World');
                    }
                }
            `);
		});

		it('Ignores statements ending with "import" or "export".', () => {
			const code = `
                testImport StringUtility from "../utilities/StringUtility.js";
                testImport { default as DefaultImageUtility } from "../utilities/ImageUtility.js";
                testImport * as NumberUtility from "../utilities/NumberUtility.js";

                const result = await testImport('http://localhost:8080/js/utilities/StringUtility.js');

                testExport const variable = 'hello';

                testExport default class TestClass {
                    constructor() {
                        console.log('Hello World');
                    }
                }
            `;
			const parser = new ModuleParser(window);
			const result = parser.parse('http://localhost:8080/js/app/main.js', code);

			expect(result.imports).toEqual([]);

			expect(result.code).toBe(`
                testImport StringUtility from "../utilities/StringUtility.js";
                testImport { default as DefaultImageUtility } from "../utilities/ImageUtility.js";
                testImport * as NumberUtility from "../utilities/NumberUtility.js";

                const result = await testImport('http://localhost:8080/js/utilities/StringUtility.js');

                testExport const variable = 'hello';

                testExport default class TestClass {
                    constructor() {
                        console.log('Hello World');
                    }
                }
            `);
		});

		it('Handles import and export with a various combinations.', () => {
			const code = `
                import defaultExport from "stuff/defaultExport.js";
                import * as name from "stuff/name.js";
                import { export1 } from "stuff/export1.js";
                import { export2 as alias1 } from "stuff/export2.js";
                import { default as alias2 } from "stuff/default.js";
                import { export3, export4 } from "stuff/export3.js";
                import { export5, export6 as alias3, /* … */ } from "stuff/export4.js";
                import { "string name" as alias } from "stuff/stringName.js";
                import defaultExport, { export7, /* … */ } from "stuff/defaultExport2.js";
                import defaultExport, * as name from "stuff/defaultExport3.js";
                import JSON from 'json/data.json' with { type: "json" };
                import CSS from '../css/data.css' with { type: "css" };
                import "../run.js";
                import { export8,
                export9 } from "stuff/export5.js";

                // Comment
                /* Comment */
                /**
                 *Comment import data from 'data'
                */
                const regexp = /import \\/data from 'data'/gm;
                export default class TestClass {
                    constructor() {
                        console.log('export const variable = "\\'";');
                    }

                    print() {
                        const data = await import('data/data.json', { with: { type: 'json' } });
                        console.log(data);

                        const data2 = await import('data/data.js');
                        console.log(data2);
                    }
                }

                if(test === 'export default class') {
                    const test = new TestClass();
                    test.print("import data from 'data'");
                }

                export const variable = 'hello';
                export const variable2 = "he\"ll\"o";
                export const variable3 = \`export const variable = 'hello';\`;
                export const arr = ['hello', "he\"ll\"o", \`hello\`];

                // Exporting declarations
                export let name1, name2; // also var
                export const name3 = 1, name4 = 2; // also var, let
                export function functionName() { /* … */ }
                export class ClassName { /* … */ }
                export function* generatorFunctionName() { /* … */ }
                export const { name5, name6: bar } = o;
                export const [ name7, name8 ] = array;

                // Export list
                export { name9, name10 /* , !*/ };
                export { variable1 as name11, variable2 as name12, nameN };
                export { variable1 as "string name" };
                export { name1 as default };

                // Aggregating modules
                export * from "../aggregated1.js";
                export * as name1 from "../aggregated2.js";
                export { name1, /* …, */ nameN } from "../aggregated3.js";
                export { import1 as name1, import2 as name2, /* …, */ nameN } from "../aggregated4.js";
                export { default, /* …, */ } from "../aggregated5.js";
                export { default as name1 } from "../aggregated6.js";
            `;

			const parser = new ModuleParser(window);
			const result = parser.parse('http://localhost:8080/js/app/main.js', code);

			expect(result.imports).toEqual([
				{ url: 'http://localhost:8080/js/app/stuff/defaultExport.js', type: 'javascript' },
				{ url: 'http://localhost:8080/js/app/stuff/name.js', type: 'javascript' },
				{ url: 'http://localhost:8080/js/app/stuff/export1.js', type: 'javascript' },
				{ url: 'http://localhost:8080/js/app/stuff/export2.js', type: 'javascript' },
				{ url: 'http://localhost:8080/js/app/stuff/default.js', type: 'javascript' },
				{ url: 'http://localhost:8080/js/app/stuff/export3.js', type: 'javascript' },
				{ url: 'http://localhost:8080/js/app/stuff/export4.js', type: 'javascript' },
				{ url: 'http://localhost:8080/js/app/stuff/stringName.js', type: 'javascript' },
				{ url: 'http://localhost:8080/js/app/stuff/defaultExport2.js', type: 'javascript' },
				{ url: 'http://localhost:8080/js/app/stuff/defaultExport3.js', type: 'javascript' },
				{ url: 'http://localhost:8080/js/app/json/data.json', type: 'json' },
				{ url: 'http://localhost:8080/js/css/data.css', type: 'css' },
				{ url: 'http://localhost:8080/js/run.js', type: 'javascript' },
				{ url: 'http://localhost:8080/js/app/stuff/export5.js', type: 'javascript' },
				{ url: 'http://localhost:8080/js/aggregated1.js', type: 'javascript' },
				{ url: 'http://localhost:8080/js/aggregated2.js', type: 'javascript' },
				{ url: 'http://localhost:8080/js/aggregated3.js', type: 'javascript' },
				{ url: 'http://localhost:8080/js/aggregated4.js', type: 'javascript' },
				{ url: 'http://localhost:8080/js/aggregated5.js', type: 'javascript' },
				{ url: 'http://localhost:8080/js/aggregated6.js', type: 'javascript' }
			]);

			expect(result.code).toBe(`
                const defaultExport = $happy_dom.imports.get('http://localhost:8080/js/app/stuff/defaultExport.js').default;
                const name = $happy_dom.imports.get('http://localhost:8080/js/app/stuff/name.js');
                const { export1 } = $happy_dom.imports.get('http://localhost:8080/js/app/stuff/export1.js');
                const { export2: alias1 } = $happy_dom.imports.get('http://localhost:8080/js/app/stuff/export2.js');
                const { default: alias2 } = $happy_dom.imports.get('http://localhost:8080/js/app/stuff/default.js');
                const { export3, export4 } = $happy_dom.imports.get('http://localhost:8080/js/app/stuff/export3.js');
                const { export5, export6: alias3, /* … */ } = $happy_dom.imports.get('http://localhost:8080/js/app/stuff/export4.js');
                const { "string name": alias } = $happy_dom.imports.get('http://localhost:8080/js/app/stuff/stringName.js');
                const defaultExport = $happy_dom.imports.get('http://localhost:8080/js/app/stuff/defaultExport2.js').default;
const { export7, /* … */ } = $happy_dom.imports.get('http://localhost:8080/js/app/stuff/defaultExport2.js');
                const defaultExport = $happy_dom.imports.get('http://localhost:8080/js/app/stuff/defaultExport3.js').default;
const name = $happy_dom.imports.get('http://localhost:8080/js/app/stuff/defaultExport3.js');
                const JSON = $happy_dom.imports.get('http://localhost:8080/js/app/json/data.json').default;
                const CSS = $happy_dom.imports.get('http://localhost:8080/js/css/data.css').default;
                
                const { export8,
                export9 } = $happy_dom.imports.get('http://localhost:8080/js/app/stuff/export5.js');

                // Comment
                /* Comment */
                /**
                 *Comment import data from 'data'
                */
                const regexp = /import \\/data from 'data'/gm;
                $happy_dom.exports.default = class TestClass {
                    constructor() {
                        console.log('export const variable = "\\'";');
                    }

                    print() {
                        const data = await $happy_dom.dynamicImport('data/data.json', { with: { type: 'json' } });
                        console.log(data);

                        const data2 = await $happy_dom.dynamicImport('data/data.js');
                        console.log(data2);
                    }
                }

                if(test === 'export default class') {
                    const test = new TestClass();
                    test.print("import data from 'data'");
                }

                $happy_dom.exports['variable'] = 'hello';
                $happy_dom.exports['variable2'] = "he"ll"o";
                $happy_dom.exports['variable3'] = \`export const variable = 'hello';\`;
                $happy_dom.exports['arr'] = ['hello', "he"ll"o", \`hello\`];

                // Exporting declarations
                /*Unknown export: export let name1, name2;*/ // also var
                $happy_dom.exports['name3'] = 1, name4 = 2; // also var, let
                $happy_dom.exports['functionName'] = function functionName() { /* … */ }
                $happy_dom.exports['ClassName'] = class ClassName { /* … */ }
                $happy_dom.exports['generatorFunctionName'] = function* generatorFunctionName() { /* … */ }
                const $happy_dom_export_0 = o;
                const $happy_dom_export_1 = array;

                // Export list
                $happy_dom.exports['name9'] = name9;
$happy_dom.exports['name10'] = name10;
                $happy_dom.exports['name11'] = variable1;
$happy_dom.exports['name12'] = variable2;
$happy_dom.exports['nameN'] = nameN;
                $happy_dom.exports['string name'] = variable1;
                $happy_dom.exports['default'] = name1;

                // Aggregating modules
                Object.assign($happy_dom.exports, $happy_dom.imports.get('http://localhost:8080/js/aggregated1.js'));
                $happy_dom.exports['name1'] = $happy_dom.imports.get('http://localhost:8080/js/aggregated2.js');
                $happy_dom.exports['name1'] = $happy_dom.imports.get('http://localhost:8080/js/aggregated3.js')['name1'];
$happy_dom.exports['nameN'] = $happy_dom.imports.get('http://localhost:8080/js/aggregated3.js')['nameN'];
                $happy_dom.exports['name1'] = $happy_dom.imports.get('http://localhost:8080/js/aggregated4.js')['import1'];
$happy_dom.exports['name2'] = $happy_dom.imports.get('http://localhost:8080/js/aggregated4.js')['import2'];
$happy_dom.exports['nameN'] = $happy_dom.imports.get('http://localhost:8080/js/aggregated4.js')['nameN'];
                $happy_dom.exports['default'] = $happy_dom.imports.get('http://localhost:8080/js/aggregated5.js')['default'];
                $happy_dom.exports['name1'] = $happy_dom.imports.get('http://localhost:8080/js/aggregated6.js')['default'];
            

$happy_dom.exports['name5'] = $happy_dom_export_0['name5'];
$happy_dom.exports['bar'] = $happy_dom_export_0['name6'];
$happy_dom.exports['name7'] = $happy_dom_export_1['name7'];
$happy_dom.exports['name8'] = $happy_dom_export_1['name8'];
`);
		});

		it('Handles export default function.', () => {
			const code = `
                export const variable = /my-regexp/;
                export default function () {
                    console.log('Hello World');
                }
            `;

			const parser = new ModuleParser(window);
			const result = parser.parse('http://localhost:8080/js/app/main.js', code);

			expect(result.imports).toEqual([]);

			expect(result.code).toBe(`
                $happy_dom.exports['variable'] = /my-regexp/;
                $happy_dom.exports.default = function () {
                    console.log('Hello World');
                }
            `);
		});

		it('Handles export default class.', () => {
			const code = `
                export default class TestClass {
                    constructor() {
                        console.log('Hello World');
                    }
                }
            `;

			const parser = new ModuleParser(window);
			const result = parser.parse('http://localhost:8080/js/app/main.js', code);

			expect(result.imports).toEqual([]);

			expect(result.code).toBe(`
                $happy_dom.exports.default = class TestClass {
                    constructor() {
                        console.log('Hello World');
                    }
                }
            `);
		});

		it('Handles export default generator function.', () => {
			const code = `
                export default function* () {
                    yield i;
                    yield i + 10;
                }
            `;

			const parser = new ModuleParser(window);
			const result = parser.parse('http://localhost:8080/js/app/main.js', code);

			expect(result.imports).toEqual([]);

			expect(result.code).toBe(`
                $happy_dom.exports.default = function* () {
                    yield i;
                    yield i + 10;
                }
            `);
		});

		it('Handles export default object.', () => {
			const code = `
                export default {
                    test: 'test'
                };
            `;

			const parser = new ModuleParser(window);
			const result = parser.parse('http://localhost:8080/js/app/main.js', code);

			expect(result.imports).toEqual([]);

			expect(result.code).toBe(`
                $happy_dom.exports.default = {
                    test: 'test'
                };
            `);
		});

		it('Handles export default expression.', () => {
			const code = `
                export default (function () {
                    return {
                        test: 'test'
                    }
                })();
            `;

			const parser = new ModuleParser(window);
			const result = parser.parse('http://localhost:8080/js/app/main.js', code);

			expect(result.imports).toEqual([]);

			expect(result.code).toBe(`
                $happy_dom.exports.default = (function () {
                    return {
                        test: 'test'
                    }
                })();
            `);
		});
	});
});

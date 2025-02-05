import { beforeEach, describe, it, expect } from 'vitest';
import ECMAScriptModuleCompiler from '../../src/module/ECMAScriptModuleCompiler.js';
import BrowserWindow from '../../src/window/BrowserWindow.js';
import Window from '../../src/window/Window.js';
import BrowserErrorCaptureEnum from '../../src/browser/enums/BrowserErrorCaptureEnum.js';

describe('ECMAScriptModuleCompiler', () => {
	let window: BrowserWindow;

	beforeEach(() => {
		window = new Window({
			settings: {
				errorCapture: BrowserErrorCaptureEnum.disabled
			}
		});
	});

	describe('compile()', () => {
		it('Handles imports and exports of a basic module.', () => {
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
			const compiler = new ECMAScriptModuleCompiler(window);
			const result = compiler.compile('http://localhost:8080/js/app/main.js', code);

			expect(result.imports).toEqual([
				{ url: 'http://localhost:8080/js/utilities/StringUtility.js', type: 'esm' },
				{ url: 'http://localhost:8080/js/utilities/ImageUtility.js', type: 'esm' },
				{ url: 'http://localhost:8080/js/utilities/NumberUtility.js', type: 'esm' }
			]);
			expect(result.execute.toString()).toBe(`async function anonymous($happy_dom) {
//# sourceURL=http://localhost:8080/js/app/main.js

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
            
}`);
		});

		it('Ignores function suffixed with import().', () => {
			const code = `
                async function test_import(url) {
                    return '"' + url + '"';
                }
                
                const result = await test_import('http://localhost:8080/js/utilities/StringUtility.js');
            `;
			const compiler = new ECMAScriptModuleCompiler(window);
			const result = compiler.compile('http://localhost:8080/js/app/main.js', code);

			expect(result.imports).toEqual([]);

			expect(result.execute.toString()).toBe(`async function anonymous($happy_dom) {
//# sourceURL=http://localhost:8080/js/app/main.js

                async function test_import(url) {
                    return '"' + url + '"';
                }
                
                const result = await test_import('http://localhost:8080/js/utilities/StringUtility.js');
            
}`);
		});

		it('Handles import and export with a various combinations.', () => {
			const code = `
                import defaultExport1 from "stuff/defaultExport.js";
                import * as name from "stuff/name.js";
                import { export1 } from "stuff/export1.js";
                import { export2 as alias1 } from "stuff/export2.js";
                import { default as alias2 } from "stuff/default.js";
                import { export3, export4 } from "stuff/export3.js";
                import { export5, export6 as alias3, /* … */ } from "stuff/export4.js";
                import { "string name" as alias } from "stuff/stringName.js";
                import defaultExport2, { export7, /* … */ } from "stuff/defaultExport2.js";
                import defaultExport3, * as name2 from "stuff/defaultExport3.js";
                import JSON from 'json/data.json' with { type: "json" };
                import CSS from '../css/data.css' with { type: "css" };
                import "../run.js";
                import { export8,
                export9 } from "stuff/export5.js";

                // Comment
                /* Comment */
                /**
                 *Comment import data from 'data'
                 '
                 {
                 [
                 /
                */
                const variable = \`"'\\\`{[/\`;
                const regexp = /import \\/data from 'data'/gm;
                export default class TestClass {
                    constructor() {
                        console.log('export const variable = "\\'";');
                    }

                    async print() {
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
                export const variable2 = "he\\"ll\\"o";
                export const variable3 = \`export const variable = 'hello';\`;
                export const arr = ['hello', "he\\"ll\\"o", \`hello\`];

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

			const compiler = new ECMAScriptModuleCompiler(window);
			const result = compiler.compile('http://localhost:8080/js/app/main.js', code);

			expect(result.imports).toEqual([
				{ url: 'http://localhost:8080/js/app/stuff/defaultExport.js', type: 'esm' },
				{ url: 'http://localhost:8080/js/app/stuff/name.js', type: 'esm' },
				{ url: 'http://localhost:8080/js/app/stuff/export1.js', type: 'esm' },
				{ url: 'http://localhost:8080/js/app/stuff/export2.js', type: 'esm' },
				{ url: 'http://localhost:8080/js/app/stuff/default.js', type: 'esm' },
				{ url: 'http://localhost:8080/js/app/stuff/export3.js', type: 'esm' },
				{ url: 'http://localhost:8080/js/app/stuff/export4.js', type: 'esm' },
				{ url: 'http://localhost:8080/js/app/stuff/stringName.js', type: 'esm' },
				{ url: 'http://localhost:8080/js/app/stuff/defaultExport2.js', type: 'esm' },
				{ url: 'http://localhost:8080/js/app/stuff/defaultExport3.js', type: 'esm' },
				{ url: 'http://localhost:8080/js/app/json/data.json', type: 'json' },
				{ url: 'http://localhost:8080/js/css/data.css', type: 'css' },
				{ url: 'http://localhost:8080/js/run.js', type: 'esm' },
				{ url: 'http://localhost:8080/js/app/stuff/export5.js', type: 'esm' },
				{ url: 'http://localhost:8080/js/aggregated1.js', type: 'esm' },
				{ url: 'http://localhost:8080/js/aggregated2.js', type: 'esm' },
				{ url: 'http://localhost:8080/js/aggregated3.js', type: 'esm' },
				{ url: 'http://localhost:8080/js/aggregated4.js', type: 'esm' },
				{ url: 'http://localhost:8080/js/aggregated5.js', type: 'esm' },
				{ url: 'http://localhost:8080/js/aggregated6.js', type: 'esm' }
			]);

			expect(result.execute.toString()).toBe(`async function anonymous($happy_dom) {
//# sourceURL=http://localhost:8080/js/app/main.js

                const defaultExport1 = $happy_dom.imports.get('http://localhost:8080/js/app/stuff/defaultExport.js').default;
                const name = $happy_dom.imports.get('http://localhost:8080/js/app/stuff/name.js');
                const { export1 } = $happy_dom.imports.get('http://localhost:8080/js/app/stuff/export1.js');
                const { export2: alias1 } = $happy_dom.imports.get('http://localhost:8080/js/app/stuff/export2.js');
                const { default: alias2 } = $happy_dom.imports.get('http://localhost:8080/js/app/stuff/default.js');
                const { export3, export4 } = $happy_dom.imports.get('http://localhost:8080/js/app/stuff/export3.js');
                const { export5, export6: alias3, /* … */ } = $happy_dom.imports.get('http://localhost:8080/js/app/stuff/export4.js');
                const { "string name": alias } = $happy_dom.imports.get('http://localhost:8080/js/app/stuff/stringName.js');
                const defaultExport2 = $happy_dom.imports.get('http://localhost:8080/js/app/stuff/defaultExport2.js').default;
const { export7, /* … */ } = $happy_dom.imports.get('http://localhost:8080/js/app/stuff/defaultExport2.js');
                const defaultExport3 = $happy_dom.imports.get('http://localhost:8080/js/app/stuff/defaultExport3.js').default;
const name2 = $happy_dom.imports.get('http://localhost:8080/js/app/stuff/defaultExport3.js');
                const JSON = $happy_dom.imports.get('http://localhost:8080/js/app/json/data.json').default;
                const CSS = $happy_dom.imports.get('http://localhost:8080/js/css/data.css').default;
                
                const { export8,
                export9 } = $happy_dom.imports.get('http://localhost:8080/js/app/stuff/export5.js');

                // Comment
                /* Comment */
                /**
                 *Comment import data from 'data'
                 '
                 {
                 [
                 /
                */
                const variable = \`"'\\\`{[/\`;
                const regexp = /import \\/data from 'data'/gm;
                $happy_dom.exports.default = class TestClass {
                    constructor() {
                        console.log('export const variable = "\\'";');
                    }

                    async print() {
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
                $happy_dom.exports['variable2'] = "he\\"ll\\"o";
                $happy_dom.exports['variable3'] = \`export const variable = 'hello';\`;
                $happy_dom.exports['arr'] = ['hello', "he\\"ll\\"o", \`hello\`];

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

}`);
		});

		it('Handles export default function.', () => {
			const code = `
                export const variable = /my-regexp/;
                export default function () {
                    console.log('Hello World');
                }
            `;

			const compiler = new ECMAScriptModuleCompiler(window);
			const result = compiler.compile('http://localhost:8080/js/app/main.js', code);

			expect(result.imports).toEqual([]);

			expect(result.execute.toString()).toBe(`async function anonymous($happy_dom) {
//# sourceURL=http://localhost:8080/js/app/main.js

                $happy_dom.exports['variable'] = /my-regexp/;
                $happy_dom.exports.default = function () {
                    console.log('Hello World');
                }
            
}`);
		});

		it('Handles export default class.', () => {
			const code = `
                export default class TestClass {
                    constructor() {
                        console.log('Hello World');
                    }
                }
            `;

			const compiler = new ECMAScriptModuleCompiler(window);
			const result = compiler.compile('http://localhost:8080/js/app/main.js', code);

			expect(result.imports).toEqual([]);

			expect(result.execute.toString()).toBe(`async function anonymous($happy_dom) {
//# sourceURL=http://localhost:8080/js/app/main.js

                $happy_dom.exports.default = class TestClass {
                    constructor() {
                        console.log('Hello World');
                    }
                }
            
}`);
		});

		it('Handles export default generator function.', () => {
			const code = `
                export default function* () {
                    yield i;
                    yield i + 10;
                }
            `;

			const compiler = new ECMAScriptModuleCompiler(window);
			const result = compiler.compile('http://localhost:8080/js/app/main.js', code);

			expect(result.imports).toEqual([]);

			expect(result.execute.toString()).toBe(`async function anonymous($happy_dom) {
//# sourceURL=http://localhost:8080/js/app/main.js

                $happy_dom.exports.default = function* () {
                    yield i;
                    yield i + 10;
                }
            
}`);
		});

		it('Handles export default object.', () => {
			const code = `
                export default {
                    test: 'test'
                };
            `;

			const compiler = new ECMAScriptModuleCompiler(window);
			const result = compiler.compile('http://localhost:8080/js/app/main.js', code);

			expect(result.imports).toEqual([]);

			expect(result.execute.toString()).toBe(`async function anonymous($happy_dom) {
//# sourceURL=http://localhost:8080/js/app/main.js

                $happy_dom.exports.default = {
                    test: 'test'
                };
            
}`);
		});

		it('Handles export default expression.', () => {
			const code = `
                export default (function () {
                    return {
                        test: 'test'
                    }
                })();
            `;

			const compiler = new ECMAScriptModuleCompiler(window);
			const result = compiler.compile('http://localhost:8080/js/app/main.js', code);

			expect(result.imports).toEqual([]);

			expect(result.execute.toString()).toBe(`async function anonymous($happy_dom) {
//# sourceURL=http://localhost:8080/js/app/main.js

                $happy_dom.exports.default = (function () {
                    return {
                        test: 'test'
                    }
                })();
            
}`);
		});

		it('Adds try and catch statement if settings.errorCapture is set to "tryAndCatch".', () => {
			const window = new Window();
			const code = `
                export default {
                    test: 'test'
                };
            `;

			const compiler = new ECMAScriptModuleCompiler(window);
			const result = compiler.compile('http://localhost:8080/js/app/main.js', code);

			expect(result.imports).toEqual([]);

			expect(result.execute.toString()).toBe(`async function anonymous($happy_dom) {
//# sourceURL=http://localhost:8080/js/app/main.js
try {

                $happy_dom.exports.default = {
                    test: 'test'
                };
            
} catch(e) {
   $happy_dom.dispatchError(e);
}
}`);
		});

		it('Handles special cases of RegExp.', () => {
			const code = `
                const match = 'replace'.match(/replace/);
                /test/.test('test') && (() => {})();
                const regexpes = [/test/, /test/];
                const templateString = \`\${'replace'.match(/replace/)[0]}\`;
                const string = "/";
                const string2 = '/';
                const string3 = \`/\`;
                const regexp1 = /[[[[[[[[[[]]/;
                const regexp2 = /\\//i;
                const regexp3 = /.*/i;
                const regexp4 = /[/][/]/;

                export { regexp1, match, regexpes, templateString };
            `;

			const compiler = new ECMAScriptModuleCompiler(window);
			const result = compiler.compile('http://localhost:8080/js/app/main.js', code);

			expect(result.imports).toEqual([]);

			expect(result.execute.toString()).toBe(`async function anonymous($happy_dom) {
//# sourceURL=http://localhost:8080/js/app/main.js

                const match = 'replace'.match(/replace/);
                /test/.test('test') && (() => {})();
                const regexpes = [/test/, /test/];
                const templateString = \`\${'replace'.match(/replace/)[0]}\`;
                const string = "/";
                const string2 = '/';
                const string3 = \`/\`;
                const regexp1 = /[[[[[[[[[[]]/;
                const regexp2 = /\\//i;
                const regexp3 = /.*/i;
                const regexp4 = /[/][/]/;

                $happy_dom.exports['regexp1'] = regexp1;
$happy_dom.exports['match'] = match;
$happy_dom.exports['regexpes'] = regexpes;
$happy_dom.exports['templateString'] = templateString;
            
}`);
		});

		it('Handles string with escape character.', () => {
			const code = `
                const string = "\\"";
                const string2 = "\\\\";
                const string3 = '\\'';
                const string4 = '\\\\';
                const string5 = \`\\\`\`;
                const string6 = \`\\\\\`;
                export { string, string2, string3, string4, string5, string6 };
            `;

			const compiler = new ECMAScriptModuleCompiler(window);
			const result = compiler.compile('http://localhost:8080/js/app/main.js', code);

			expect(result.imports).toEqual([]);

			expect(result.execute.toString()).toBe(`async function anonymous($happy_dom) {
//# sourceURL=http://localhost:8080/js/app/main.js

                const string = "\\"";
                const string2 = "\\\\";
                const string3 = '\\'';
                const string4 = '\\\\';
                const string5 = \`\\\`\`;
                const string6 = \`\\\\\`;
                $happy_dom.exports['string'] = string;
$happy_dom.exports['string2'] = string2;
$happy_dom.exports['string3'] = string3;
$happy_dom.exports['string4'] = string4;
$happy_dom.exports['string5'] = string5;
$happy_dom.exports['string6'] = string6;
            
}`);
		});

		it('Handles dynamic import inside template string.', () => {
			const code = `
                export const func = async () => {
                    return \`test = \${({ test: \`\${ (await import('./test.js')) }\` })}\`;
                };
            `;

			const compiler = new ECMAScriptModuleCompiler(window);
			const result = compiler.compile('http://localhost:8080/js/app/main.js', code);

			expect(result.imports).toEqual([]);

			expect(result.execute.toString()).toBe(`async function anonymous($happy_dom) {
//# sourceURL=http://localhost:8080/js/app/main.js

                $happy_dom.exports['func'] = async () => {
                    return \`test = \${({ test: \`\${ (await $happy_dom.dynamicImport('./test.js')) }\` })}\`;
                };
            
}`);
		});

		it('Handles vite preload library with minimzed import.', () => {
			const code = `const __vite__mapDeps=(i,m=__vite__mapDeps,d=(m.f||(m.f=["static/js/Home-CsPrQa7_.js","static/js/preload-helper-BMSd6Up6.js","static/js/Router-yzXgKzu7.js","static/js/_commonjsHelpers-BosuxZz1.js","static/js/sizes-1ww1H62B.js","static/js/Choice-Bixrh5CR.js","static/js/index-OjqIgG3h.js","static/js/arrow-left-DVwQ9ese.js"])))=>i.map(i=>d[i]);
import{_ as c}from"./preload-helper-BMSd6Up6.js";class r{static connect(){const n=location.hash.match(/S{0,1}([0-9]{7,})$/);if(n){const a=new URLSearchParams(location.search);a.set("id",n[1]),location.href=new URL('example/?a=b',location.href).href;return}const t=location.hash.match(/\\/([a-zA-Z0-9-]{10,})$/);if(t){const a=new URLSearchParams(location.search);a.set("code",t[1]),location.href=new URL('example/?a=b',location.href).href;return}const o=location.hash.match(/\\/([a-zA-Z0-9]{4,6})$/);if(o){const a=new URLSearchParams(location.search);a.set("code",o[1]),location.href=new URL('example/?a=b',location.href).href;return}}}r.connect();c(()=>import("./Home-CsPrQa7_.js").then(e=>e.a),__vite__mapDeps([0,1,2,3,4,5,6,7,8,9,10,11,12,13]));`;

			const compiler = new ECMAScriptModuleCompiler(window);
			const result = compiler.compile('http://localhost:8080/js/app/main.js', code);

			expect(result.imports).toEqual([
				{ url: 'http://localhost:8080/js/app/preload-helper-BMSd6Up6.js', type: 'esm' }
			]);

			expect(result.execute.toString()).toBe(`async function anonymous($happy_dom) {
//# sourceURL=http://localhost:8080/js/app/main.js
const __vite__mapDeps=(i,m=__vite__mapDeps,d=(m.f||(m.f=["static/js/Home-CsPrQa7_.js","static/js/preload-helper-BMSd6Up6.js","static/js/Router-yzXgKzu7.js","static/js/_commonjsHelpers-BosuxZz1.js","static/js/sizes-1ww1H62B.js","static/js/Choice-Bixrh5CR.js","static/js/index-OjqIgG3h.js","static/js/arrow-left-DVwQ9ese.js"])))=>i.map(i=>d[i]);
const {_: c} = $happy_dom.imports.get('http://localhost:8080/js/app/preload-helper-BMSd6Up6.js');class r{static connect(){const n=location.hash.match(/S{0,1}([0-9]{7,})$/);if(n){const a=new URLSearchParams(location.search);a.set("id",n[1]),location.href=new URL('example/?a=b',location.href).href;return}const t=location.hash.match(/\\/([a-zA-Z0-9-]{10,})$/);if(t){const a=new URLSearchParams(location.search);a.set("code",t[1]),location.href=new URL('example/?a=b',location.href).href;return}const o=location.hash.match(/\\/([a-zA-Z0-9]{4,6})$/);if(o){const a=new URLSearchParams(location.search);a.set("code",o[1]),location.href=new URL('example/?a=b',location.href).href;return}}}r.connect();c(()=>$happy_dom.dynamicImport("./Home-CsPrQa7_.js").then(e=>e.a),__vite__mapDeps([0,1,2,3,4,5,6,7,8,9,10,11,12,13]));
}`);
		});

		it('Handles vite with minimized export', () => {
			const code = `(function(){const i=document.createElement("link").relList;if(i&&i.supports&&i.supports("modulepreload"))return;for(const e of document.querySelectorAll('link[rel="modulepreload"]'))a(e);new MutationObserver(e=>{for(const r of e)if(r.type==="childList")for(const t of r.addedNodes)t.tagName==="LINK"&&t.rel==="modulepreload"&&a(t)}).observe(document,{childList:!0,subtree:!0});function c(e){const r={};return e.integrity&&(r.integrity=e.integrity),e.referrerPolicy&&(r.referrerPolicy=e.referrerPolicy),e.crossOrigin==="use-credentials"?r.credentials="include":e.crossOrigin==="anonymous"?r.credentials="omit":r.credentials="same-origin",r}function a(e){if(e.ep)return;e.ep=!0;const r=c(e);fetch(e.href,r)}})();const h="modulepreload",y=function(u){return"/test/path/"+u},d={},g=function(i,c,a){let e=Promise.resolve();if(c&&c.length>0){document.getElementsByTagName("link");const t=document.querySelector("meta[property=csp-nonce]"),o=(t==null?void 0:t.nonce)||(t==null?void 0:t.getAttribute("nonce"));e=Promise.allSettled(c.map(n=>{if(n=y(n),n in d)return;d[n]=!0;const l=n.endsWith(".css"),f=l?'[rel="stylemodal"]':"";if(document.querySelector('link[href="'+n+'"]'+f+''))return;const s=document.createElement("link");if(s.rel=l?"stylemodal":h,l||(s.as="script"),s.crossOrigin="",s.href=n,o&&s.setAttribute("nonce",o),document.head.appendChild(s),l)return new Promise((m,p)=>{s.addEventListener("load",m),s.addEventListener("error",()=>p(new Error('Unable to preload CSS for ' + n)))})}))}function r(t){const o=new Event("vite:preloadError",{cancelable:!0});if(o.payload=t,window.dispatchEvent(o),!o.defaultPrevented)throw t}return e.then(t=>{for(const o of t||[])o.status==="rejected"&&r(o.reason);return i().catch(r)})};export{g as _};`;

			const compiler = new ECMAScriptModuleCompiler(window);
			const result = compiler.compile('http://localhost:8080/js/app/main.js', code);

			expect(result.imports).toEqual([]);

			expect(result.execute.toString()).toBe(
				`async function anonymous($happy_dom) {
//# sourceURL=http://localhost:8080/js/app/main.js
(function(){const i=document.createElement("link").relList;if(i&&i.supports&&i.supports("modulepreload"))return;for(const e of document.querySelectorAll('link[rel="modulepreload"]'))a(e);new MutationObserver(e=>{for(const r of e)if(r.type==="childList")for(const t of r.addedNodes)t.tagName==="LINK"&&t.rel==="modulepreload"&&a(t)}).observe(document,{childList:!0,subtree:!0});function c(e){const r={};return e.integrity&&(r.integrity=e.integrity),e.referrerPolicy&&(r.referrerPolicy=e.referrerPolicy),e.crossOrigin==="use-credentials"?r.credentials="include":e.crossOrigin==="anonymous"?r.credentials="omit":r.credentials="same-origin",r}function a(e){if(e.ep)return;e.ep=!0;const r=c(e);fetch(e.href,r)}})();const h="modulepreload",y=function(u){return"/test/path/"+u},d={},g=function(i,c,a){let e=Promise.resolve();if(c&&c.length>0){document.getElementsByTagName("link");const t=document.querySelector("meta[property=csp-nonce]"),o=(t==null?void 0:t.nonce)||(t==null?void 0:t.getAttribute("nonce"));e=Promise.allSettled(c.map(n=>{if(n=y(n),n in d)return;d[n]=!0;const l=n.endsWith(".css"),f=l?'[rel="stylemodal"]':"";if(document.querySelector('link[href="'+n+'"]'+f+''))return;const s=document.createElement("link");if(s.rel=l?"stylemodal":h,l||(s.as="script"),s.crossOrigin="",s.href=n,o&&s.setAttribute("nonce",o),document.head.appendChild(s),l)return new Promise((m,p)=>{s.addEventListener("load",m),s.addEventListener("error",()=>p(new Error('Unable to preload CSS for ' + n)))})}))}function r(t){const o=new Event("vite:preloadError",{cancelable:!0});if(o.payload=t,window.dispatchEvent(o),!o.defaultPrevented)throw t}return e.then(t=>{for(const o of t||[])o.status==="rejected"&&r(o.reason);return i().catch(r)})};$happy_dom.exports['_'] = g;
}`
			);
		});

		it('Handles real world example.', () => {
			const code = `const __vite__mapDeps=(i,m=__vite__mapDeps,d=(m.f||(m.f=["static/js/preload-helper-BMSd6Up6.js","static/js/Router-yzXgKzu7.js","static/js/_commonjsHelpers-BosuxZz1.js","static/js/Choice-Bixrh5CR.js","static/js/index-OjqIgG3h.js","static/js/arrow-left-DVwQ9ese.js","static/js/Image-CMZuFGwN.js","static/js/IdGenerator-BXAguRov.js","static/js/resizeListener-BpJMTz31.js","static/js/menu-BQ9iRMnL.js","static/js/menu-DGNLEQ8L.js"])))=>i.map(i=>d[i]);
import{_ as a}from"./preload-helper-BMSd6Up6.js";import{k as g,s as A,r as C,t as P,h as o,R as c,m as O,F as V,u as B,n as M,A as f,P as $,v as G,w as _,q as W}from"./Router-yzXgKzu7.js";import{s as b}from"./sizes-1ww1H62B.js";import{C as F,S as d,r as U,b as I,I as H,s as N,g as j,i as K,d as q,T as E}from"./Choice-Bixrh5CR.js";import{K as R,W as Z}from"./index-OjqIgG3h.js";import"./arrow-left-DVwQ9ese.js";import{I as te}from"./Image-CMZuFGwN.js";const ie=[["&","&amp"],["<","&lt"],[">","&gt"],[\'"\',"&quot"],["\'","&#x27"],["/","&#x2F"]];class ae{static encodeForAttribute(e){for(const t of ie)e=e.replace(new RegExp(t[0],"gm"),t[1]+";");return e}}class ne{static templateToString(e,...t){let i="";for(let n=0,s=e.length;n<s;n++)i+=e[n],n<s-1&&t[n]!==null&&(i.endsWith(\'="\')||i.endsWith("=\'")?i+=ae.encodeForAttribute(String(t[n])):i+=String(t[n]));return i}}const $e=ne.templateToString,D=F.templateToString,oe=D\`
  *,
  *:before,
  *:after {
    box-sizing: border-box;
  }

  h2 {
    margin: 0;
  }

  .container {
    width: 100%;
    height: 100%;
    line-height: 1.571;
  }

  .linkWrapper {
    text-decoration: none;
    color: #ccc;
  }

  @media screen and (max-width: 1200px) {
    .container {
      margin-bottom: 2rem;
    }
  }
\`,se="data:image/svg+xml,%3csvg%20width=\'100\'%20height=\'40\'%3e/%3e%3c/g%3e%3c/svg%3e",re=D\`
  *,
  *:before,
  *:after {
    box-sizing: border-box;
  }

  :host {
    display: flex;
  }

  .content {
    margin-left: auto;
    display: flex;
    align-items: center;
    height: 100%;
  }

  @media screen and (max-width: 400px) {
    :host {
      height: 3.75rem;
    }
  }

  @media print {
    :host {
      visibility: hidden;
      display: none;
    }
  }
\`;U(I);const x=class x extends HTMLElement{constructor(){super(),this.settings=null,this.translations=null,this.resizeTimeout=null,this.resizeListener=(()=>{clearTimeout(this.resizeTimeout),this.resizeTimeout=setTimeout(()=>this.render())}).bind(this),this.attachShadow({mode:"open"})}async connectedCallback(){window.addEventListener("resize",this.resizeListener),this.render(),await Promise.all([(async()=>{this.settings=await A(),this.render()})(),(async()=>{this.translations=await C(),this.render()})(),a(()=>import("./AvatarButton-DpAonoMJ.js"),__vite__mapDeps([0,1,2,3,4,5,6,7,8]))])}disconnectedCallback(){clearTimeout(this.resizeTimeout),window.removeEventListener("resize",this.resizeListener)}attributeChangedCallback(){this.render()}render(){P(this.getTemplate(),this.shadowRoot)}getTemplate(){return o\`
      <style>
        \${re}
      </style>
      \${this.getLogoButton()} \${this.getBackButton()}
      <div class="content">
        \${this.getChoiceSelector()} \${this.getAvatarButton()}
        \${this.getOCButton()} \${this.getTestExitButton()}
      </div>
    \`}getLogoButton(){return this.hasAttribute("showLogo")?o\`
      <a
        class="logoButton"
        @click="\${e=>{e.preventDefault(),c.goto("https://www.example.com/")}}"
        href="https://www.example.com/"
        aria-label="Go to example.com"
      >
        <img height="36" src="\${se}" alt="EXAMPLE" />
      </a>
    \`:null}getBackButton(){var e;return this.hasAttribute("showBackButton")?o\`
      <test-mo-button
        @click="\${()=>this.dispatchEvent(new CustomEvent("backButtonClick"))}"
        variant="\${k.tertiary}"
        ssrIcon="\${this.isRTL()?"arrow-right":"arrow-left"}"
        ml="\${this.getAttribute("showLogo")?"mdl":""}"
        iconOnly="\${!0}"
        aria-label="\${((e=this.translations)==null?void 0:e.test.back)??""}"
      ></test-mo-button>
    \`:null}getChoiceSelector(){return g()?o\`
      <test-mo-language-selector
        @change="\${this.onChoiceChange.bind(this)}"
        data-testid="language-selector"
        locale="{getLocale()}"
        mr="s"
      ></test-mo-language-selector>
    \`:null}getAvatarButton(){return g()||!O(this.settings,V.loginEnabled)?null:o\`
      <test-avatar-button
        @buttonClicked="\${()=>this.dispatchEvent(new CustomEvent("buttonClicked"))}"
      ></test-avatar-button>
    \`}getOCButton(){var t;const e=this.isMobile();return e?o\`
      <test-mo-button
        @click="\${()=>this.dispatchEvent(new Event("serviceClick"))}"
        id="open-vpc-btn"
        variant="\${k.secondary}"
        size="\${e?"small":"medium"}"
        >\${((t=this.translations)==null?void 0:t.test.open)??""}</test-mo-button
      >
    \`:null}getTestExitButton(){var i;const e=new R({platform:"test"}),t=this.isMobile();return B()?o\`
      <test-mo-button
        @click="\${()=>e.exitClicked()}"
        id="exit-application-btn"
        variant="\${k.primary}"
        size="\${t?"small":"medium"}"
        style="margin-right: 0.75rem"
        >\${((i=this.translations)==null?void 0:i.test.exitApplication)??""}</test-mo-button
      >
    \`:null}onChoiceChange(){}isRTL(){var e;return((e=this.settings)==null?void 0:e.localisation.writeDirection)===Z.rtl}onManualClick(){}onStartClick(){}onImagesClick(){}isMobile(){return window.innerWidth<=b.mobile.max}};x.observedAttributes=["showLogo","showBackButton","backButtonTarget","visible"];let v=x;window.customElements.define("test-header",v);class le extends Y{}window.customElements.define("test-mo-language-selector",le);const ge=":host{cursor:pointer;display:block}*{box-sizing:border-box}mo-aspect-ratio{display:flex}.image>*{min-height:100%}a{display:flex;flex-direction:column;height:100%;text-decoration:none}a:not(.with-image){border-top:1px solid rgb(var(--colour-neutral-3,223,223,223))}a:not(.with-image) .image{display:none}.info{display:flex;flex-direction:column;padding:1.5rem;padding-inline-start:0}:focus-visible [name=title]::slotted(*),:host(:hover) [name=title]::slotted(*){text-decoration:underline}a:focus:not(:focus-visible){outline:none}a:focus-visible{box-shadow:0 0 0 4px var(--mo-focus-ring-internal,rgb(var(--colour-neutral-1,255,255,255)));outline:2px solid var(--mo-focus-ring-external,rgb(var(--colour-neutral-7,17,17,17)));outline-offset:4px;transition:outline .2s ease-out,box-shadow .2s ease-out}[name=image]::slotted(*){max-height:100%;max-width:100%;min-height:100%;object-fit:cover;width:100%}[name=title]{display:block;margin-top:.5rem}[name=title]::slotted(*){color:rgb(var(--colour-text-and-icon-1,17,17,17));font-size:1.125rem;letter-spacing:-.0042em;line-height:1.444}p{color:rgb(var(--colour-text-and-icon-2,72,72,72));margin:1rem 0 0;padding:0}[name=cta]{display:inline-block;margin-top:1.5rem}[name=label]::slotted(*){color:rgb(var(--colour-text-and-icon-2,72,72,72));font-size:.75rem;line-height:1.5}:host(:not([emphasised])) #btn{display:none}:host(:not([emphasised])) #btn+*{color:rgb(var(--colour-text-and-icon-1,17,17,17));margin-top:-.5rem}:host([emphasised]){background-color:rgb(var(--colour-neutral-2,245,245,245))}:host([emphasised]) a{border-top:0}:host([emphasised]) .info{flex-grow:1;padding-inline-start:1.5rem}:host([emphasised]) #btn{margin-top:1.5rem}:host([emphasised]) #btn+[icon]{display:none}:host([emphasised]) .text-wrapper{flex-grow:1}:host([large]){font-size:1rem;line-height:1.625}:host([large]) [name=title]::slotted(*){font-size:1.5rem;line-height:1.45}:host([expand]) .image{flex-shrink:0}:host([expand]) .info{flex-grow:1}:host([expand]) .text-wrapper{max-width:30rem}@media (min-width:37.5em){:host(:not([expand])) .info{padding-inline-end:10rem}:host(:not([expand])):host([emphasised]) .info{padding:2.5rem;padding-inline-end:7.5rem}:host(:not([expand])):host([emphasised]) [name=cta]{margin-top:1.5rem}:host(:not([expand])) [name=title]::slotted(*){font-size:1.5rem;line-height:1.45}:host(:not([expand])):host([large]) [name=title]::slotted(*){font-size:2.25rem;line-height:1.333}:host(:not([expand])):host([emphasised]) #btn{margin-top:2.5rem}}@media (min-width:75em){:host(:not([expand])) a{flex-direction:row}:host(:not([expand])) .image{flex-basis:60%;max-width:60%}:host(:not([expand])) .info{padding-bottom:0;padding-top:0}:host(:not([expand])) a.with-image .info{flex-basis:40%;max-width:40%;padding-inline-end:4rem;padding-inline-start:3rem}:host(:not([expand])) .text-wrapper{max-width:37.5rem}:host(:not([expand])):host([trailing-image]) .image{order:1}:host(:not([expand])):host([emphasised]) .info{padding:3rem;padding-inline-end:4rem}:host(:not([expand])):host([emphasised]) [name=cta]{margin-top:1.5rem}}:host([inverse]) [name=label]::slotted(*),:host([inverse]) [name=title]::slotted(*),:host([inverse]) p{color:inherit}:host([inverse]) .info{color:#fff}",ce="mo-card[inverse]>*{color:inherit}";function de({html:r,prefixReplacer:e}){const t=document.createElement("template");t.innerHTML=r\`
    <style>
      \${ge}
    </style>
    <a>
      <div class="image">
        <mo-aspect-ratio ratio="wide" id="aspectratio">
          <mo-image>
            <slot name="image"></slot>
          </mo-image>
        </mo-aspect-ratio>
      </div>
      <div class="info">
        <div class="text-wrapper">
          <slot name="label"></slot>
          <slot name="title"></slot>
          <p><slot></slot></p>
        </div>
        <slot name="cta">
          <mo-icon-button
            id="btn"
            inverse
            static-colour
            decorative-only
            size="small"
            ><mo-icon slot="icon" icon="arrow-right" flip-rtl></mo-icon
          ></mo-icon-button>
          <mo-icon icon="arrow-right" flip-rtl></mo-icon>
        </slot>
      </div>
    </a>
    <slot name="light-styles"></slot>
  \`;const i=document.createElement("style");return i.slot="light-styles",i.innerHTML=e(ce.toString()),{main:t,lightStyleTemplate:i}}class h extends N{constructor(){super(),this.handleImageMode=()=>{this.anchor.classList.toggle("with-image",!!this.imageSlot.assignedNodes({flatten:!0}).length)},this.syncInverseLightStyle=()=>{this.inverse?this.append(this.__lightStyleNode):this.__lightStyleNode.remove()},j(["url","emphasised","large","expand","target","inverse","trailingImage","imageRatio"],this);const e=this.shadow=this.attachShadow({mode:"open",delegatesFocus:!0}),t=this.getTemplates(de);e.append(t.main.content.cloneNode(!0)),this.imageSlot=e.querySelector("[name=image]"),this.imageSlot.addEventListener("slotchange",this.handleImageMode),this.aspectRatio=e.getElementById("aspectratio"),this.__lightStyleNode=t.lightStyleTemplate.cloneNode(!0)}connectedCallback(){K(this),this.syncInverseLightStyle()}get anchor(){return this.shadow.querySelector("a")}get emphasised(){return this.hasAttribute("emphasised")}set emphasised(e){this.toggleAttribute("emphasised",!!e)}get large(){return this.hasAttribute("large")}set large(e){this.toggleAttribute("large",!!e)}get expand(){return this.hasAttribute("expand")}set expand(e){this.toggleAttribute("expand",!!e)}get trailingImage(){return this.hasAttribute("trailing-image")}set trailingImage(e){this.toggleAttribute("trailing-image",!!e)}set url(e){e?this.setAttribute("url",e):this.removeAttribute("url")}get url(){return this.getAttribute("url")}set target(e){e?this.setAttribute("target",e):this.removeAttribute("target")}get target(){return this.anchor.getAttribute("target")}get inverse(){return this.hasAttribute("inverse")}set inverse(e){this.toggleAttribute("inverse",!!e)}set imageRatio(e){e?this.aspectRatio.ratio=e:this.aspectRatio.ratio="wide"}get imageRatio(){return this.aspectRatio.getAttribute("ratio")||"wide"}attributeChangedCallback(e,t,i){e==="url"?i?this.anchor.setAttribute("href",i):this.anchor.removeAttribute("href"):e==="target"?i?this.anchor.setAttribute("target",i):this.anchor.removeAttribute("target"):e==="image-ratio"?i?this.aspectRatio.ratio=i:this.aspectRatio.ratio="wide":e==="inverse"&&this.syncInverseLightStyle()}}h.moTagName="card";h.moDependencies=[Q,H,ee,te];h.moIconDependencies=[I];h.observedAttributes=["url","inverse","target","image-ratio"];q(h);class he extends h{}window.customElements.define("test-mo-card",he);class me{static async getConfig(e){switch(e){case"test":return(await a(async()=>{const{default:t}=await import("./test-BY1dCHQi.js");return{default:t}},__vite__mapDeps([9,10]))).default;case"test":return(await a(async()=>{const{default:t}=await import("./test-Cd0OuqPp.js");return{default:t}},__vite__mapDeps([11,10]))).default;case"test":return(await a(async()=>{const{default:t}=await import("./test-D25rLxjc.js");return{default:t}},__vite__mapDeps([12,10]))).default;case"test":return(await a(async()=>{const{default:t}=await import("./test-DnBXNr7O.js");return{default:t}},__vite__mapDeps([13,10]))).default;case"test":return(await a(async()=>{const{default:t}=await import("./test-inuuqIOP.js");return{default:t}},__vite__mapDeps([14,10]))).default;case"test":return(await a(async()=>{const{default:t}=await import("./test-BOxWudPX.js");return{default:t}},__vite__mapDeps([15,10]))).default;case"test":return(await a(async()=>{const{default:t}=await import("./test-BWME_xib.js");return{default:t}},__vite__mapDeps([16,10]))).default;case"test":return(await a(async()=>{const{default:t}=await import("./test-CsDigEG0.js");return{default:t}},[])).default;case"test":return(await a(async()=>{const{default:t}=await import("./test-BkT8Eqai.js");return{default:t}},__vite__mapDeps([17,10]))).default;case"test":return(await a(async()=>{const{default:t}=await import("./test-8ntVW3Sr.js");return{default:t}},__vite__mapDeps([18,10]))).default;case"test":return(await a(async()=>{const{default:t}=await import("./test-CzkC7444.js");return{default:t}},__vite__mapDeps([19,10]))).default;case"test":return(await a(async()=>{const{default:t}=await import("./test-BdWyzcmt.js");return{default:t}},__vite__mapDeps([20,10]))).default;default:throw new Error(\`Failed to load landing page config for list "\${e}": No landing page config found.\`)}}}class z extends HTMLElement{constructor(){super(),this.translations=null,this.settings=null,this.resizeTimeout=null,this.resizeListener=(()=>{clearTimeout(this.resizeTimeout),this.resizeTimeout=setTimeout(()=>this.render())}).bind(this),this.homeConfig=null,this.serviceVisible=!1,this.attachShadow({mode:"open"})}async connectedCallback(){window.addEventListener("resize",this.resizeListener),c.connect(),g()&&S.connect();const e=new URLSearchParams(location.search),t=e.get("state");e.has("code")&&t==="service"&&(e.delete("state"),c.replace(\`\${location.href.split("?")[0]}?\${e}\`),this.serviceVisible=!0);const i=M(c.getHistory()[0]);f.sendNavigation({toURL:window.location.href,fromURL:c.getHistory()[0]||"",userLeftFromBackButton:i===$.planner||i===$.example}),this.render(),await Promise.all([a(()=>import("./Grid-BgS5-T1x.js"),__vite__mapDeps([21,2,3,22])),a(()=>import("./ContentMargin-1jDUK1kE.js"),__vite__mapDeps([23,1,2,3,22,5,24,4,25,26,7,27,28,29])),a(()=>import("./BannerMessage-1AfPgQtA.js"),__vite__mapDeps([30,2,3,31,5,4,32,25,33,1,22,24,26,7,27,28,29])),a(()=>import("./HomeGrid-D4PHTTN7.js"),__vite__mapDeps([34,2,3,22,1,5,24,4,25,26,7,27,28,29])),a(()=>import("./HomeImages-m6SThIqd.js").then(n=>n.L),__vite__mapDeps([35,2,3,5,22,36,37,38,39,40,4,41,42,43,44,45,46,47,48,26,7,49,50,51,52,1])),a(()=>import("./ServiceModal-B38FtOmo.js"),__vite__mapDeps([53,2,3,54,41,5,6,4,31,42,45,55,39,56,57,32,58,50,51,52,59,33,28])),(async()=>{this.settings=await A(),g()&&(new X({settings:this.settings}).clearZipCode(),new J({settings:this.settings}).setStoreId(G()||"")),this.render()})(),(async()=>{this.translations=await C(),this.render()})(),(async()=>{this.homeConfig=await me.getConfig(_()),this.render()})()]),a(()=>import("./Test-uBcfBNpa.js"),__vite__mapDeps([60,1,2,3,5,61,62,38,39,40,4,41,42,48,33,7,63,64,25,22]))}async disconnectedCallback(){clearTimeout(this.resizeTimeout),window.removeEventListener("resize",this.resizeListener),g()&&S.disconnect()}render(){P(this.getTemplate(),this.shadowRoot)}getTemplate(){var s,l;const e=((s=this.settings)==null?void 0:s.images.test)??"",t=this.isMobile(),i=W().get("testImages")==="true"&&!!e,n=!i;return o\`
      <style>
        \${oe}
      </style>
      <test-content-margin>
        <div class="container">
          <test-header
            @backButtonClick="\${this.onBackButtonClick.bind(this)}"
            @serviceClick="\${this.onServiceClick.bind(this)}"
            @buttonClicked="\${this.onServiceClick.bind(this)}"
            ?showLogo="\${n}"
            ?showBackButton="\${i}"
          ></test-header>
          <div class="gridContainer">
            <test-grid columns="1" ?slim="\${!0}"
              ><test-banner-message></test-banner-message
            ></test-grid>
            <test-grid columns="2" ?slim="\${!0}" style="margin-bottom: 1.5rem;">
              <div class="listTitleBackgroundContainer">
                \${t?"":o\`
                      <test-mo-image
                        .theme="\${d}"
                        .src="\${((l=this.homeConfig)==null?void 0:l.listItems.backgroundImgUrl)??null}"
                        .alt="\${""}"
                      ></test-mo-image>
                    \`}
                <div class="titleWrapper">\${this.getTitle()}</div>
              </div>

              <test-home-page-grid
                @service="\${this.onServiceClick.bind(this)}"
              ></test-home-page-grid>
            </test-grid>
            \${this.getHomeImages()}
          </div>
        </div>
      </test-content-margin>
    \`}getHomeImages(){var n,s,l,m,p,u,y,T,L;const e=_(),t=this.isMobile(),i=((s=(n=this.settings)==null?void 0:n.general)==null?void 0:s.bookServiceEnabled)&&!g();return o\`
      <test-grid columns="1" style="display: block;">
        <test-home-page-gallery></test-home-page-gallery>
        \${e==="test"&&t?o\`
              <a
                @click="\${this.onManualClick.bind(this)}"
                href="\${\`example/\${location.search}\`}"
                class="linkWrapper"
                style="display: block; padding-top: 1.5rem;"
              >
                <test-mo-card
                  style="\${"background-color: #CDD9EB;"}"
                  ?expand="\${!t}"
                  data-testid="item-example"
                >
                  <h2 slot="title">
                    \${((m=this.translations)==null?void 0:m.test.homeManualTitle)??""}
                  </h2>
                  <test-mo-text .theme="\${d}">
                    \${(p=this.translations)==null?void 0:p.test.homeManualDescription}
                  </test-mo-text>
                </test-mo-card>
              </a>
            \`:""}
        \${i&&o\`
            <a
              href="\${((u=this.settings)==null?void 0:u.mo.urls.supportBookingLink.replace("{code}",""))??""}"
              @click="\${this.onServiceClick.bind(this)}"
              target="_blank"
              class="linkWrapper"
              style="display: block; padding-top: 1.5rem;"
            >
              <test-mo-card
                style="\${"background-color: #F5F5F5;"}"
                emphasised
                ?expand="\${!t}"
                data-testid="card-book-service-session"
              >
                <h2 slot="title">\${((T=this.translations)==null?void 0:T.test.serviceSession)??""}</h2>
                <test-mo-text .theme="\${d}">
                  \${(L=this.translations)==null?void 0:L.test.serviceSessionDescription}
                </test-mo-text>
              </test-mo-card>
            </a>
          \`||""}
      </test-grid>
      <test-open-modal
        @close="\${this.onServiceClose.bind(this)}"
        ?visible="\${this.serviceVisible}"
      ></test-open-modal>
    \`}getTitle(){var i,n,s,l,m,p,u;const e=_().toUpperCase();if(this.isMobile())return o\`
        <h2>
          <test-mo-text
            style="font-size: 36px;"
            .type="\${E.static}"
            .theme="\${d}"
          >
            \${(i=this.translations)==null?void 0:i.test.a}
            <b>\${e}</b>
            \${e==="TEST"?(n=this.translations)==null?void 0:n.test.b:(s=this.translations)==null?void 0:s.test.c}
          </test-mo-text>
        </h2>
      \`;const t=((l=this.homeConfig)==null?void 0:l.listItems.titleTextColor)||"#111";return o\`
      <h2>
        <test-mo-text
          style="\${\`color: \${t}; font-size: 80px;\`}"
          .type="\${E.static}"
          .theme="\${d}"
        >
          \${(m=this.translations)==null?void 0:m.test.d}
          <b>\${e}</b>
          \${e==="TEST"?(p=this.translations)==null?void 0:p.test.e:(u=this.translations)==null?void 0:u.test.f}
        </test-mo-text>
      </h2>
    \`}onManualClick(e){f.sendHomeSelectStart("example"),e.preventDefault(),c.goto(\`example/\${location.search}\`)}onServiceClick(){f.sendBookService(w.home)}onServiceClose(){var t,i;this.serviceVisible=!1,this.render();const e=((i=(t=this.settings)==null?void 0:t.general)==null?void 0:i.enableHome)??!1;f.sendToggleModal({modal:e?"ServiceModal":"LoadModal",visible:!1,source:w.home})}onServiceClick(){var t,i;const e=((i=(t=this.settings)==null?void 0:t.general)==null?void 0:i.enableHome)??!1;f.sendToggleModal({modal:e?"ServiceModal":"LoadModal",visible:!0,source:w.home}),this.serviceVisible=!0,this.render()}onBackButtonClick(){var i;const e=new R({platform:"test"}),t=((i=this.settings)==null?void 0:i.test.test)??"";t.startsWith("/")?window.history.pushState(null,t):t.startsWith("http")&&window.location.replace(t),B()&&e.backClicked()}isMobile(){return window.innerWidth<=b.mobile.max}}window.customElements.define("test-home-page",z);const Ee=Object.freeze(Object.defineProperty({__proto__:null,default:z},Symbol.toStringTag,{value:"Module"}));export{me as L,Ee as a,D as c,$e as h};
`;

			const compiler = new ECMAScriptModuleCompiler(window);
			const result = compiler.compile('http://localhost:8080/js/app/main.js', code);

			expect(result.imports).toEqual([
				{
					type: 'esm',
					url: 'http://localhost:8080/js/app/preload-helper-BMSd6Up6.js'
				},
				{
					type: 'esm',
					url: 'http://localhost:8080/js/app/Router-yzXgKzu7.js'
				},
				{
					type: 'esm',
					url: 'http://localhost:8080/js/app/sizes-1ww1H62B.js'
				},
				{
					type: 'esm',
					url: 'http://localhost:8080/js/app/Choice-Bixrh5CR.js'
				},
				{
					type: 'esm',
					url: 'http://localhost:8080/js/app/index-OjqIgG3h.js'
				},
				{
					type: 'esm',
					url: 'http://localhost:8080/js/app/arrow-left-DVwQ9ese.js'
				},
				{
					type: 'esm',
					url: 'http://localhost:8080/js/app/Image-CMZuFGwN.js'
				}
			]);

			expect(result.execute.toString()).toBe(`async function anonymous($happy_dom) {
//# sourceURL=http://localhost:8080/js/app/main.js
const __vite__mapDeps=(i,m=__vite__mapDeps,d=(m.f||(m.f=["static/js/preload-helper-BMSd6Up6.js","static/js/Router-yzXgKzu7.js","static/js/_commonjsHelpers-BosuxZz1.js","static/js/Choice-Bixrh5CR.js","static/js/index-OjqIgG3h.js","static/js/arrow-left-DVwQ9ese.js","static/js/Image-CMZuFGwN.js","static/js/IdGenerator-BXAguRov.js","static/js/resizeListener-BpJMTz31.js","static/js/menu-BQ9iRMnL.js","static/js/menu-DGNLEQ8L.js"])))=>i.map(i=>d[i]);
const {_: a} = $happy_dom.imports.get('http://localhost:8080/js/app/preload-helper-BMSd6Up6.js');const {k: g,s: A,r: C,t: P,h: o,R: c,m: O,F: V,u: B,n: M,A: f,P: $,v: G,w: _,q: W} = $happy_dom.imports.get('http://localhost:8080/js/app/Router-yzXgKzu7.js');const {s: b} = $happy_dom.imports.get('http://localhost:8080/js/app/sizes-1ww1H62B.js');const {C: F,S: d,r: U,b: I,I: H,s: N,g: j,i: K,d: q,T: E} = $happy_dom.imports.get('http://localhost:8080/js/app/Choice-Bixrh5CR.js');const {K: R,W: Z} = $happy_dom.imports.get('http://localhost:8080/js/app/index-OjqIgG3h.js');const {I: te} = $happy_dom.imports.get('http://localhost:8080/js/app/Image-CMZuFGwN.js');const ie=[["&","&amp"],["<","&lt"],[">","&gt"],['"',"&quot"],["'","&#x27"],["/","&#x2F"]];class ae{static encodeForAttribute(e){for(const t of ie)e=e.replace(new RegExp(t[0],"gm"),t[1]+";");return e}}class ne{static templateToString(e,...t){let i="";for(let n=0,s=e.length;n<s;n++)i+=e[n],n<s-1&&t[n]!==null&&(i.endsWith('="')||i.endsWith("='")?i+=ae.encodeForAttribute(String(t[n])):i+=String(t[n]));return i}}const $e=ne.templateToString,D=F.templateToString,oe=D\`
  *,
  *:before,
  *:after {
    box-sizing: border-box;
  }

  h2 {
    margin: 0;
  }

  .container {
    width: 100%;
    height: 100%;
    line-height: 1.571;
  }

  .linkWrapper {
    text-decoration: none;
    color: #ccc;
  }

  @media screen and (max-width: 1200px) {
    .container {
      margin-bottom: 2rem;
    }
  }
\`,se="data:image/svg+xml,%3csvg%20width='100'%20height='40'%3e/%3e%3c/g%3e%3c/svg%3e",re=D\`
  *,
  *:before,
  *:after {
    box-sizing: border-box;
  }

  :host {
    display: flex;
  }

  .content {
    margin-left: auto;
    display: flex;
    align-items: center;
    height: 100%;
  }

  @media screen and (max-width: 400px) {
    :host {
      height: 3.75rem;
    }
  }

  @media print {
    :host {
      visibility: hidden;
      display: none;
    }
  }
\`;U(I);const x=class x extends HTMLElement{constructor(){super(),this.settings=null,this.translations=null,this.resizeTimeout=null,this.resizeListener=(()=>{clearTimeout(this.resizeTimeout),this.resizeTimeout=setTimeout(()=>this.render())}).bind(this),this.attachShadow({mode:"open"})}async connectedCallback(){window.addEventListener("resize",this.resizeListener),this.render(),await Promise.all([(async()=>{this.settings=await A(),this.render()})(),(async()=>{this.translations=await C(),this.render()})(),a(()=>$happy_dom.dynamicImport("./AvatarButton-DpAonoMJ.js"),__vite__mapDeps([0,1,2,3,4,5,6,7,8]))])}disconnectedCallback(){clearTimeout(this.resizeTimeout),window.removeEventListener("resize",this.resizeListener)}attributeChangedCallback(){this.render()}render(){P(this.getTemplate(),this.shadowRoot)}getTemplate(){return o\`
      <style>
        \${re}
      </style>
      \${this.getLogoButton()} \${this.getBackButton()}
      <div class="content">
        \${this.getChoiceSelector()} \${this.getAvatarButton()}
        \${this.getOCButton()} \${this.getTestExitButton()}
      </div>
    \`}getLogoButton(){return this.hasAttribute("showLogo")?o\`
      <a
        class="logoButton"
        @click="\${e=>{e.preventDefault(),c.goto("https://www.example.com/")}}"
        href="https://www.example.com/"
        aria-label="Go to example.com"
      >
        <img height="36" src="\${se}" alt="EXAMPLE" />
      </a>
    \`:null}getBackButton(){var e;return this.hasAttribute("showBackButton")?o\`
      <test-mo-button
        @click="\${()=>this.dispatchEvent(new CustomEvent("backButtonClick"))}"
        variant="\${k.tertiary}"
        ssrIcon="\${this.isRTL()?"arrow-right":"arrow-left"}"
        ml="\${this.getAttribute("showLogo")?"mdl":""}"
        iconOnly="\${!0}"
        aria-label="\${((e=this.translations)==null?void 0:e.test.back)??""}"
      ></test-mo-button>
    \`:null}getChoiceSelector(){return g()?o\`
      <test-mo-language-selector
        @change="\${this.onChoiceChange.bind(this)}"
        data-testid="language-selector"
        locale="{getLocale()}"
        mr="s"
      ></test-mo-language-selector>
    \`:null}getAvatarButton(){return g()||!O(this.settings,V.loginEnabled)?null:o\`
      <test-avatar-button
        @buttonClicked="\${()=>this.dispatchEvent(new CustomEvent("buttonClicked"))}"
      ></test-avatar-button>
    \`}getOCButton(){var t;const e=this.isMobile();return e?o\`
      <test-mo-button
        @click="\${()=>this.dispatchEvent(new Event("serviceClick"))}"
        id="open-vpc-btn"
        variant="\${k.secondary}"
        size="\${e?"small":"medium"}"
        >\${((t=this.translations)==null?void 0:t.test.open)??""}</test-mo-button
      >
    \`:null}getTestExitButton(){var i;const e=new R({platform:"test"}),t=this.isMobile();return B()?o\`
      <test-mo-button
        @click="\${()=>e.exitClicked()}"
        id="exit-application-btn"
        variant="\${k.primary}"
        size="\${t?"small":"medium"}"
        style="margin-right: 0.75rem"
        >\${((i=this.translations)==null?void 0:i.test.exitApplication)??""}</test-mo-button
      >
    \`:null}onChoiceChange(){}isRTL(){var e;return((e=this.settings)==null?void 0:e.localisation.writeDirection)===Z.rtl}onManualClick(){}onStartClick(){}onImagesClick(){}isMobile(){return window.innerWidth<=b.mobile.max}};x.observedAttributes=["showLogo","showBackButton","backButtonTarget","visible"];let v=x;window.customElements.define("test-header",v);class le extends Y{}window.customElements.define("test-mo-language-selector",le);const ge=":host{cursor:pointer;display:block}*{box-sizing:border-box}mo-aspect-ratio{display:flex}.image>*{min-height:100%}a{display:flex;flex-direction:column;height:100%;text-decoration:none}a:not(.with-image){border-top:1px solid rgb(var(--colour-neutral-3,223,223,223))}a:not(.with-image) .image{display:none}.info{display:flex;flex-direction:column;padding:1.5rem;padding-inline-start:0}:focus-visible [name=title]::slotted(*),:host(:hover) [name=title]::slotted(*){text-decoration:underline}a:focus:not(:focus-visible){outline:none}a:focus-visible{box-shadow:0 0 0 4px var(--mo-focus-ring-internal,rgb(var(--colour-neutral-1,255,255,255)));outline:2px solid var(--mo-focus-ring-external,rgb(var(--colour-neutral-7,17,17,17)));outline-offset:4px;transition:outline .2s ease-out,box-shadow .2s ease-out}[name=image]::slotted(*){max-height:100%;max-width:100%;min-height:100%;object-fit:cover;width:100%}[name=title]{display:block;margin-top:.5rem}[name=title]::slotted(*){color:rgb(var(--colour-text-and-icon-1,17,17,17));font-size:1.125rem;letter-spacing:-.0042em;line-height:1.444}p{color:rgb(var(--colour-text-and-icon-2,72,72,72));margin:1rem 0 0;padding:0}[name=cta]{display:inline-block;margin-top:1.5rem}[name=label]::slotted(*){color:rgb(var(--colour-text-and-icon-2,72,72,72));font-size:.75rem;line-height:1.5}:host(:not([emphasised])) #btn{display:none}:host(:not([emphasised])) #btn+*{color:rgb(var(--colour-text-and-icon-1,17,17,17));margin-top:-.5rem}:host([emphasised]){background-color:rgb(var(--colour-neutral-2,245,245,245))}:host([emphasised]) a{border-top:0}:host([emphasised]) .info{flex-grow:1;padding-inline-start:1.5rem}:host([emphasised]) #btn{margin-top:1.5rem}:host([emphasised]) #btn+[icon]{display:none}:host([emphasised]) .text-wrapper{flex-grow:1}:host([large]){font-size:1rem;line-height:1.625}:host([large]) [name=title]::slotted(*){font-size:1.5rem;line-height:1.45}:host([expand]) .image{flex-shrink:0}:host([expand]) .info{flex-grow:1}:host([expand]) .text-wrapper{max-width:30rem}@media (min-width:37.5em){:host(:not([expand])) .info{padding-inline-end:10rem}:host(:not([expand])):host([emphasised]) .info{padding:2.5rem;padding-inline-end:7.5rem}:host(:not([expand])):host([emphasised]) [name=cta]{margin-top:1.5rem}:host(:not([expand])) [name=title]::slotted(*){font-size:1.5rem;line-height:1.45}:host(:not([expand])):host([large]) [name=title]::slotted(*){font-size:2.25rem;line-height:1.333}:host(:not([expand])):host([emphasised]) #btn{margin-top:2.5rem}}@media (min-width:75em){:host(:not([expand])) a{flex-direction:row}:host(:not([expand])) .image{flex-basis:60%;max-width:60%}:host(:not([expand])) .info{padding-bottom:0;padding-top:0}:host(:not([expand])) a.with-image .info{flex-basis:40%;max-width:40%;padding-inline-end:4rem;padding-inline-start:3rem}:host(:not([expand])) .text-wrapper{max-width:37.5rem}:host(:not([expand])):host([trailing-image]) .image{order:1}:host(:not([expand])):host([emphasised]) .info{padding:3rem;padding-inline-end:4rem}:host(:not([expand])):host([emphasised]) [name=cta]{margin-top:1.5rem}}:host([inverse]) [name=label]::slotted(*),:host([inverse]) [name=title]::slotted(*),:host([inverse]) p{color:inherit}:host([inverse]) .info{color:#fff}",ce="mo-card[inverse]>*{color:inherit}";function de({html:r,prefixReplacer:e}){const t=document.createElement("template");t.innerHTML=r\`
    <style>
      \${ge}
    </style>
    <a>
      <div class="image">
        <mo-aspect-ratio ratio="wide" id="aspectratio">
          <mo-image>
            <slot name="image"></slot>
          </mo-image>
        </mo-aspect-ratio>
      </div>
      <div class="info">
        <div class="text-wrapper">
          <slot name="label"></slot>
          <slot name="title"></slot>
          <p><slot></slot></p>
        </div>
        <slot name="cta">
          <mo-icon-button
            id="btn"
            inverse
            static-colour
            decorative-only
            size="small"
            ><mo-icon slot="icon" icon="arrow-right" flip-rtl></mo-icon
          ></mo-icon-button>
          <mo-icon icon="arrow-right" flip-rtl></mo-icon>
        </slot>
      </div>
    </a>
    <slot name="light-styles"></slot>
  \`;const i=document.createElement("style");return i.slot="light-styles",i.innerHTML=e(ce.toString()),{main:t,lightStyleTemplate:i}}class h extends N{constructor(){super(),this.handleImageMode=()=>{this.anchor.classList.toggle("with-image",!!this.imageSlot.assignedNodes({flatten:!0}).length)},this.syncInverseLightStyle=()=>{this.inverse?this.append(this.__lightStyleNode):this.__lightStyleNode.remove()},j(["url","emphasised","large","expand","target","inverse","trailingImage","imageRatio"],this);const e=this.shadow=this.attachShadow({mode:"open",delegatesFocus:!0}),t=this.getTemplates(de);e.append(t.main.content.cloneNode(!0)),this.imageSlot=e.querySelector("[name=image]"),this.imageSlot.addEventListener("slotchange",this.handleImageMode),this.aspectRatio=e.getElementById("aspectratio"),this.__lightStyleNode=t.lightStyleTemplate.cloneNode(!0)}connectedCallback(){K(this),this.syncInverseLightStyle()}get anchor(){return this.shadow.querySelector("a")}get emphasised(){return this.hasAttribute("emphasised")}set emphasised(e){this.toggleAttribute("emphasised",!!e)}get large(){return this.hasAttribute("large")}set large(e){this.toggleAttribute("large",!!e)}get expand(){return this.hasAttribute("expand")}set expand(e){this.toggleAttribute("expand",!!e)}get trailingImage(){return this.hasAttribute("trailing-image")}set trailingImage(e){this.toggleAttribute("trailing-image",!!e)}set url(e){e?this.setAttribute("url",e):this.removeAttribute("url")}get url(){return this.getAttribute("url")}set target(e){e?this.setAttribute("target",e):this.removeAttribute("target")}get target(){return this.anchor.getAttribute("target")}get inverse(){return this.hasAttribute("inverse")}set inverse(e){this.toggleAttribute("inverse",!!e)}set imageRatio(e){e?this.aspectRatio.ratio=e:this.aspectRatio.ratio="wide"}get imageRatio(){return this.aspectRatio.getAttribute("ratio")||"wide"}attributeChangedCallback(e,t,i){e==="url"?i?this.anchor.setAttribute("href",i):this.anchor.removeAttribute("href"):e==="target"?i?this.anchor.setAttribute("target",i):this.anchor.removeAttribute("target"):e==="image-ratio"?i?this.aspectRatio.ratio=i:this.aspectRatio.ratio="wide":e==="inverse"&&this.syncInverseLightStyle()}}h.moTagName="card";h.moDependencies=[Q,H,ee,te];h.moIconDependencies=[I];h.observedAttributes=["url","inverse","target","image-ratio"];q(h);class he extends h{}window.customElements.define("test-mo-card",he);class me{static async getConfig(e){switch(e){case"test":return(await a(async()=>{const{default:t}=await $happy_dom.dynamicImport("./test-BY1dCHQi.js");return{default:t}},__vite__mapDeps([9,10]))).default;case"test":return(await a(async()=>{const{default:t}=await $happy_dom.dynamicImport("./test-Cd0OuqPp.js");return{default:t}},__vite__mapDeps([11,10]))).default;case"test":return(await a(async()=>{const{default:t}=await $happy_dom.dynamicImport("./test-D25rLxjc.js");return{default:t}},__vite__mapDeps([12,10]))).default;case"test":return(await a(async()=>{const{default:t}=await $happy_dom.dynamicImport("./test-DnBXNr7O.js");return{default:t}},__vite__mapDeps([13,10]))).default;case"test":return(await a(async()=>{const{default:t}=await $happy_dom.dynamicImport("./test-inuuqIOP.js");return{default:t}},__vite__mapDeps([14,10]))).default;case"test":return(await a(async()=>{const{default:t}=await $happy_dom.dynamicImport("./test-BOxWudPX.js");return{default:t}},__vite__mapDeps([15,10]))).default;case"test":return(await a(async()=>{const{default:t}=await $happy_dom.dynamicImport("./test-BWME_xib.js");return{default:t}},__vite__mapDeps([16,10]))).default;case"test":return(await a(async()=>{const{default:t}=await $happy_dom.dynamicImport("./test-CsDigEG0.js");return{default:t}},[])).default;case"test":return(await a(async()=>{const{default:t}=await $happy_dom.dynamicImport("./test-BkT8Eqai.js");return{default:t}},__vite__mapDeps([17,10]))).default;case"test":return(await a(async()=>{const{default:t}=await $happy_dom.dynamicImport("./test-8ntVW3Sr.js");return{default:t}},__vite__mapDeps([18,10]))).default;case"test":return(await a(async()=>{const{default:t}=await $happy_dom.dynamicImport("./test-CzkC7444.js");return{default:t}},__vite__mapDeps([19,10]))).default;case"test":return(await a(async()=>{const{default:t}=await $happy_dom.dynamicImport("./test-BdWyzcmt.js");return{default:t}},__vite__mapDeps([20,10]))).default;default:throw new Error(\`Failed to load landing page config for list "\${e}": No landing page config found.\`)}}}class z extends HTMLElement{constructor(){super(),this.translations=null,this.settings=null,this.resizeTimeout=null,this.resizeListener=(()=>{clearTimeout(this.resizeTimeout),this.resizeTimeout=setTimeout(()=>this.render())}).bind(this),this.homeConfig=null,this.serviceVisible=!1,this.attachShadow({mode:"open"})}async connectedCallback(){window.addEventListener("resize",this.resizeListener),c.connect(),g()&&S.connect();const e=new URLSearchParams(location.search),t=e.get("state");e.has("code")&&t==="service"&&(e.delete("state"),c.replace(\`\${location.href.split("?")[0]}?\${e}\`),this.serviceVisible=!0);const i=M(c.getHistory()[0]);f.sendNavigation({toURL:window.location.href,fromURL:c.getHistory()[0]||"",userLeftFromBackButton:i===$.planner||i===$.example}),this.render(),await Promise.all([a(()=>$happy_dom.dynamicImport("./Grid-BgS5-T1x.js"),__vite__mapDeps([21,2,3,22])),a(()=>$happy_dom.dynamicImport("./ContentMargin-1jDUK1kE.js"),__vite__mapDeps([23,1,2,3,22,5,24,4,25,26,7,27,28,29])),a(()=>$happy_dom.dynamicImport("./BannerMessage-1AfPgQtA.js"),__vite__mapDeps([30,2,3,31,5,4,32,25,33,1,22,24,26,7,27,28,29])),a(()=>$happy_dom.dynamicImport("./HomeGrid-D4PHTTN7.js"),__vite__mapDeps([34,2,3,22,1,5,24,4,25,26,7,27,28,29])),a(()=>$happy_dom.dynamicImport("./HomeImages-m6SThIqd.js").then(n=>n.L),__vite__mapDeps([35,2,3,5,22,36,37,38,39,40,4,41,42,43,44,45,46,47,48,26,7,49,50,51,52,1])),a(()=>$happy_dom.dynamicImport("./ServiceModal-B38FtOmo.js"),__vite__mapDeps([53,2,3,54,41,5,6,4,31,42,45,55,39,56,57,32,58,50,51,52,59,33,28])),(async()=>{this.settings=await A(),g()&&(new X({settings:this.settings}).clearZipCode(),new J({settings:this.settings}).setStoreId(G()||"")),this.render()})(),(async()=>{this.translations=await C(),this.render()})(),(async()=>{this.homeConfig=await me.getConfig(_()),this.render()})()]),a(()=>$happy_dom.dynamicImport("./Test-uBcfBNpa.js"),__vite__mapDeps([60,1,2,3,5,61,62,38,39,40,4,41,42,48,33,7,63,64,25,22]))}async disconnectedCallback(){clearTimeout(this.resizeTimeout),window.removeEventListener("resize",this.resizeListener),g()&&S.disconnect()}render(){P(this.getTemplate(),this.shadowRoot)}getTemplate(){var s,l;const e=((s=this.settings)==null?void 0:s.images.test)??"",t=this.isMobile(),i=W().get("testImages")==="true"&&!!e,n=!i;return o\`
      <style>
        \${oe}
      </style>
      <test-content-margin>
        <div class="container">
          <test-header
            @backButtonClick="\${this.onBackButtonClick.bind(this)}"
            @serviceClick="\${this.onServiceClick.bind(this)}"
            @buttonClicked="\${this.onServiceClick.bind(this)}"
            ?showLogo="\${n}"
            ?showBackButton="\${i}"
          ></test-header>
          <div class="gridContainer">
            <test-grid columns="1" ?slim="\${!0}"
              ><test-banner-message></test-banner-message
            ></test-grid>
            <test-grid columns="2" ?slim="\${!0}" style="margin-bottom: 1.5rem;">
              <div class="listTitleBackgroundContainer">
                \${t?"":o\`
                      <test-mo-image
                        .theme="\${d}"
                        .src="\${((l=this.homeConfig)==null?void 0:l.listItems.backgroundImgUrl)??null}"
                        .alt="\${""}"
                      ></test-mo-image>
                    \`}
                <div class="titleWrapper">\${this.getTitle()}</div>
              </div>

              <test-home-page-grid
                @service="\${this.onServiceClick.bind(this)}"
              ></test-home-page-grid>
            </test-grid>
            \${this.getHomeImages()}
          </div>
        </div>
      </test-content-margin>
    \`}getHomeImages(){var n,s,l,m,p,u,y,T,L;const e=_(),t=this.isMobile(),i=((s=(n=this.settings)==null?void 0:n.general)==null?void 0:s.bookServiceEnabled)&&!g();return o\`
      <test-grid columns="1" style="display: block;">
        <test-home-page-gallery></test-home-page-gallery>
        \${e==="test"&&t?o\`
              <a
                @click="\${this.onManualClick.bind(this)}"
                href="\${\`example/\${location.search}\`}"
                class="linkWrapper"
                style="display: block; padding-top: 1.5rem;"
              >
                <test-mo-card
                  style="\${"background-color: #CDD9EB;"}"
                  ?expand="\${!t}"
                  data-testid="item-example"
                >
                  <h2 slot="title">
                    \${((m=this.translations)==null?void 0:m.test.homeManualTitle)??""}
                  </h2>
                  <test-mo-text .theme="\${d}">
                    \${(p=this.translations)==null?void 0:p.test.homeManualDescription}
                  </test-mo-text>
                </test-mo-card>
              </a>
            \`:""}
        \${i&&o\`
            <a
              href="\${((u=this.settings)==null?void 0:u.mo.urls.supportBookingLink.replace("{code}",""))??""}"
              @click="\${this.onServiceClick.bind(this)}"
              target="_blank"
              class="linkWrapper"
              style="display: block; padding-top: 1.5rem;"
            >
              <test-mo-card
                style="\${"background-color: #F5F5F5;"}"
                emphasised
                ?expand="\${!t}"
                data-testid="card-book-service-session"
              >
                <h2 slot="title">\${((T=this.translations)==null?void 0:T.test.serviceSession)??""}</h2>
                <test-mo-text .theme="\${d}">
                  \${(L=this.translations)==null?void 0:L.test.serviceSessionDescription}
                </test-mo-text>
              </test-mo-card>
            </a>
          \`||""}
      </test-grid>
      <test-open-modal
        @close="\${this.onServiceClose.bind(this)}"
        ?visible="\${this.serviceVisible}"
      ></test-open-modal>
    \`}getTitle(){var i,n,s,l,m,p,u;const e=_().toUpperCase();if(this.isMobile())return o\`
        <h2>
          <test-mo-text
            style="font-size: 36px;"
            .type="\${E.static}"
            .theme="\${d}"
          >
            \${(i=this.translations)==null?void 0:i.test.a}
            <b>\${e}</b>
            \${e==="TEST"?(n=this.translations)==null?void 0:n.test.b:(s=this.translations)==null?void 0:s.test.c}
          </test-mo-text>
        </h2>
      \`;const t=((l=this.homeConfig)==null?void 0:l.listItems.titleTextColor)||"#111";return o\`
      <h2>
        <test-mo-text
          style="\${\`color: \${t}; font-size: 80px;\`}"
          .type="\${E.static}"
          .theme="\${d}"
        >
          \${(m=this.translations)==null?void 0:m.test.d}
          <b>\${e}</b>
          \${e==="TEST"?(p=this.translations)==null?void 0:p.test.e:(u=this.translations)==null?void 0:u.test.f}
        </test-mo-text>
      </h2>
    \`}onManualClick(e){f.sendHomeSelectStart("example"),e.preventDefault(),c.goto(\`example/\${location.search}\`)}onServiceClick(){f.sendBookService(w.home)}onServiceClose(){var t,i;this.serviceVisible=!1,this.render();const e=((i=(t=this.settings)==null?void 0:t.general)==null?void 0:i.enableHome)??!1;f.sendToggleModal({modal:e?"ServiceModal":"LoadModal",visible:!1,source:w.home})}onServiceClick(){var t,i;const e=((i=(t=this.settings)==null?void 0:t.general)==null?void 0:i.enableHome)??!1;f.sendToggleModal({modal:e?"ServiceModal":"LoadModal",visible:!0,source:w.home}),this.serviceVisible=!0,this.render()}onBackButtonClick(){var i;const e=new R({platform:"test"}),t=((i=this.settings)==null?void 0:i.test.test)??"";t.startsWith("/")?window.history.pushState(null,t):t.startsWith("http")&&window.location.replace(t),B()&&e.backClicked()}isMobile(){return window.innerWidth<=b.mobile.max}}window.customElements.define("test-home-page",z);const Ee=Object.freeze(Object.defineProperty({__proto__:null,default:z},Symbol.toStringTag,{value:"Module"}));$happy_dom.exports['L'] = me;
$happy_dom.exports['a'] = Ee;
$happy_dom.exports['c'] = D;
$happy_dom.exports['h'] = $e;

}`);
		});
	});
});

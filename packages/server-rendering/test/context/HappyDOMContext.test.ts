import HappyDOMContext from '../../src/context/HappyDOMContext';
import HappyDOMContextHTML from './mock-data/HappyDOMContextHTML';
import * as VM from 'vm';
import * as FS from 'fs';

const URL = 'https://localhost:8080/this/is/a/path';
const SCRIPT = FS.readFileSync(`${__dirname}/mock-data/HappyDOMContextScript.js`).toString();

describe('HappyDOMContext', () => {
	let context: HappyDOMContext = null;

	beforeEach(() => {
		context = new HappyDOMContext();
	});

	describe('render()', () => {
		test('Renders a page without opening shadow roots.', async () => {
			const script = new VM.Script(SCRIPT);
			const result = await context.render({
				html: HappyDOMContextHTML,
				scripts: [script],
				url: URL
			});

			expect(result.css).toEqual([]);

			expect(result.html.replace(/[\s]/gm, '')).toBe(
				`
				<html>
					<head>
						<title>Title</title>
					</head>
					<body>
						<div class="class1 class2" id="id">
							<b>Bold</b>
						</div>
						<custom-element></custom-element>
					</body>
				</html>
				`.replace(/[\s]/gm, '')
			);
		});

		test('Renders a page with opened shadow roots, scoped CSS and CSS added to document head.', async () => {
			const script1 = new VM.Script(SCRIPT);
			const script2 = new VM.Script(`
				setTimeout(() => {
					const customElement = document.querySelector('custom-element');
					customElement.setAttribute('key1', 'newValue1');
					customElement.setAttribute('key2', 'newValue2');
					customElement.setAttribute('changedAttributes', customElement.changedAttributes.join(','));
				}, 1);
			`);
			const result = await context.render({
				html: HappyDOMContextHTML,
				scripts: [script1, script2],
				url: URL,
				customElements: {
					openShadowRoots: true,
					extractCSS: true,
					scopeCSS: true,
					addCSSToHead: true
				}
			});

			expect(result.css).toEqual([
				'custom-element.a{display:block}div.a{color:red}.class1.a{color:blue}.class1.a.class2.a span.a{color:green}.class1.a.a[attr1="value1"]{color:yellow}.a[attr1="value1"]{color:yellow}'
			]);

			expect(result.html.replace(/[\s]/gm, '')).toBe(
				`
				<html>
					<head>
						<title>Title</title>
						<style>
							custom-element.a {
								display: block
							}
				
							div.a {
								color: red
							}
				
							.class1.a {
								color: blue
							}
				
							.class1.a.class2.a span.a {
								color: green
							}
				
							.class1.a.a[attr1="value1"] {
								color: yellow
							}
				
							.a[attr1="value1"] {
								color: yellow
							}
						</style>
					</head>
					<body>
						<div class="class1 class2" id="id">
							<b>Bold</b>
						</div>
						<custom-element key1="newValue1" key2="newValue2" changedattributes="key1,key2" class="a">
							<div class="a">
								<span class="a">
									Some text.
								</span>
							</div>
						</custom-element>
					</body>
				</html>
			`.replace(/[\s]/gm, '')
			);
		});
	});
});

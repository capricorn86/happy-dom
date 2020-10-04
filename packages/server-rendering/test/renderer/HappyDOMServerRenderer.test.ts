import HappyDOMServerRenderer from '../../src/renderer/HappyDOMServerRenderer';
import HappyDOMServerRendererHTMLElement from './mock-data/HappyDOMServerRendererHTMLElement';
import { Window } from 'happy-dom';

describe('HappyDOMServerRenderer', () => {
	let window, document;

	beforeEach(() => {
		window = new Window();
		window.customElements.define('mocked-html-element', HappyDOMServerRendererHTMLElement);
		document = window.document;
	});

	describe('getOuterHTML()', () => {
		test('Renders a <div> element.', () => {
			const div = document.createElement('div');
			const span = document.createElement('span');

			span.setAttribute('attr1', 'value1');
			span.setAttribute('attr2', 'value2');
			span.setAttribute('attr3', '');

			div.setAttribute('attr1', 'value1');
			div.setAttribute('attr2', 'value2');
			div.setAttribute('attr3', '');
			div.appendChild(span);

			expect(new HappyDOMServerRenderer().getOuterHTML(div).html).toBe(
				'<div attr1="value1" attr2="value2" attr3><span attr1="value1" attr2="value2" attr3></span></div>'
			);
		});

		test('Renders a comment node.', () => {
			const div = document.createElement('div');
			const comment = document.createComment();

			comment.textContent = 'Some comment.';

			div.appendChild(comment);

			expect(new HappyDOMServerRenderer().getOuterHTML(div).html).toBe(
				'<div><!--Some comment.--></div>'
			);
		});

		test('Renders a text nodes.', () => {
			const div = document.createElement('div');
			const text1 = document.createTextNode('Text 1.');
			const text2 = document.createTextNode('Text 2.');

			div.appendChild(text1);
			div.appendChild(text2);

			expect(new HappyDOMServerRenderer().getOuterHTML(div).html).toBe('<div>Text 1.Text 2.</div>');
		});

		test('Renders a mix of nodes.', () => {
			const div = document.createElement('div');
			const comment1 = document.createComment('Comment 1.');
			const comment2 = document.createComment('Comment 2.');
			const text1 = document.createTextNode('Text 1.');
			const text2 = document.createTextNode('Text 2.');
			const text3 = document.createTextNode('Text 3.');
			const span1 = document.createElement('span');
			const span2 = document.createElement('span');

			span2.setAttribute('attr1', 'value1');
			span2.appendChild(text3);

			span1.setAttribute('attr1', 'value1');
			span1.setAttribute('attr2', 'value2');
			span1.setAttribute('attr3', '');
			span1.appendChild(span2);

			div.appendChild(comment1);
			div.appendChild(text1);
			div.appendChild(comment2);
			div.appendChild(text2);
			div.appendChild(span1);

			expect(new HappyDOMServerRenderer().getOuterHTML(div).html).toBe(
				'<div><!--Comment 1.-->Text 1.<!--Comment 2.-->Text 2.<span attr1="value1" attr2="value2" attr3><span attr1="value1">Text 3.</span></span></div>'
			);
		});

		test('Renders a custom element closed.', () => {
			const div = document.createElement('div');
			const customElement = document.createElement('mocked-html-element');

			customElement.setAttribute('attr1', 'value1');
			customElement.setAttribute('attr2', 'value2');
			customElement.setAttribute('attr3', '');

			div.appendChild(customElement);

			// Connects the custom element to DOM which will trigger connectedCallback() on it
			document.body.appendChild(div);

			expect(new HappyDOMServerRenderer().getOuterHTML(div).html).toBe(
				'<div><mocked-html-element attr1="value1" attr2="value2" attr3></mocked-html-element></div>'
			);
		});

		test('Renders a custom element opened.', () => {
			const div = document.createElement('div');
			const customElement = document.createElement('mocked-html-element');

			customElement.setAttribute('attr1', 'value1');
			customElement.setAttribute('attr2', 'value2');
			customElement.setAttribute('attr3', '');

			div.appendChild(customElement);

			// Connects the custom element to DOM which will trigger connectedCallback() on it
			document.body.appendChild(div);

			const result = new HappyDOMServerRenderer({
				openShadowRoots: true,
				extractCSS: false,
				scopeCSS: false
			}).getOuterHTML(div);

			expect(result.html.replace(/\s/gm, '')).toBe(
				`
				<div>
					<mocked-html-element attr1=\"value1\" attr2=\"value2\" attr3>
						<style>
							:host {
								display: block;
							}
				
							div {
								color: red;
							}
				
							.class1 {
								color: blue;
							}
				
							.class1.class2 span {
								color: green;
							}
				
							.class1[attr1=\"value1\"] {
								color: yellow;
							}
				
							[attr1=\"value1\"] {
								color: yellow;
							}
						</style>
						<div>
							<span>
								Some text.
							</span>
						</div>
					</mocked-html-element>
				</div>
			`.replace(/\s/gm, '')
			);
			expect(result.css).toEqual([]);
		});

		test('Renders a custom element opened with scoped CSS.', () => {
			const div = document.createElement('div');
			const customElement = document.createElement('mocked-html-element');

			customElement.setAttribute('attr1', 'value1');
			customElement.setAttribute('attr2', 'value2');
			customElement.setAttribute('attr3', '');

			div.appendChild(customElement);

			// Connects the custom element to DOM which will trigger connectedCallback() on it
			document.body.appendChild(div);

			const result = new HappyDOMServerRenderer({
				openShadowRoots: true,
				extractCSS: false,
				scopeCSS: true
			}).getOuterHTML(div);

			expect(result.html.replace(/\s/gm, '')).toBe(
				`
				<div>
					<mocked-html-element attr1=\"value1\" attr2=\"value2\" attr3 class="a">
						<style class="a">
							mocked-html-element.a {
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
				
							.class1.a.a[attr1=\"value1\"] {
								color: yellow
							}
				
							.a[attr1=\"value1\"] {
								color: yellow
							}
						</style>
						<div class="a">
							<span class="a">
								Some text.
							</span>
						</div>
					</mocked-html-element>
				</div>
			`.replace(/\s/gm, '')
			);
			expect(result.css).toEqual([
				'mocked-html-element.a{display:block}div.a{color:red}.class1.a{color:blue}.class1.a.class2.a span.a{color:green}.class1.a.a[attr1="value1"]{color:yellow}.a[attr1="value1"]{color:yellow}'
			]);
		});

		test('Renders a custom element opened with scoped & extracted CSS.', () => {
			const div = document.createElement('div');
			const customElement = document.createElement('mocked-html-element');

			customElement.setAttribute('attr1', 'value1');
			customElement.setAttribute('attr2', 'value2');
			customElement.setAttribute('attr3', '');

			div.appendChild(customElement);

			// Connects the custom element to DOM which will trigger connectedCallback() on it
			document.body.appendChild(div);

			const result = new HappyDOMServerRenderer({
				openShadowRoots: true,
				extractCSS: true,
				scopeCSS: true
			}).getOuterHTML(div);

			expect(result.html.replace(/\s/gm, '')).toBe(
				`
				<div>
					<mocked-html-element attr1=\"value1\" attr2=\"value2\" attr3 class="a">
						<div class="a">
							<span class="a">
								Some text.
							</span>
						</div>
					</mocked-html-element>
				</div>
			`.replace(/\s/gm, '')
			);
			expect(result.css).toEqual([
				'mocked-html-element.a{display:block}div.a{color:red}.class1.a{color:blue}.class1.a.class2.a span.a{color:green}.class1.a.a[attr1="value1"]{color:yellow}.a[attr1="value1"]{color:yellow}'
			]);
		});
	});
});

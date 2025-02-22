import HTMLSerializer from '../../src/html-serializer/HTMLSerializer.js';
import Window from '../../src/window/Window.js';
import Document from '../../src/nodes/document/Document.js';
import CustomElement from '../CustomElement.js';
import { beforeEach, afterEach, describe, it, expect } from 'vitest';

describe('HTMLSerializer', () => {
	let window: Window;
	let document: Document;
	let serializer: HTMLSerializer;

	beforeEach(() => {
		window = new Window();
		document = window.document;
		serializer = new HTMLSerializer();

		window.customElements.define('custom-element', CustomElement);
	});

	afterEach(() => {
		CustomElement.shadowRootMode = 'open';
	});

	describe('serializeToString()', () => {
		it('Serializes a <div> element.', () => {
			const div = document.createElement('div');
			const span = document.createElement('span');

			span.setAttribute('attr1', 'value1');
			span.setAttribute('attr2', 'value2');
			span.setAttribute('attr3', '');

			div.setAttribute('attr1', 'value1');
			div.setAttribute('attr2', 'value2');
			div.setAttribute('attr3', '');
			div.appendChild(span);

			expect(serializer.serializeToString(div)).toBe(
				'<div attr1="value1" attr2="value2" attr3=""><span attr1="value1" attr2="value2" attr3=""></span></div>'
			);
		});

		it('Serializes void elements elements like img correctly.', () => {
			const div = document.createElement('div');
			const img = document.createElement('img');

			img.setAttribute('src', 'https://localhost/img.jpg');

			div.appendChild(img);

			expect(serializer.serializeToString(div)).toBe(
				'<div><img src="https://localhost/img.jpg"></div>'
			);
		});

		it('Serializes a comment node.', () => {
			const div = document.createElement('div');
			const comment = document.createComment('');

			comment.textContent = 'Some comment.';

			div.appendChild(comment);

			expect(serializer.serializeToString(div)).toBe('<div><!--Some comment.--></div>');
		});

		it('Serializes a text nodes.', () => {
			const div = document.createElement('div');
			const text1 = document.createTextNode('Text 1.');
			const text2 = document.createTextNode('Text 2.');

			div.appendChild(text1);
			div.appendChild(text2);

			expect(serializer.serializeToString(div)).toBe('<div>Text 1.Text 2.</div>');
		});

		it('Serializes a template node.', () => {
			const template = document.createElement('template');
			template.innerHTML = '<div>Test</div>';
			expect(serializer.serializeToString(template)).toBe('<template><div>Test</div></template>');
		});

		it('Serializes a mix of nodes.', () => {
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

			expect(serializer.serializeToString(div)).toBe(
				'<div><!--Comment 1.-->Text 1.<!--Comment 2.-->Text 2.<span attr1="value1" attr2="value2" attr3=""><span attr1="value1">Text 3.</span></span></div>'
			);
		});

		it('Serializes a custom element.', () => {
			const div = document.createElement('div');
			const customElement = document.createElement('custom-element');

			customElement.setAttribute('attr1', 'value1');
			customElement.setAttribute('attr2', 'value2');
			customElement.setAttribute('attr3', '');

			div.appendChild(customElement);

			// Connects the custom element to DOM which will trigger connectedCallback() on it
			document.body.appendChild(div);

			expect(serializer.serializeToString(div)).toBe(
				'<div><custom-element attr1="value1" attr2="value2" attr3=""></custom-element></div>'
			);
		});

		it('Includes shadow roots of custom elements when "allShadowRoots" is set as an option.', () => {
			const div = document.createElement('div');
			const customElement1 = document.createElement('custom-element');

			CustomElement.shadowRootMode = 'closed';

			const customElement2 = document.createElement('custom-element');

			customElement1.setAttribute('key1', 'value1');
			customElement1.setAttribute('key2', 'value2');
			customElement1.innerHTML = '<span>Slotted content</span>';

			customElement2.setAttribute('key1', 'value4');
			customElement2.setAttribute('key2', 'value5');

			div.appendChild(customElement1);
			div.appendChild(customElement2);

			// Connects the custom element to DOM which will trigger connectedCallback() on it
			document.body.appendChild(div);

			const serializer = new HTMLSerializer({ allShadowRoots: true });

			expect(serializer.serializeToString(div).replace(/[\s]/gm, '')).toBe(
				`
					<div>
						<custom-element key1="value1" key2="value2">
							<template shadowrootmode="open">
								<style>
									:host {
										display: block;
                                        font: 14px "Lucida Grande", Helvetica, Arial, sans-serif;
									}
									span {
										color: pink;
									}
									.propKey {
										color: yellow;
									}
								</style>
								<div>
									<span class="propKey">
										key1 is "value1" and key2 is "value2".
									</span>
									<span class="children">
                                        #1SPANSlottedcontent
									</span>
									<span><slot></slot></span>
								</div>
							</template>
							<span>Slotted content</span>
						</custom-element>
						<custom-element key1="value4" key2="value5"></custom-element>
					</div>`.replace(/[\s]/gm, '')
			);
		});

		it('Renders the code from the documentation for server-side rendering as expected.', () => {
			document.write(`
                <html>
                    <head>
                         <title>Test page</title>
                    </head>
                    <body>
                        <div>
                            <my-custom-element>
                                <span>Slotted content</span>
                            </my-custom-element>
                        </div>
                        <script>
                            class MyCustomElement extends HTMLElement {
                                constructor() {
                                    super();
                                    this.attachShadow({ mode: 'open' });
                                }
            
                                connectedCallback() {
                                    this.shadowRoot.innerHTML = \`
                                        <style>
                                            :host {
                                                display: inline-block;
                                                background: red;
                                            }
                                        </style>
                                        <div><slot></slot></div>
                                    \`;
                                }
                            }
            
                            customElements.define('my-custom-element', MyCustomElement);
                        </script>
                    </body>
                </html>
            `);

			expect(
				document.body
					.querySelector('div')
					?.getInnerHTML({ includeShadowRoots: true })
					.replace(/\s/gm, '')
			).toBe(
				`
            <my-custom-element>
                <template shadowrootmode="open">
                    <style>
                        :host {
                            display: inline-block;
                            background: red;
                        }
                    </style>
                    <div><slot></slot></div>
                </template>
                <span>Slotted content</span>
            </my-custom-element>
            `.replace(/\s/gm, '')
			);
		});

		it('Does not escape unicode attributes.', () => {
			const div = document.createElement('div');

			div.setAttribute('attr1', 'Hello \u{2068}John\u{2069}');
			div.setAttribute('attr2', '<span> test');
			div.setAttribute('attr3', '');

			expect(serializer.serializeToString(div)).toBe(
				'<div attr1="Hello ⁨John⁩" attr2="<span> test" attr3=""></div>'
			);
		});

		it('Serializes the is value.', () => {
			const div = document.createElement('div', { is: 'custom-element' });

			expect(serializer.serializeToString(div)).toBe('<div is="custom-element"></div>');
		});

		it('Ignores the is value if the is attribute is present.', () => {
			const div = document.createElement('div', { is: 'custom-element' });
			div.setAttribute('is', 'custom-replacement');

			expect(serializer.serializeToString(div)).toBe('<div is="custom-replacement"></div>');
		});

		it('Serializes text content.', () => {
			const div = document.createElement('div');

			div.innerText = '<b>a</b>';
			expect(serializer.serializeToString(div)).toBe('<div>&lt;b&gt;a&lt;/b&gt;</div>');
		});

		it('Serializes attributes to prevent injection attacks.', () => {
			const a = document.createElement('a');

			document.body.appendChild(a);

			a.href = 'https://example.com" style="font-size: 500%;';
			a.textContent = "I'm a link!";

			expect(serializer.serializeToString(a)).toBe(
				`<a href="https://example.com&quot; style=&quot;font-size: 500%;">I'm a link!</a>`
			);

			document.body.innerHTML = `<a href="https://www.com/" style="background-image: url(&quot;https://cdn.cookie.org/image.svg&quot;);"></a>`;

			expect(document.body.innerHTML).toBe(
				`<a href="https://www.com/" style="background-image: url(&quot;https://cdn.cookie.org/image.svg&quot;);"></a>`
			);
		});

		it("Doesn't escape text in <script> and <style> elements for #1564.", () => {
			expect(
				serializer.serializeToString(
					(<Document>(
						new window.DOMParser().parseFromString(
							'<div><script>//<>&lt;&gt;</script><style>//<>&lt;&gt;</style></div>',
							'text/html'
						)
					)).body
				)
			).toBe('<body><div><script>//<>&lt;&gt;</script><style>//<>&lt;&gt;</style></div></body>');
		});

		it('Serializes attributes with different namespace and the same key.', () => {
			const div = document.createElement('div');

			div.setAttributeNS('namespace', 'key', 'value1');
			div.setAttributeNS('namespace', 'key', 'value2');
			div.setAttributeNS('namespace2', 'key', 'value3');
			div.setAttributeNS('namespace3', 'key', 'value4');

			expect(serializer.serializeToString(div)).toBe(
				`<div key="value2" key="value3" key="value4"></div>`
			);
		});

		it('Serializes attributes with different namespace and the same key.', () => {
			const div = document.createElement('div');

			div.setAttribute('ns1:key', 'value1');
			div.setAttribute('ns2:key', 'value1');
			div.setAttribute('key1', 'value1');
			div.setAttribute('key2', '');

			expect(serializer.serializeToString(div)).toBe(
				`<div ns1:key="value1" ns2:key="value1" key1="value1" key2=""></div>`
			);
		});
	});
});

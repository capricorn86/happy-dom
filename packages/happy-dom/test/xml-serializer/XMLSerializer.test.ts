import XMLSerializer from '../../src/xml-serializer/XMLSerializer';
import Window from '../../src/window/Window';
import Document from '../../src/nodes/document/Document';
import CustomElement from '../CustomElement';

describe('XMLSerializer', () => {
	let window: Window;
	let document: Document;
	let xmlSerializer: XMLSerializer;

	beforeEach(() => {
		window = new Window();
		document = window.document;
		xmlSerializer = new XMLSerializer();

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

			expect(xmlSerializer.serializeToString(div)).toBe(
				'<div attr1="value1" attr2="value2" attr3=""><span attr1="value1" attr2="value2" attr3=""></span></div>'
			);
		});

		it('Serializes void elements elements like img correctly.', () => {
			const div = document.createElement('div');
			const img = document.createElement('img');

			img.setAttribute('src', 'https://localhost/img.jpg');

			div.appendChild(img);

			expect(xmlSerializer.serializeToString(div)).toBe(
				'<div><img src="https://localhost/img.jpg"></div>'
			);
		});

		it('Serializes a comment node.', () => {
			const div = document.createElement('div');
			const comment = document.createComment('');

			comment.textContent = 'Some comment.';

			div.appendChild(comment);

			expect(xmlSerializer.serializeToString(div)).toBe('<div><!--Some comment.--></div>');
		});

		it('Serializes a text nodes.', () => {
			const div = document.createElement('div');
			const text1 = document.createTextNode('Text 1.');
			const text2 = document.createTextNode('Text 2.');

			div.appendChild(text1);
			div.appendChild(text2);

			expect(xmlSerializer.serializeToString(div)).toBe('<div>Text 1.Text 2.</div>');
		});

		it('Serializes a template node.', () => {
			const template = document.createElement('template');
			template.innerHTML = '<div>Test</div>';
			expect(xmlSerializer.serializeToString(template)).toBe(
				'<template><div>Test</div></template>'
			);
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

			expect(xmlSerializer.serializeToString(div)).toBe(
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

			expect(xmlSerializer.serializeToString(div)).toBe(
				'<div><custom-element attr1="value1" attr2="value2" attr3=""></custom-element></div>'
			);
		});

		it('Includes shadow roots of custom elements when the "includeShadowRoots" sent in as an option.', () => {
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

			expect(
				new XMLSerializer({ includeShadowRoots: true }).serializeToString(div).replace(/[\s]/gm, '')
			).toBe(
				`
					<div>
						<custom-element key1="value1" key2="value2">
							<span>Slotted content</span>
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
					.getInnerHTML({ includeShadowRoots: true })
					.replace(/\s/gm, '')
			).toBe(
				`
            <my-custom-element>
                <span>Slotted content</span>
                <template shadowrootmode="open">
                    <style>
                        :host {
                            display: inline-block;
                            background: red;
                        }
                    </style>
                    <div><slot></slot></div>
                </template>
            </my-custom-element>
            `.replace(/\s/gm, '')
			);
		});

		it('Does not escape unicode attributes.', () => {
			const div = document.createElement('div');

			div.setAttribute('attr1', 'Hello \u{2068}John\u{2069}');
			div.setAttribute('attr2', '<span> test');
			div.setAttribute('attr3', '');

			expect(xmlSerializer.serializeToString(div)).toBe(
				'<div attr1="Hello \u{2068}John\u{2069}" attr2="&lt;span&gt; test" attr3=""></div>'
			);
		});

		it('Serializes the is value.', () => {
			const div = document.createElement('div', { is: 'custom-element' });

			expect(xmlSerializer.serializeToString(div)).toBe('<div is="custom-element"></div>');
		});

		it('Ignores the is value if the is attribute is present.', () => {
			const div = document.createElement('div', { is: 'custom-element' });
			div.setAttribute('is', 'custom-replacement');

			expect(xmlSerializer.serializeToString(div)).toBe('<div is="custom-replacement"></div>');
		});
	});
});

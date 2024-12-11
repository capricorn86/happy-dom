import XMLSerializer from '../../src/xml-serializer/XMLSerializer.js';
import Window from '../../src/window/Window.js';
import Document from '../../src/nodes/document/Document.js';
import CustomElement from '../CustomElement.js';
import * as PropertySymbol from '../../src/PropertySymbol.js';
import { beforeEach, afterEach, describe, it, expect } from 'vitest';

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
				'<div xmlns="http://www.w3.org/1999/xhtml"><custom-element attr1="value1" attr2="value2" attr3=""></custom-element></div>'
			);
		});

		it('Does not escape unicode attributes.', () => {
			const div = document.createElement('div');

			div.setAttribute('attr1', 'Hello \u{2068}John\u{2069}');
			div.setAttribute('attr2', '<span> test');
			div.setAttribute('attr3', '');

			expect(xmlSerializer.serializeToString(div)).toBe(
				'<div xmlns="http://www.w3.org/1999/xhtml" attr1="Hello ⁨John⁩" attr2="&lt;span&gt; test" attr3=""></div>'
			);
		});

		it('Doesn\'t serialize the "is" value.', () => {
			const div = document.createElement('div', { is: 'custom-element' });

			expect(xmlSerializer.serializeToString(div)).toBe(
				'<div xmlns="http://www.w3.org/1999/xhtml"></div>'
			);
		});

		it('Serializes text content.', () => {
			const div = document.createElement('div');

			div.innerText = '<b>a</b>';
			expect(xmlSerializer.serializeToString(div)).toBe(
				'<div xmlns="http://www.w3.org/1999/xhtml">&lt;b&gt;a&lt;/b&gt;</div>'
			);
		});

		it('Serializes attributes to prevent injection attacks.', () => {
			const a = document.createElement('a');

			document.body.appendChild(a);

			a.href = 'https://example.com" style="font-size: 500%;';
			a.textContent = "I'm a link!";

			expect(xmlSerializer.serializeToString(a)).toBe(
				`<a xmlns="http://www.w3.org/1999/xhtml" href="https://example.com&quot; style=&quot;font-size: 500%;">I'm a link!</a>`
			);

			document.body.innerHTML = `<a href="https://www.com/" style="background-image: url(&quot;https://cdn.cookie.org/image.svg&quot;);"></a>`;

			expect(xmlSerializer.serializeToString(document.body)).toBe(
				`<body xmlns="http://www.w3.org/1999/xhtml"><a href="https://www.com/" style="background-image: url(&quot;https://cdn.cookie.org/image.svg&quot;);"></a></body>`
			);
		});
	});
});

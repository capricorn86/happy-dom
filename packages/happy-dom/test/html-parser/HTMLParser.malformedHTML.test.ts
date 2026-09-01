import Window from '../../src/window/Window.js';
import Document from '../../src/nodes/document/Document.js';
import HTMLParser from '../../src/html-parser/HTMLParser.js';
import HTMLSerializer from '../../src/html-serializer/HTMLSerializer.js';
import { beforeEach, describe, it, expect } from 'vitest';

/**
 * Test cases for GitHub issue #1949:
 * DOMParser does not correctly handle malformed HTML
 *
 * Per the HTML spec, a <p> element is implicitly closed when certain
 * block-level elements are encountered.
 *
 * @see https://github.com/capricorn86/happy-dom/issues/1949
 * @see https://html.spec.whatwg.org/C/grouping-content.html
 */
describe('HTMLParser - Malformed HTML handling (Issue #1949)', () => {
	let window: Window;

	beforeEach(() => {
		window = new Window();
	});

	describe('Paragraph element implicit closing', () => {
		it('Should handle the original issue: stray </div> with nested <p>', () => {
			const doc = new window.DOMParser().parseFromString(
				'<p>testing with </div><p>new line</p>',
				'text/html'
			);
			expect(doc.body.innerHTML).toBe('<p>testing with </p><p>new line</p>');
		});

		it('Should close <p> when another <p> is encountered', () => {
			const doc = new window.DOMParser().parseFromString(
				'<p>first<p>second<p>third</p>',
				'text/html'
			);
			expect(doc.body.innerHTML).toBe('<p>first</p><p>second</p><p>third</p>');
		});

		it('Should close <p> when block-level elements are encountered', () => {
			// Test representative block elements: div, heading, list, table, sectioning
			const testCases = [
				{ input: '<p>text<div>block</div>', expected: '<p>text</p><div>block</div>' },
				{ input: '<p>text<h1>heading</h1>', expected: '<p>text</p><h1>heading</h1>' },
				{ input: '<p>text<ul><li>item</li></ul>', expected: '<p>text</p><ul><li>item</li></ul>' },
				{
					input: '<p>text<table><tr><td>cell</td></tr></table>',
					expected: '<p>text</p><table><tbody><tr><td>cell</td></tr></tbody></table>'
				},
				{
					input: '<p>text<section>content</section>',
					expected: '<p>text</p><section>content</section>'
				},
				{ input: '<p>text<hr>', expected: '<p>text</p><hr>' },
				{
					input: '<p>text<blockquote>quote</blockquote>',
					expected: '<p>text</p><blockquote>quote</blockquote>'
				}
			];

			for (const { input, expected } of testCases) {
				const doc = new window.DOMParser().parseFromString(input, 'text/html');
				expect(doc.body.innerHTML).toBe(expected);
			}
		});

		it('Should NOT close <p> when inline elements are encountered', () => {
			const testCases = [
				{ input: '<p>text<span>inline</span></p>', expected: '<p>text<span>inline</span></p>' },
				{ input: '<p>text<a href="#">link</a></p>', expected: '<p>text<a href="#">link</a></p>' },
				{ input: '<p>text<strong>bold</strong></p>', expected: '<p>text<strong>bold</strong></p>' }
			];

			for (const { input, expected } of testCases) {
				const doc = new window.DOMParser().parseFromString(input, 'text/html');
				expect(doc.body.innerHTML).toBe(expected);
			}
		});

		it('Should handle nested structures correctly', () => {
			const doc = new window.DOMParser().parseFromString(
				'<div><p>first<p>second</p></div>',
				'text/html'
			);
			expect(doc.body.innerHTML).toBe('<div><p>first</p><p>second</p></div>');
		});
	});

	describe('Stray end tags', () => {
		it('Should ignore stray end tags with no matching open tag', () => {
			const doc = new window.DOMParser().parseFromString(
				'<div>content</span></section></div>',
				'text/html'
			);
			expect(doc.body.innerHTML).toBe('<div>content</div>');
		});
	});

	describe('Fragment parsing', () => {
		it('Should handle malformed HTML in fragments', () => {
			const result = new HTMLParser(window).parse('<p>first<p>second</p>');
			expect(new HTMLSerializer().serializeToString(result)).toBe('<p>first</p><p>second</p>');
		});
	});

	/**
	 * Test cases for GitHub issue #2052:
	 * Incorrect DOM structure with <caption> elements
	 *
	 * Per the HTML spec, <caption> elements should contain flow content
	 * (including inline and block elements), except table elements.
	 *
	 * @see https://github.com/capricorn86/happy-dom/issues/2052
	 * @see https://html.spec.whatwg.org/multipage/tables.html#the-caption-element
	 */
	describe('Table caption element content model (Issue #2052)', () => {
		it('Should preserve inline elements inside <caption> - original issue with <b>', () => {
			const doc = new window.DOMParser().parseFromString(
				`<table>
					<caption>
						This <b>is</b> a caption.
					</caption>
					<thead></thead>
					<tbody></tbody>
				</table>`,
				'text/html'
			);
			const caption = doc.querySelector('caption');
			const b = doc.querySelector('b');

			// The <b> element should be inside the caption
			expect(caption?.contains(b)).toBe(true);
			expect(caption?.innerHTML.trim()).toBe('This <b>is</b> a caption.');
		});

		it('Should preserve nested inline elements inside <caption>', () => {
			const doc = new window.DOMParser().parseFromString(
				`<table>
					<caption>
						<small>This <b>is</b> a caption.</small>
					</caption>
					<tbody></tbody>
				</table>`,
				'text/html'
			);
			const caption = doc.querySelector('caption');
			const small = doc.querySelector('small');
			const b = doc.querySelector('b');

			// Both elements should be inside the caption
			expect(caption?.contains(small)).toBe(true);
			expect(caption?.contains(b)).toBe(true);
			expect(caption?.innerHTML.trim()).toBe('<small>This <b>is</b> a caption.</small>');
		});

		it('Should allow various inline elements in <caption>', () => {
			const testCases = [
				{
					input: '<table><caption>Text with <strong>strong</strong></caption></table>',
					selector: 'strong'
				},
				{
					input: '<table><caption>Text with <em>emphasis</em></caption></table>',
					selector: 'em'
				},
				{
					input: '<table><caption>Text with <span>span</span></caption></table>',
					selector: 'span'
				},
				{
					input: '<table><caption>Text with <a href="#">link</a></caption></table>',
					selector: 'a'
				}
			];

			for (const { input, selector } of testCases) {
				const doc = new window.DOMParser().parseFromString(input, 'text/html');
				const caption = doc.querySelector('caption');
				const element = doc.querySelector(selector);
				expect(caption?.contains(element)).toBe(true);
			}
		});

		it('Should allow block-level elements in <caption> (flow content)', () => {
			const doc = new window.DOMParser().parseFromString(
				`<table>
					<caption>
						<p>Paragraph in caption</p>
						<div>Div in caption</div>
					</caption>
					<tbody></tbody>
				</table>`,
				'text/html'
			);
			const caption = doc.querySelector('caption');
			const p = doc.querySelector('p');
			const div = doc.querySelector('div');

			// Block elements should be allowed inside caption
			expect(caption?.contains(p)).toBe(true);
			expect(caption?.contains(div)).toBe(true);
		});

		it('Should NOT allow <table> as direct child of <caption>', () => {
			const doc = new window.DOMParser().parseFromString(
				`<table>
					<caption>
						<table><tr><td>Nested table</td></tr></table>
					</caption>
					<tbody></tbody>
				</table>`,
				'text/html'
			);
			const caption = doc.querySelector('caption');
			const nestedTable = doc.querySelectorAll('table')[1];

			// The nested table should NOT be inside the caption
			expect(caption?.contains(nestedTable)).toBe(false);
		});

		it('Should preserve caption content when serializing', () => {
			const html =
				'<table><caption>This <b>is</b> a <em>test</em>.</caption><tbody></tbody></table>';
			const doc = new window.DOMParser().parseFromString(html, 'text/html');
			const table = doc.querySelector('table');
			const serialized = table?.outerHTML;

			expect(serialized).toContain('<caption>This <b>is</b> a <em>test</em>.</caption>');
		});

		it('Should remove <caption> tag when parent is not <table>', () => {
			const doc = new window.DOMParser().parseFromString(
				'<div><caption>Wrong parent</caption></div>',
				'text/html'
			);
			// The caption tag should be removed, leaving only the text content
			expect(doc.body.innerHTML).toBe('<div>Wrong parent</div>');
		});

		it('Should remove <caption> tag when used standalone', () => {
			const doc = new window.DOMParser().parseFromString(
				'<caption>Standalone caption</caption>',
				'text/html'
			);
			// The caption tag should be removed, leaving only the text content
			expect(doc.body.innerHTML).toBe('Standalone caption');
		});

		it('Should preserve <caption> tag only when parent is <table>', () => {
			const doc = new window.DOMParser().parseFromString(
				'<table><caption>Correct parent</caption></table>',
				'text/html'
			);
			const caption = doc.querySelector('caption');
			const table = doc.querySelector('table');

			// The caption should exist and be inside the table
			expect(caption).not.toBeNull();
			expect(table?.contains(caption)).toBe(true);
			expect(doc.body.innerHTML).toContain('<caption>Correct parent</caption>');
		});
	});
});

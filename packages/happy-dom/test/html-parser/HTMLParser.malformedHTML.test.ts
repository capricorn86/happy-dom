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
});

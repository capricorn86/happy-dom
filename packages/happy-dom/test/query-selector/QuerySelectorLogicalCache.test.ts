import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import Window from '../../src/window/Window.js';
import type Document from '../../src/nodes/document/Document.js';

describe('Owning query caches through intermediate pseudos', () => {
	let window: Window;
	let document: Document;

	beforeEach(() => {
		window = new Window();
		document = window.document;
	});

	afterEach(async () => {
		await window.happyDOM.close();
	});

	it.each(
		['is', 'where', 'not'].flatMap((pseudo) =>
			[
				{
					name: 'has descendant',
					html: '<div class="box" id="target"><div class="wrapper"><span class="item"></span></div></div>',
					selector: '.box:has(.item:PSEUDO(.hit > #root > .box > .wrapper > .item))'
				},
				{
					name: 'has child',
					html: '<div class="box" id="target"><span class="item"></span></div>',
					selector: '.box:has(> .item:PSEUDO(.hit > #root > .box > .item))'
				},
				{
					name: 'has adjacent sibling',
					html: '<div class="box" id="target"></div><span class="item"></span>',
					selector: '.box:has(+ .item:PSEUDO(.hit > #root > .item))'
				},
				{
					name: 'nth-child filter',
					html: '<span class="item" id="target"></span>',
					selector: '.item:nth-child(1 of .item:PSEUDO(.hit > #root > .item))'
				},
				{
					name: 'nth-last-child filter',
					html: '<span class="item" id="target"></span>',
					selector: '.item:nth-last-child(1 of .item:PSEUDO(.hit > #root > .item))'
				}
			].map((row) => ({ ...row, pseudo, selector: row.selector.replace('PSEUDO', pseudo) }))
		)
	)('Tracks an outside ancestor through $name with :$pseudo().', ({ html, selector, pseudo }) => {
		document.body.innerHTML = `<section id="outside"><div id="root">${html}</div></section>`;
		const outside = document.getElementById('outside')!;
		const root = document.getElementById('root')!;
		const target = document.getElementById('target')!;
		for (const hit of [true, false, true]) {
			outside.className = hit ? 'hit' : '';
			const expected = pseudo === 'not' ? !hit : hit;
			expect(root.querySelector(selector)).toBe(expected ? target : null);
			expect(Array.from(root.querySelectorAll(selector))).toEqual(expected ? [target] : []);
			expect(target.matches(selector)).toBe(expected);
			expect(target.closest(selector)).toBe(expected ? target : null);
		}
	});

	it.each(['nth-child', 'nth-last-child'])(
		'Tracks an outside ancestor used to count other siblings in :%s().',
		(name) => {
			document.body.innerHTML = `
				<section id="outside"><div id="root">
					<span class="peer"></span><span class="stable" id="target"></span><span class="peer"></span>
				</div></section>
			`;
			const outside = document.getElementById('outside')!;
			const root = document.getElementById('root')!;
			const target = document.getElementById('target')!;
			const selector = `.stable:${name}(1 of :is(.stable, .hit > #root > .peer))`;
			for (const hit of [true, false, true]) {
				outside.className = hit ? 'hit' : '';
				expect(root.querySelector(selector)).toBe(hit ? null : target);
				expect(Array.from(root.querySelectorAll(selector))).toEqual(hit ? [] : [target]);
				expect(target.matches(selector)).toBe(!hit);
				expect(target.closest(selector)).toBe(hit ? null : target);
			}
		}
	);
});

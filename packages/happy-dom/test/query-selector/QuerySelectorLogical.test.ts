import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import Window from '../../src/window/Window.js';
import type Document from '../../src/nodes/document/Document.js';

describe('Complex logical pseudo arguments', () => {
	let window: Window;
	let document: Document;

	beforeEach(() => {
		window = new Window();
		document = window.document;
		document.body.innerHTML = `
			<section class="comments"><span class="item" id="direct"></span><div><span class="item" id="deep"></span></div></section>
			<span class="item" id="before"></span><i class="marker"></i><span class="item" id="adjacent"></span><em></em><span class="item" id="later"></span>
		`;
	});

	afterEach(async () => {
		await window.happyDOM.close();
	});

	it.each(
		['is', 'where'].flatMap((name) => [
			[`.item:${name}(.comments *)`, ['direct', 'deep']],
			[`.item:${name}(.comments > .item)`, ['direct']],
			[`.item:${name}(.marker + .item)`, ['adjacent']],
			[`.item:${name}(.marker ~ .item)`, ['adjacent', 'later']],
			[`.item:${name}(.missing *, .comments *)`, ['direct', 'deep']],
			[`:${name}(.item:not(.comments *))`, ['before', 'adjacent', 'later']]
		])
	)('Matches the complete argument in %s.', (selector, expected) => {
		const text = <string>selector;
		const ids = <string[]>expected;
		expect(Array.from(document.querySelectorAll(text), (element) => element.id)).toEqual(ids);
		expect(document.querySelector(text)).toBe(document.getElementById(ids[0]));
		for (const element of document.querySelectorAll('.item')) {
			expect(element.matches(text)).toBe(ids.includes(element.id));
			expect(element.closest(text)).toBe(ids.includes(element.id) ? element : null);
		}
	});
});

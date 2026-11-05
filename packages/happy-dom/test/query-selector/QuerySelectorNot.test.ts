/** Regression coverage for complex selectors inside :not() and their cache dependencies. */

import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import Window from '../../src/window/Window.js';
import type Document from '../../src/nodes/document/Document.js';

describe('Complex :not() selectors', () => {
	let window: Window;
	let document: Document;

	beforeEach(() => {
		window = new Window();
		document = window.document;
		document.body.innerHTML = `
			<section class="comments" id="comments">
				<span class="item" id="direct"></span>
				<div id="nested"><span class="item" id="deep"></span></div>
			</section>
			<span class="item" id="before"></span>
			<i class="marker" id="marker"></i>
			<span class="item" id="adjacent"></span>
			<em></em>
			<span class="item" id="later"></span>
		`;
	});

	afterEach(async () => {
		await window.happyDOM.close();
	});

	it.each([
		{
			selector: '.item:not(.comments *)',
			ids: ['before', 'adjacent', 'later']
		},
		{
			selector: '.item:not(.comments > .item)',
			ids: ['deep', 'before', 'adjacent', 'later']
		},
		{
			selector: '.item:not(.marker + .item)',
			ids: ['direct', 'deep', 'before', 'later']
		},
		{
			selector: '.item:not(.marker ~ .item)',
			ids: ['direct', 'deep', 'before']
		}
	])('Matches the complete selector "$selector" through public APIs.', ({ selector, ids }) => {
		expect(Array.from(document.querySelectorAll(selector), (element) => element.id)).toEqual(ids);
		expect(document.querySelector(selector)?.id).toBe(ids[0]);
		for (const element of document.querySelectorAll('.item')) {
			const expected = ids.includes(element.id);
			expect(element.matches(selector)).toBe(expected);
			expect(element.matches(selector)).toBe(expected);
			expect(element.closest(selector)).toBe(expected ? element : null);
		}
	});

	it('Preserves an element with the excluded ancestor class on itself.', () => {
		const comments = document.getElementById('comments')!;
		comments.classList.add('item');
		expect(comments.matches('.item:not(.comments *)')).toBe(true);
		expect(document.getElementById('direct')!.matches('.item:not(.comments *)')).toBe(false);
	});

	it('Checks all complex branches of an exclusion list.', () => {
		expect(
			Array.from(
				document.querySelectorAll('.item:not(.comments *, .marker + .item)'),
				(element) => element.id
			)
		).toEqual(['before', 'later']);
	});

	it('Supports nested negation.', () => {
		expect(
			Array.from(document.querySelectorAll('.item:not(:not(.comments *))'), (element) => element.id)
		).toEqual(['direct', 'deep']);
	});

	it('Supports consecutive exclusions.', () => {
		expect(
			Array.from(
				document.querySelectorAll('.item:not(.comments *):not(#adjacent)'),
				(element) => element.id
			)
		).toEqual(['before', 'later']);
	});

	it.each(['is', 'where'])('Supports negation nested inside :%s().', (name) => {
		expect(
			Array.from(
				document.querySelectorAll(`:${name}(.item:not(.comments *))`),
				(element) => element.id
			)
		).toEqual(['before', 'adjacent', 'later']);
	});

	it('Preserves the query scope when matching an exclusion.', () => {
		const comments = document.getElementById('comments')!;
		const nested = document.getElementById('nested')!;
		const selector = '.item:not(:scope > .item)';
		expect(Array.from(comments.querySelectorAll(selector), (element) => element.id)).toEqual([
			'deep'
		]);
		expect(Array.from(nested.querySelectorAll(selector), (element) => element.id)).toEqual([]);
		expect(document.getElementById('direct')!.matches(selector)).toBe(true);
	});

	it('Invalidates a negated match when an ancestor changes.', () => {
		const comments = document.getElementById('comments')!;
		const element = document.getElementById('direct')!;
		const selector = '.item:not(.comments *)';
		expect(element.matches(selector)).toBe(false);
		comments.classList.remove('comments');
		expect(element.matches(selector)).toBe(true);
		comments.classList.add('comments');
		expect(element.matches(selector)).toBe(false);
	});

	it.each(['+', '~'])('Tracks changes to a preceding sibling for %s.', (combinator) => {
		const marker = document.getElementById('marker')!;
		const element = document.getElementById('adjacent')!;
		const selector = `.item:not(.marker ${combinator} .item)`;
		expect(element.matches(selector)).toBe(false);
		marker.className = '';
		expect(element.matches(selector)).toBe(true);
		marker.className = 'marker';
		expect(element.matches(selector)).toBe(false);
	});

	it('Invalidates the owning query result when an ancestor outside its root changes.', () => {
		const comments = document.getElementById('comments')!;
		const nested = document.getElementById('nested')!;
		const selector = '.item:not(.comments > #nested > .item)';
		expect(nested.querySelector(selector)).toBe(null);
		expect(Array.from(nested.querySelectorAll(selector))).toEqual([]);
		comments.className = '';
		expect(nested.querySelector(selector)?.id).toBe('deep');
		expect(Array.from(nested.querySelectorAll(selector), (element) => element.id)).toEqual([
			'deep'
		]);
	});

	it.each(['is', 'where'])('Propagates cache dependencies through :%s().', (name) => {
		const comments = document.getElementById('comments')!;
		const element = document.getElementById('deep')!;
		const selector = `:${name}(.item:not(.excluded > #nested > .item))`;
		expect(element.matches(selector)).toBe(true);
		comments.classList.add('excluded');
		expect(element.matches(selector)).toBe(false);
	});

	it('Applies the rule to computed styles and refreshes it after an ancestor changes.', () => {
		const style = document.createElement('style');
		style.textContent =
			'.item { display: block; } .item:not(.comments > #nested > .item) { display: none; }';
		document.head.append(style);
		const element = document.getElementById('deep')!;
		const comments = document.getElementById('comments')!;
		expect(window.getComputedStyle(element).display).toBe('block');
		expect(window.getComputedStyle(document.getElementById('before')!).display).toBe('none');
		comments.className = '';
		expect(window.getComputedStyle(element).display).toBe('none');
		comments.className = 'comments';
		expect(window.getComputedStyle(element).display).toBe('block');
	});

	it('Still rejects a missing exclusion argument.', () => {
		expect(() => document.querySelectorAll('.item:not()')).toThrow(window.DOMException);
	});

	it.each([
		{ argument: '.comments *', matches: true },
		{ argument: ':not(.missing) .item', matches: true },
		{ argument: ':host .item', matches: false },
		{ argument: ':is(:host) .item', matches: false },
		{ argument: ':where(:host) .item', matches: false },
		{ argument: ':not(:not(:host)) .item', matches: false },
		{ argument: ':is(.comments, :host(.missing)) .item', matches: true },
		{ argument: ':not(:host(.missing)) .item', matches: false }
	])('Respects the shadow boundary in :not($argument).', ({ argument, matches }) => {
		const host = document.createElement('div');
		host.className = 'comments';
		document.body.append(host);
		const root = host.attachShadow({ mode: 'open' });
		root.innerHTML = '<span class="item" id="shadow-item"></span>';
		const element = root.getElementById('shadow-item')!;
		const selector = `.item:not(${argument})`;
		expect(element.matches(selector)).toBe(matches);
		expect(Array.from(root.querySelectorAll(selector))).toEqual(matches ? [element] : []);
	});
});

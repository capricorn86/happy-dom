import HTMLMapElement from '../../../src/nodes/html-map-element/HTMLMapElement.js';
import Window from '../../../src/window/Window.js';
import Document from '../../../src/nodes/document/Document.js';
import { beforeEach, describe, it, expect } from 'vitest';

describe('HTMLMapElement', () => {
	let window: Window;
	let document: Document;
	let element: HTMLMapElement;

	beforeEach(() => {
		window = new Window();
		document = window.document;
		element = document.createElement('map');
	});

	describe('constructor()', () => {
		it('Should be an instanceof HTMLMapElement', () => {
			expect(element instanceof HTMLMapElement).toBe(true);
		});
	});

	describe('get areas()', () => {
		it('Should return areas', () => {
			const div = document.createElement('div');

			div.innerHTML =
				'<area shape="circle" coords="15,15,5" /><area shape="circle" coords="15,15,5" />';
			element.appendChild(div);

			expect(element.areas.length).toBe(2);
			expect(element.areas[0]).toBe(div.children[0]);
			expect(element.areas[1]).toBe(div.children[1]);

			div.children[0].remove();

			expect(element.areas.length).toBe(1);
			expect(element.areas[0]).toBe(div.children[0]);
		});

		it('Should return an empty collection', () => {
			expect(element.areas.length).toBe(0);
		});
	});

	describe('get name()', () => {
		it('Should return name', () => {
			element.setAttribute('name', 'test');
			expect(element.name).toBe('test');
		});

		it('Should return an empty string', () => {
			expect(element.name).toBe('');
		});
	});

	describe('set name()', () => {
		it('Should set name', () => {
			element.name = 'test';
			expect(element.getAttribute('name')).toBe('test');
		});
	});
});

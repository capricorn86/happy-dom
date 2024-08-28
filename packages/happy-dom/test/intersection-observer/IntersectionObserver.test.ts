import Window from '../../src/window/Window.js';
import Document from '../../src/nodes/document/Document.js';
import { beforeEach, describe, it, expect } from 'vitest';

describe('IntersectionObserver', () => {
	let window: Window;
	let document: Document;

	beforeEach(() => {
		window = new Window();
		document = window.document;
	});

	describe('observe()', () => {
		it('Does nothing.', async () => {
			const div = document.createElement('div');
			const observer = new window.IntersectionObserver(() => {}, {});

			observer.observe(div);
		});
	});

	describe('unobserve()', () => {
		it('Does nothing.', () => {
			const div = document.createElement('div');
			const observer = new window.IntersectionObserver(() => {}, {});

			observer.observe(div);
			observer.unobserve(div);
		});
	});

	describe('disconnect()', () => {
		it('Does nothing.', () => {
			const div = document.createElement('div');
			const observer = new window.IntersectionObserver(() => {}, {});

			observer.observe(div);
			observer.disconnect();
		});
	});

	describe('takeRecords()', () => {
		it('Returns empty array.', () => {
			const observer = new window.IntersectionObserver(() => {});

			expect(observer.takeRecords()).toEqual([]);
		});
	});
});

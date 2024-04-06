import Window from '../../../src/window/Window.js';
import Document from '../../../src/nodes/document/Document.js';
import Comment from '../../../src/nodes/comment/Comment.js';
import { beforeEach, describe, it, expect } from 'vitest';

describe('Comment', () => {
	let window: Window;
	let document: Document;

	beforeEach(() => {
		window = new Window();
		document = window.document;
	});

	describe('constructor()', () => {
		it('Creates a new Comment node.', () => {
			const node = new window.Comment('test');
			expect(node).toBeInstanceOf(Comment);
			expect(node.data).toBe('test');
		});
	});

	describe('get nodeName()', () => {
		it('Returns "#comment".', () => {
			const node = document.createComment('test');
			expect(node.nodeName).toBe('#comment');
		});
	});

	describe('toString()', () => {
		it('Returns "[object Comment]".', () => {
			const node = document.createComment('test');
			expect(node.toString()).toBe('[object Comment]');
		});
	});

	describe('cloneNode()', () => {
		it('Clones the node.', () => {
			const node = document.createComment('test');
			const clone = node.cloneNode();
			expect(clone.data).toBe(node.data);
		});
	});
});

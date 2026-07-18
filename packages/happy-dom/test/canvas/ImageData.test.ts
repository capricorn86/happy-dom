import { describe, it, expect, beforeEach, vi } from 'vitest';
import type BrowserWindow from '../../src/window/BrowserWindow.js';
import Window from '../../src/window/Window.js';

describe('ImageData', () => {
	let window: BrowserWindow;

	beforeEach(() => {
		window = new Window();
	});

	describe('constructor()', () => {
		it('Throws error if arguments length is less than 2', () => {
			expect(() => new (<any>window).ImageData()).toThrow(
				new TypeError(`Failed to construct 'ImageData': 2 arguments required, but only 0 present.`)
			);
			expect(() => new (<any>window).ImageData(800)).toThrow(
				new TypeError(`Failed to construct 'ImageData': 2 arguments required, but only 1 present.`)
			);
		});

		it('Throws error if width argument is not a number when dataArray is Uint8ClampedArray', () => {
			const dataArray = new Uint8ClampedArray(800 * 600 * 4);
			expect(() => new (<any>window).ImageData(dataArray, <number>(<unknown>'100'))).toThrow(
				new TypeError(`Failed to construct 'ImageData': The width argument must be a number.`)
			);
		});

		it('Throws error if height argument is not a number when dataArray is Uint8ClampedArray', () => {
			const dataArray = new Uint8ClampedArray(800 * 600 * 4);
			expect(() => new window.ImageData(dataArray, 800, <any>'600')).toThrow(
				new TypeError(`Failed to construct 'ImageData': The height argument must be a number.`)
			);
		});

		it('Throws error if height argument is not a number when dataArray is number', () => {
			expect(() => new window.ImageData(800, <any>'600')).toThrow(
				new TypeError(`Failed to construct 'ImageData': The height argument must be a number.`)
			);
		});

		it('Supports Uint8ClampedArray as argument with height not being set.', () => {
			const dataArray = new Uint8ClampedArray(800 * 600 * 4);
			const imageData = new window.ImageData(dataArray, 800);

			expect(imageData.data).toBe(dataArray);
			expect(imageData.width).toBe(800);
			expect(imageData.height).toBe(600);
		});

		it('Supports Uint8ClampedArray as argument with height being set.', () => {
			const dataArray = new Uint8ClampedArray(800 * 600 * 4);
			const imageData = new window.ImageData(dataArray, 800, 600);

			expect(imageData.data).toBe(dataArray);
			expect(imageData.width).toBe(800);
			expect(imageData.height).toBe(600);
		});

		it('Supports width and height.', () => {
			const imageData = new window.ImageData(800, 600);

			expect(imageData.data).toBeInstanceOf(Uint8ClampedArray);
			expect(imageData.data.length).toBe(800 * 600 * 4);
			expect(imageData.width).toBe(800);
			expect(imageData.height).toBe(600);
		});
	});

	describe('get data()', () => {
		it('Returns data.', () => {
			const dataArray = new Uint8ClampedArray(800 * 600 * 4);
			const imageData = new window.ImageData(dataArray, 800, 600);
			expect(imageData.data).toBe(dataArray);
		});
	});

	describe('get width()', () => {
		it('Returns width.', () => {
			const imageData = new window.ImageData(800, 600);
			expect(imageData.width).toBe(800);
		});
	});

	describe('get height()', () => {
		it('Returns height.', () => {
			const imageData = new window.ImageData(800, 600);
			expect(imageData.height).toBe(600);
		});
	});
});

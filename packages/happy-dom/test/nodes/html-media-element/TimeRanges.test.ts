import { describe, it, expect, beforeEach } from 'vitest';
import TimeRanges from '../../../src/nodes/html-media-element/TimeRanges.js';
import * as PropertySymbol from '../../../src/PropertySymbol.js';

describe('TimeRanges', () => {
	describe('constructor()', () => {
		it('Should throw an error if the "illegalConstructor" symbol is not sent to the constructor', () => {
			expect(() => new TimeRanges()).toThrow(new TypeError('Illegal constructor'));
		});

		it('Should not throw an error if the "illegalConstructor" symbol is provided', () => {
			expect(() => new TimeRanges(PropertySymbol.illegalConstructor)).not.toThrow();
		});
	});

	describe('get length()', () => {
		it('Should return 0 by default', () => {
			const timeRanges = new TimeRanges(PropertySymbol.illegalConstructor);
			expect(timeRanges.length).toBe(0);
		});
	});

	describe('get [Symbol.toStringTag]()', () => {
		it('Should return "TimeRanges"', () => {
			const timeRanges = new TimeRanges(PropertySymbol.illegalConstructor);
			expect(timeRanges[Symbol.toStringTag]).toBe('TimeRanges');
		});
	});

	describe('toLocaleString()', () => {
		it('Should return "[object TimeRanges]"', () => {
			const timeRanges = new TimeRanges(PropertySymbol.illegalConstructor);
			expect(timeRanges.toLocaleString()).toBe('[object TimeRanges]');
		});
	});

	describe('toString()', () => {
		it('Should return "[object TimeRanges]"', () => {
			const timeRanges = new TimeRanges(PropertySymbol.illegalConstructor);
			expect(timeRanges.toString()).toBe('[object TimeRanges]');
		});
	});

	describe('start()', () => {
		it('Should return "0" by default', () => {
			const timeRanges = new TimeRanges(PropertySymbol.illegalConstructor);
			expect(timeRanges.start(0)).toBe(0);
		});
	});

	describe('end()', () => {
		it('Should return "0" by default', () => {
			const timeRanges = new TimeRanges(PropertySymbol.illegalConstructor);
			expect(timeRanges.end(0)).toBe(0);
		});
	});
});

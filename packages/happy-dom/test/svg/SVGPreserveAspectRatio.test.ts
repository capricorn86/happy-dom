import { beforeEach, describe, it, expect } from 'vitest';
import BrowserWindow from '../../src/window/BrowserWindow.js';
import Window from '../../src/window/Window.js';
import * as PropertySymbol from '../../src/PropertySymbol.js';
import SVGPreserveAspectRatio from '../../src/svg/SVGPreserveAspectRatio.js';
import SVGPreserveAspectRatioMeetOrSliceEnum from '../../src/svg/SVGPreserveAspectRatioMeetOrSliceEnum.js';
import SVGPreserveAspectRatioAlignEnum from '../../src/svg/SVGPreserveAspectRatioAlignEnum.js';

describe('SVGPreserveAspectRatio', () => {
	let window: BrowserWindow;

	beforeEach(() => {
		window = new Window();
	});

	describe('constructor()', () => {
		it('Returns a new instance', () => {
			const aspectRatio = new window.SVGPreserveAspectRatio(
				PropertySymbol.illegalConstructor,
				window
			);
			expect(aspectRatio).toBeInstanceOf(SVGPreserveAspectRatio);
		});

		it('Throws an error if constructed without "illegalConstructor" symbol', () => {
			expect(() => new window.SVGPreserveAspectRatio(Symbol(''), window)).toThrow(
				new TypeError('Illegal constructor')
			);
		});
	});

	describe('get static SVG_MEETORSLICE_UNKNOWN()', () => {
		it('Returns SVGPreserveAspectRatioMeetOrSliceEnum.unknown', () => {
			expect(window.SVGPreserveAspectRatio.SVG_MEETORSLICE_UNKNOWN).toBe(
				SVGPreserveAspectRatioMeetOrSliceEnum.unknown
			);
		});
	});

	describe('get static SVG_MEETORSLICE_MEET()', () => {
		it('Returns SVGPreserveAspectRatioMeetOrSliceEnum.meet', () => {
			expect(window.SVGPreserveAspectRatio.SVG_MEETORSLICE_MEET).toBe(
				SVGPreserveAspectRatioMeetOrSliceEnum.meet
			);
		});
	});

	describe('get static SVG_MEETORSLICE_SLICE()', () => {
		it('Returns SVGPreserveAspectRatioMeetOrSliceEnum.slice', () => {
			expect(window.SVGPreserveAspectRatio.SVG_MEETORSLICE_SLICE).toBe(
				SVGPreserveAspectRatioMeetOrSliceEnum.slice
			);
		});
	});

	describe('get static SVG_PRESERVEASPECTRATIO_UNKNOWN()', () => {
		it('Returns SVGPreserveAspectRatioAlignEnum.unknown', () => {
			expect(window.SVGPreserveAspectRatio.SVG_PRESERVEASPECTRATIO_UNKNOWN).toBe(
				SVGPreserveAspectRatioAlignEnum.unknown
			);
		});
	});

	describe('get static SVG_PRESERVEASPECTRATIO_NONE()', () => {
		it('Returns SVGPreserveAspectRatioAlignEnum.none', () => {
			expect(window.SVGPreserveAspectRatio.SVG_PRESERVEASPECTRATIO_NONE).toBe(
				SVGPreserveAspectRatioAlignEnum.none
			);
		});
	});

	describe('get static SVG_PRESERVEASPECTRATIO_XMINYMIN()', () => {
		it('Returns SVGPreserveAspectRatioAlignEnum.xMinYMin', () => {
			expect(window.SVGPreserveAspectRatio.SVG_PRESERVEASPECTRATIO_XMINYMIN).toBe(
				SVGPreserveAspectRatioAlignEnum.xMinYMin
			);
		});
	});

	describe('get static SVG_PRESERVEASPECTRATIO_XMIDYMIN()', () => {
		it('Returns SVGPreserveAspectRatioAlignEnum.xMidYMin', () => {
			expect(window.SVGPreserveAspectRatio.SVG_PRESERVEASPECTRATIO_XMIDYMIN).toBe(
				SVGPreserveAspectRatioAlignEnum.xMidYMin
			);
		});
	});

	describe('get static SVG_PRESERVEASPECTRATIO_XMAXYMIN()', () => {
		it('Returns SVGPreserveAspectRatioAlignEnum.xMaxYMin', () => {
			expect(window.SVGPreserveAspectRatio.SVG_PRESERVEASPECTRATIO_XMAXYMIN).toBe(
				SVGPreserveAspectRatioAlignEnum.xMaxYMin
			);
		});
	});

	describe('get static SVG_PRESERVEASPECTRATIO_XMINYMID()', () => {
		it('Returns SVGPreserveAspectRatioAlignEnum.xMinYMid', () => {
			expect(window.SVGPreserveAspectRatio.SVG_PRESERVEASPECTRATIO_XMINYMID).toBe(
				SVGPreserveAspectRatioAlignEnum.xMinYMid
			);
		});
	});

	describe('get static SVG_PRESERVEASPECTRATIO_XMIDYMID()', () => {
		it('Returns SVGPreserveAspectRatioAlignEnum.xMidYMid', () => {
			expect(window.SVGPreserveAspectRatio.SVG_PRESERVEASPECTRATIO_XMIDYMID).toBe(
				SVGPreserveAspectRatioAlignEnum.xMidYMid
			);
		});
	});

	describe('get static SVG_PRESERVEASPECTRATIO_XMAXYMID()', () => {
		it('Returns SVGPreserveAspectRatioAlignEnum.xMaxYMid', () => {
			expect(window.SVGPreserveAspectRatio.SVG_PRESERVEASPECTRATIO_XMAXYMID).toBe(
				SVGPreserveAspectRatioAlignEnum.xMaxYMid
			);
		});
	});

	describe('get static SVG_PRESERVEASPECTRATIO_XMINYMAX()', () => {
		it('Returns SVGPreserveAspectRatioAlignEnum.xMinYMax', () => {
			expect(window.SVGPreserveAspectRatio.SVG_PRESERVEASPECTRATIO_XMINYMAX).toBe(
				SVGPreserveAspectRatioAlignEnum.xMinYMax
			);
		});
	});

	describe('get static SVG_PRESERVEASPECTRATIO_XMIDYMAX()', () => {
		it('Returns SVGPreserveAspectRatioAlignEnum.xMidYMax', () => {
			expect(window.SVGPreserveAspectRatio.SVG_PRESERVEASPECTRATIO_XMIDYMAX).toBe(
				SVGPreserveAspectRatioAlignEnum.xMidYMax
			);
		});
	});

	describe('get static SVG_PRESERVEASPECTRATIO_XMAXYMAX()', () => {
		it('Returns SVGPreserveAspectRatioAlignEnum.xMaxYMax', () => {
			expect(window.SVGPreserveAspectRatio.SVG_PRESERVEASPECTRATIO_XMAXYMAX).toBe(
				SVGPreserveAspectRatioAlignEnum.xMaxYMax
			);
		});
	});

	describe('get align()', () => {
		it('Returns SVGPreserveAspectRatioAlignEnum.xMidYMid by default', () => {
			const aspectRatio = new window.SVGPreserveAspectRatio(
				PropertySymbol.illegalConstructor,
				window
			);
			expect(aspectRatio.align).toBe(SVGPreserveAspectRatioAlignEnum.xMidYMid);
		});

		it('Returns value from attribute', () => {
			const aspectRatio = new window.SVGPreserveAspectRatio(
				PropertySymbol.illegalConstructor,
				window,
				{
					getAttribute: () => 'xMaxYMax slice'
				}
			);
			expect(aspectRatio.align).toBe(SVGPreserveAspectRatioAlignEnum.xMaxYMax);
		});

		it('Returns defined value', () => {
			const aspectRatio = new window.SVGPreserveAspectRatio(
				PropertySymbol.illegalConstructor,
				window
			);
			aspectRatio.align = SVGPreserveAspectRatioAlignEnum.xMidYMax;
			expect(aspectRatio.align).toBe(SVGPreserveAspectRatioAlignEnum.xMidYMax);
			expect(aspectRatio[PropertySymbol.attributeValue]).toBe('xMidYMax meet');
		});
	});

	describe('set align()', () => {
		it('Sets value to attribute', () => {
			let attribute = 'xMaxYMax slice';
			const aspectRatio = new window.SVGPreserveAspectRatio(
				PropertySymbol.illegalConstructor,
				window,
				{
					getAttribute: () => attribute,
					setAttribute: (value) => (attribute = value)
				}
			);
			aspectRatio.align = SVGPreserveAspectRatioAlignEnum.xMidYMid;
			expect(attribute).toBe('xMidYMid slice');
		});

		it('Throws an error if read only', () => {
			const aspectRatio = new window.SVGPreserveAspectRatio(
				PropertySymbol.illegalConstructor,
				window,
				{
					readOnly: true
				}
			);
			expect(() => (aspectRatio.align = SVGPreserveAspectRatioAlignEnum.xMidYMax)).toThrow(
				new TypeError(
					`Failed to set the 'align' property on 'SVGPreserveAspectRatio': The object is read-only.`
				)
			);
		});
	});

	describe('get meetOrSlice()', () => {
		it('Returns SVGPreserveAspectRatioMeetOrSliceEnum.meet by default', () => {
			const aspectRatio = new window.SVGPreserveAspectRatio(
				PropertySymbol.illegalConstructor,
				window
			);
			expect(aspectRatio.meetOrSlice).toBe(SVGPreserveAspectRatioMeetOrSliceEnum.meet);
		});

		it('Returns value from attribute', () => {
			const aspectRatio = new window.SVGPreserveAspectRatio(
				PropertySymbol.illegalConstructor,
				window,
				{
					getAttribute: () => 'xMaxYMax slice'
				}
			);
			expect(aspectRatio.meetOrSlice).toBe(SVGPreserveAspectRatioMeetOrSliceEnum.slice);
		});

		it('Returns defined value', () => {
			const aspectRatio = new window.SVGPreserveAspectRatio(
				PropertySymbol.illegalConstructor,
				window
			);
			aspectRatio.meetOrSlice = SVGPreserveAspectRatioMeetOrSliceEnum.slice;
			expect(aspectRatio.meetOrSlice).toBe(SVGPreserveAspectRatioMeetOrSliceEnum.slice);
			expect(aspectRatio[PropertySymbol.attributeValue]).toBe('xMidYMid slice');
		});
	});

	describe('set meetOrSlice()', () => {
		it('Sets value to attribute', () => {
			let attribute = 'xMaxYMax slice';
			const aspectRatio = new window.SVGPreserveAspectRatio(
				PropertySymbol.illegalConstructor,
				window,
				{
					getAttribute: () => attribute,
					setAttribute: (value) => (attribute = value)
				}
			);
			expect(aspectRatio.meetOrSlice).toBe(SVGPreserveAspectRatioMeetOrSliceEnum.slice);
			aspectRatio.meetOrSlice = SVGPreserveAspectRatioMeetOrSliceEnum.meet;
			expect(attribute).toBe('xMaxYMax meet');
		});

		it('Throws an error if read only', () => {
			const aspectRatio = new window.SVGPreserveAspectRatio(
				PropertySymbol.illegalConstructor,
				window,
				{
					readOnly: true
				}
			);
			expect(() => (aspectRatio.meetOrSlice = SVGPreserveAspectRatioMeetOrSliceEnum.slice)).toThrow(
				new TypeError(
					`Failed to set the 'meetOrSlice' property on 'SVGPreserveAspectRatio': The object is read-only.`
				)
			);
		});
	});
});

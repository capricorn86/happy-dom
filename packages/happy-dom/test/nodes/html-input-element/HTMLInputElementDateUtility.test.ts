import { describe, it, expect } from 'vitest';
import HTMLInputElementDateUtility from '../../../src/nodes/html-input-element/HTMLInputElementDateUtility.js';

describe('HTMLInputElementDateUtility', () => {
	describe('dateIsoWeek()', () => {
		it('Returns the ISO week number', () => {
			expect(HTMLInputElementDateUtility.dateIsoWeek(new Date('2021-01-01'))).toBe('2020-W53');
			expect(HTMLInputElementDateUtility.dateIsoWeek(new Date('2021-01-03'))).toBe('2020-W53');
			expect(HTMLInputElementDateUtility.dateIsoWeek(new Date('2021-01-04'))).toBe('2021-W01');
			expect(HTMLInputElementDateUtility.dateIsoWeek(new Date('2021-01-10'))).toBe('2021-W01');
			expect(HTMLInputElementDateUtility.dateIsoWeek(new Date('2015-10-19'))).toBe('2015-W43');
			expect(HTMLInputElementDateUtility.dateIsoWeek(new Date('2023-01-01'))).toBe('2022-W52');
			expect(HTMLInputElementDateUtility.dateIsoWeek(new Date('2023-01-02'))).toBe('2023-W01');
			expect(HTMLInputElementDateUtility.dateIsoWeek(new Date('2024-01-01'))).toBe('2024-W01');
			expect(HTMLInputElementDateUtility.dateIsoWeek(new Date('2025-01-01'))).toBe('2025-W01');
			expect(HTMLInputElementDateUtility.dateIsoWeek(new Date('1977-01-01'))).toBe('1976-W53');
			expect(HTMLInputElementDateUtility.dateIsoWeek(new Date('1977-01-02'))).toBe('1976-W53');
			expect(HTMLInputElementDateUtility.dateIsoWeek(new Date('1977-12-31'))).toBe('1977-W52');
			expect(HTMLInputElementDateUtility.dateIsoWeek(new Date('1978-01-01'))).toBe('1977-W52');
			expect(HTMLInputElementDateUtility.dateIsoWeek(new Date('1978-01-02'))).toBe('1978-W01');
			expect(HTMLInputElementDateUtility.dateIsoWeek(new Date('1978-12-31'))).toBe('1978-W52');
			expect(HTMLInputElementDateUtility.dateIsoWeek(new Date('1979-01-01'))).toBe('1979-W01');
			expect(HTMLInputElementDateUtility.dateIsoWeek(new Date('1979-12-30'))).toBe('1979-W52');
			expect(HTMLInputElementDateUtility.dateIsoWeek(new Date('1979-12-31'))).toBe('1980-W01');
			expect(HTMLInputElementDateUtility.dateIsoWeek(new Date('1980-01-01'))).toBe('1980-W01');
			expect(HTMLInputElementDateUtility.dateIsoWeek(new Date('1980-12-28'))).toBe('1980-W52');
			expect(HTMLInputElementDateUtility.dateIsoWeek(new Date('1980-12-29'))).toBe('1981-W01');
			expect(HTMLInputElementDateUtility.dateIsoWeek(new Date('1980-12-30'))).toBe('1981-W01');
			expect(HTMLInputElementDateUtility.dateIsoWeek(new Date('1980-12-31'))).toBe('1981-W01');
			expect(HTMLInputElementDateUtility.dateIsoWeek(new Date('1981-01-01'))).toBe('1981-W01');
			expect(HTMLInputElementDateUtility.dateIsoWeek(new Date('1981-12-31'))).toBe('1981-W53');
			expect(HTMLInputElementDateUtility.dateIsoWeek(new Date('1982-01-01'))).toBe('1981-W53');
			expect(HTMLInputElementDateUtility.dateIsoWeek(new Date('1982-01-03'))).toBe('1981-W53');
			expect(HTMLInputElementDateUtility.dateIsoWeek(new Date('1982-01-04'))).toBe('1982-W01');
		});
	});

	describe('isoWeekDate()', () => {
		it('Returns the ISO week number', () => {
			expect(HTMLInputElementDateUtility.isoWeekDate('2020-W53')).toEqual(
				new Date('2020-12-28T00:00Z')
			);
			expect(HTMLInputElementDateUtility.isoWeekDate('2021-W53')).toEqual(new Date('x'));
			expect(HTMLInputElementDateUtility.isoWeekDate('2021-W01')).toEqual(
				new Date('2021-01-04T00:00Z')
			);
			expect(HTMLInputElementDateUtility.isoWeekDate('2015-W43')).toEqual(
				new Date('2015-10-19T00:00Z')
			);
			expect(HTMLInputElementDateUtility.isoWeekDate('2023-W01')).toEqual(
				new Date('2023-01-02T00:00Z')
			);
			expect(HTMLInputElementDateUtility.isoWeekDate('2023-W52')).toEqual(
				new Date('2023-12-25T00:00Z')
			);
			expect(HTMLInputElementDateUtility.isoWeekDate('2024-W01')).toEqual(
				new Date('2024-01-01T00:00Z')
			);
			expect(HTMLInputElementDateUtility.isoWeekDate('2025-W01')).toEqual(
				new Date('2024-12-30T00:00Z')
			);
			expect(HTMLInputElementDateUtility.isoWeekDate('1976-W53')).toEqual(
				new Date('1976-12-27T00:00Z')
			);
			expect(HTMLInputElementDateUtility.isoWeekDate('1977-W53')).toEqual(new Date('x'));
			expect(HTMLInputElementDateUtility.isoWeekDate('1977-W52')).toEqual(
				new Date('1977-12-26T00:00Z')
			);
			expect(HTMLInputElementDateUtility.isoWeekDate('1978-W52')).toEqual(
				new Date('1978-12-25T00:00Z')
			);
			expect(HTMLInputElementDateUtility.isoWeekDate('1978-W01')).toEqual(
				new Date('1978-01-02T00:00Z')
			);
			expect(HTMLInputElementDateUtility.isoWeekDate('1979-W01')).toEqual(
				new Date('1979-01-01T00:00Z')
			);
			expect(HTMLInputElementDateUtility.isoWeekDate('1979-W52')).toEqual(
				new Date('1979-12-24T00:00Z')
			);
			expect(HTMLInputElementDateUtility.isoWeekDate('1980-W01')).toEqual(
				new Date('1979-12-31T00:00Z')
			);
			expect(HTMLInputElementDateUtility.isoWeekDate('1980-W52')).toEqual(
				new Date('1980-12-22T00:00Z')
			);
			expect(HTMLInputElementDateUtility.isoWeekDate('1981-W01')).toEqual(
				new Date('1980-12-29T00:00Z')
			);
			expect(HTMLInputElementDateUtility.isoWeekDate('1981-W53')).toEqual(
				new Date('1981-12-28T00:00Z')
			);
			expect(HTMLInputElementDateUtility.isoWeekDate('1982-W01')).toEqual(
				new Date('1982-01-04T00:00Z')
			);
			expect(HTMLInputElementDateUtility.isoWeekDate('1982-W53')).toEqual(new Date('x'));
		});
	});
});

import Window from '../../../src/window/Window.js';
import Document from '../../../src/nodes/document/Document.js';
import HTMLInputElement from '../../../src/nodes/html-input-element/HTMLInputElement.js';
import HTMLInputElementValueSanitizer from '../../../src/nodes/html-input-element/HTMLInputElementValueSanitizer.js';
import HTMLInputElement from '../../../src/nodes/html-input-element/HTMLInputElement.js';
import { beforeEach, describe, it, expect } from 'vitest';

describe('HTMLInputElementValueSanitizer', () => {
	describe('sanitize', () => {
		let window: Window;
		let document: Document;
		let input: HTMLInputElement;

		beforeEach(() => {
			window = new Window();
			document = window.document;
			input = <HTMLInputElement>document.createElement('input');
		});

		type TestCase = {
			value: string;
			want: string;
			attributes?: { [key: string]: string };
		};

		const testCases: Record<string, TestCase[]> = {
			number: [
				{ value: '1.25', want: '1.25' },
				{ value: 'not a number', want: '' },
				{ value: 'NaN', want: '' }
			],
			range: [
				{ value: '25', want: '25' },
				{ value: 'NaN', want: '50' },
				{ value: '-1', want: '0' },
				{ value: '101', want: '100' }
			],
			date: [
				{ value: '2020-01-01', want: '2020-01-01' },
				{ value: 'NaN', want: '' },
				{ value: '2020-01-00', want: '' },
				{ value: '2020-02-31', want: '' },
				{ value: '2020-13-01', want: '' },
				{ value: '2020-01-1', want: '' },
				{ value: '2020-01-01', want: '', attributes: { min: '2020-01-02' } },
				{ value: '2020-01-01', want: '', attributes: { max: '2019-12-31' } }
			],
			'datetime-local': [
				{ value: '2020-01-01T00:00', want: '2020-01-01T00:00' },
				{ value: 'unknown', want: '' },
				{ value: '2020-01-01 01:00', want: '2020-01-01T01:00' },
				{ value: '2020-01-01T00:00:59', want: '2020-01-01T00:00:59' },
				{ value: '2020-01-01T00:00:59.1', want: '2020-01-01T00:00:59.1' },
				{ value: '2020-01-01T00:00:59.123', want: '2020-01-01T00:00:59.123' },
				{ value: '2020-01-01T00:00:59.1234', want: '' },
				{ value: '2020-01-01T00:00:01.000', want: '2020-01-01T00:00:01' },
				{ value: '2020-01-01T00:00:00.010', want: '2020-01-01T00:00:00.01' },
				{ value: '2020-01-01T00:00:00.100', want: '2020-01-01T00:00:00.1' },
				{ value: '2020-01-01T00:00:00.000', want: '2020-01-01T00:00' },
				{ value: '2020-01-01T00:00:00', want: '2020-01-01T00:00' }
			],
			month: [
				{ value: '2020-01', want: '2020-01' },
				{ value: 'NaN', want: '' },
				{ value: '0000-01', want: '' },
				{ value: '2020-13', want: '' },
				{ value: '2020-00', want: '' },
				{ value: '2020-01', want: '', attributes: { min: '2020-02' } },
				{ value: '2020-01', want: '', attributes: { max: '2019-12' } }
			],
			time: [
				{ value: '00:00', want: '00:00' },
				{ value: '00:00:00.000', want: '00:00' },
				{ value: '00:00:09.000', want: '00:00:09' },
				{ value: '00:00:10.000', want: '00:00:10' },
				{ value: '00:00:59', want: '00:00:59' },
				{ value: '00:00:59.1', want: '00:00:59.1' },
				{ value: '00:00:59.123', want: '00:00:59.123' },
				{ value: '13:00', want: '13:00' },
				{ value: 'NaN', want: '' },
				{ value: '24:00', want: '' },
				{ value: '00:60', want: '' },
				{ value: '00:00:60', want: '' },
				{ value: '00:00:', want: '' },
				{ value: '00:00:00.1234', want: '' }
			],
			week: [
				{ value: '2020-W01', want: '2020-W01' },
				{ value: 'NaN', want: '' },
				{ value: '2020-W00', want: '' },
				{ value: '2020-W54', want: '' },
				{ value: '2020-W01', want: '', attributes: { min: '2020-W02' } },
				{ value: '2020-W01', want: '', attributes: { max: '2019-W53' } }
			]
		};

		Object.keys(testCases).forEach((type) => {
			describe(`For input type ${type}`, () => {
				it.each(testCases[type])(
					`Should return "$want" for value "$value"`,
					({ value, want, attributes }) => {
						input.type = type;
						if (attributes) {
							Object.entries(attributes).forEach(([attr, val]) => input.setAttribute(attr, val));
						}
						expect(HTMLInputElementValueSanitizer.sanitize(<HTMLInputElement>input, value)).toBe(
							want
						);
					}
				);
			});
		});
	});
});

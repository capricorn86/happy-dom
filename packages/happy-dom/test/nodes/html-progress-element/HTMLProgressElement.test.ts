import HTMLProgressElement from '../../../src/nodes/html-progress-element/HTMLProgressElement.js';
import Window from '../../../src/window/Window.js';
import Document from '../../../src/nodes/document/Document.js';
import { beforeEach, describe, it, expect } from 'vitest';

describe('HTMLProgressElement', () => {
	let window: Window;
	let document: Document;
	let element: HTMLProgressElement;

	beforeEach(() => {
		window = new Window();
		document = window.document;
		element = document.createElement('progress');
	});

	describe('constructor()', () => {
		it('Should be an instanceof HTMLProgressElement', () => {
			expect(element instanceof HTMLProgressElement).toBe(true);
		});
	});

	describe('get max()', () => {
		it('Should return the default value "1" when no value has been set.', () => {
			expect(element.max).toBe(1);
		});

		it('Should return the default value "1" when set value is invalid.', () => {
			element.setAttribute('max', 'invalid');
			expect(element.max).toBe(1);
		});

		it('Should return the default value "1" when the value is negative.', () => {
			element.setAttribute('max', '-1');
			expect(element.max).toBe(1);
		});

		it('Should return the value when it is valid.', () => {
			element.setAttribute('max', '2');
			expect(element.max).toBe(2);
			element.setAttribute('max', '0.5');
			expect(element.max).toBe(0.5);
		});
	});

	describe('set max()', () => {
		it('Should set the value to the default value 1 when the provided value is negative.', () => {
			element.max = -1;
			expect(element.getAttribute('max')).toBe('1');
		});

		it('Should set the value.', () => {
			element.max = 2;
			expect(element.getAttribute('max')).toBe('2');
			element.max = 0.5;
			expect(element.getAttribute('max')).toBe('0.5');
		});

		it('Should convert strings to numbers.', () => {
			element.max = <number>(<unknown>'2');
			expect(element.getAttribute('max')).toBe('2');
			element.max = <number>(<unknown>'0.5');
			expect(element.getAttribute('max')).toBe('0.5');
		});

		it('Should throw an error when the value is not a number.', () => {
			expect(() => {
				element.max = <number>(<unknown>'invalid');
			}).toThrow(
				new TypeError(
					"Failed to set the 'max' property on 'HTMLProgressElement': The provided double value is non-finite."
				)
			);
		});
	});

	describe('get value()', () => {
		it('Should return the default value "0" when no value has been set.', () => {
			expect(element.value).toBe(0);
		});

		it('Should return the default value "0" when set value is invalid.', () => {
			element.setAttribute('value', 'invalid');
			expect(element.value).toBe(0);
		});

		it('Should return the default value "0" when the value is negative.', () => {
			element.setAttribute('value', '-1');
			expect(element.value).toBe(0);
		});

		it('Should return the value when it is valid.', () => {
			element.setAttribute('value', '2');
			expect(element.value).toBe(2);
			element.setAttribute('value', '0.5');
			expect(element.value).toBe(0.5);
		});
	});

	describe('set value()', () => {
		it('Should set the value to the default value 0 when the provided value is negative.', () => {
			element.value = -1;
			expect(element.getAttribute('value')).toBe('0');
		});

		it('Should set the value.', () => {
			element.value = 2;
			expect(element.getAttribute('value')).toBe('2');
			element.value = 0.5;
			expect(element.getAttribute('value')).toBe('0.5');
		});

		it('Should convert strings to numbers.', () => {
			element.value = <number>(<unknown>'2');
			expect(element.getAttribute('value')).toBe('2');
			element.value = <number>(<unknown>'0.5');
			expect(element.getAttribute('value')).toBe('0.5');
		});

		it('Should throw an error when the value is not a number.', () => {
			expect(() => {
				element.value = <number>(<unknown>'invalid');
			}).toThrow(
				new TypeError(
					"Failed to set the 'value' property on 'HTMLProgressElement': The provided double value is non-finite."
				)
			);
		});
	});

	describe('get position()', () => {
		it('Should return -1 when no value has been set.', () => {
			expect(element.position).toBe(-1);
		});

		it('Should return 0 when value is 0.', () => {
			element.setAttribute('value', '0');
			expect(element.position).toBe(0);
		});

		it('Should return the value divided by max.', () => {
			element.max = 10;
			element.value = 1;
			expect(element.position).toBe(0.1);
		});
	});

	describe('get labels()', () => {
		it('Returns associated labels', () => {
			const label1 = document.createElement('label');
			const label2 = document.createElement('label');
			const parentLabel = document.createElement('label');

			label1.setAttribute('for', 'meter1');
			label2.setAttribute('for', 'meter1');

			element.id = 'meter1';

			parentLabel.appendChild(element);
			document.body.appendChild(label1);
			document.body.appendChild(label2);
			document.body.appendChild(parentLabel);

			const labels = element.labels;

			expect(labels.length).toBe(3);
			expect(labels[0] === label1).toBe(true);
			expect(labels[1] === label2).toBe(true);
			expect(labels[2] === parentLabel).toBe(true);
		});
	});
});

import HTMLMeterElement from '../../../src/nodes/html-meter-element/HTMLMeterElement.js';
import Window from '../../../src/window/Window.js';
import Document from '../../../src/nodes/document/Document.js';
import { beforeEach, describe, it, expect } from 'vitest';

describe('HTMLMeterElement', () => {
	let window: Window;
	let document: Document;
	let element: HTMLMeterElement;

	beforeEach(() => {
		window = new Window();
		document = window.document;
		element = document.createElement('meter');
	});

	describe('constructor()', () => {
		it('Should be an instanceof HTMLMeterElement', () => {
			expect(element instanceof HTMLMeterElement).toBe(true);
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

	for (const property of [
		{ name: 'high', default: 1 },
		{ name: 'low', default: 0 },
		{ name: 'max', default: 1 },
		{ name: 'min', default: 0 },
		{ name: 'optimum', default: 0.5 },
		{ name: 'value', default: 0 }
	]) {
		describe(`get ${property.name}()`, () => {
			it(`Should return the default value "${property.default}" when no value has been set.`, () => {
				expect(element[property.name]).toBe(property.default);
			});

			it(`Should return the default value "${property.default}" when set value is invalid.`, () => {
				element.setAttribute(property.name, 'invalid');
				expect(element[property.name]).toBe(property.default);
			});

			it('Should return 1 when value is greater than 1.', () => {
				element.setAttribute(property.name, '2');
				expect(element[property.name]).toBe(1);
				element.setAttribute(property.name, '1.1');
				expect(element[property.name]).toBe(1);
			});

			it('Should return 0 when value is less than 0.', () => {
				element.setAttribute(property.name, '-1');
				expect(element[property.name]).toBe(0);
				element.setAttribute(property.name, '-0.1');
				expect(element[property.name]).toBe(0);
			});

			it('Should return the value when value is valid.', () => {
				element.setAttribute(property.name, '0.5');
				expect(element[property.name]).toBe(0.5);
			});
		});

		describe(`set ${property.name}()`, () => {
			it('Should set the value.', () => {
				element[property.name] = 0.5;
				expect(element.getAttribute(property.name)).toBe('0.5');
			});

			it('Should set the value as attribute when it is of type number.', () => {
				element[property.name] = 0.5;
				expect(element.getAttribute(property.name)).toBe('0.5');
			});

			it('Should convert strings to number.', () => {
				element[property.name] = '0.5';
				expect(element.getAttribute(property.name)).toBe('0.5');
			});

			it('Should throw an error when the value is not a number.', () => {
				expect(() => {
					element[property.name] = 'invalid';
				}).toThrow(
					new TypeError(
						`Failed to set the '${property.name}' property on 'HTMLMeterElement': The provided double value is non-finite.`
					)
				);
			});
		});
	}
});

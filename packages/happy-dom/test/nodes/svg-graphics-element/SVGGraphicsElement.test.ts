import Window from '../../../src/window/Window.js';
import Document from '../../../src/nodes/document/Document.js';
import { beforeEach, describe, it, expect } from 'vitest';
import SVGGraphicsElement from '../../../src/nodes/svg-graphics-element/SVGGraphicsElement.js';
import SVGTransformTypeEnum from '../../../src/svg/SVGTransformTypeEnum.js';
import * as PropertySymbol from '../../../src/PropertySymbol.js';
import SVGElement from '../../../src/nodes/svg-element/SVGElement.js';
import Event from '../../../src/event/Event.js';

describe('SVGGraphicsElement', () => {
	let window: Window;
	let document: Document;
	let element: SVGGraphicsElement;

	beforeEach(() => {
		window = new Window();
		document = window.document;
		element = document.createElementNS('http://www.w3.org/2000/svg', 'g');
	});

	describe('constructor()', () => {
		it('Should be an instanceof SVGGraphicsElement', () => {
			expect(element instanceof SVGGraphicsElement).toBe(true);
		});

		it('Should be an instanceof SVGElement', () => {
			expect(element instanceof SVGElement).toBe(true);
		});
	});

	for (const event of ['copy', 'cut', 'paste']) {
		describe(`get on${event}()`, () => {
			it('Returns the event listener.', () => {
				element.setAttribute(`on${event}`, 'window.test = 1');
				expect(element[`on${event}`]).toBeTypeOf('function');
				element[`on${event}`](new Event(event));
				expect(window['test']).toBe(1);
			});
		});

		describe(`set on${event}()`, () => {
			it('Sets the event listener.', () => {
				element[`on${event}`] = () => {
					window['test'] = 1;
				};
				element.dispatchEvent(new Event(event));
				expect(element.getAttribute(`on${event}`)).toBe(null);
				expect(window['test']).toBe(1);
			});
		});
	}

	describe('get requiredExtensions()', () => {
		it('Should return an instance of SVGStringList', () => {
			const requiredExtensions = element.requiredExtensions;
			expect(requiredExtensions).toBeInstanceOf(window.SVGStringList);
			expect(element.requiredExtensions).toBe(requiredExtensions);
		});

		it('Reflects the "requiredExtensions" attribute', () => {
			element.setAttribute('requiredExtensions', 'key1 key2');

			expect(element.requiredExtensions.length).toBe(2);
			expect(element.requiredExtensions[0]).toBe('key1');
			expect(element.requiredExtensions[1]).toBe('key2');

			element.setAttribute('requiredExtensions', 'key3 key4');

			expect(element.requiredExtensions.length).toBe(2);
			expect(element.requiredExtensions[0]).toBe('key3');
			expect(element.requiredExtensions[1]).toBe('key4');

			element.requiredExtensions.appendItem('key5');

			expect(element.getAttribute('requiredExtensions')).toBe('key3 key4 key5');

			element.requiredExtensions.removeItem(1);

			expect(element.getAttribute('requiredExtensions')).toBe('key3 key5');

			element.requiredExtensions.clear();

			expect(element.getAttribute('requiredExtensions')).toBe('');
		});
	});

	describe('get systemLanguage()', () => {
		it('Should return an instance of SVGStringList', () => {
			const systemLanguage = element.systemLanguage;
			expect(systemLanguage).toBeInstanceOf(window.SVGStringList);
			expect(element.systemLanguage).toBe(systemLanguage);
		});

		it('Reflects the "systemLanguage" attribute', () => {
			element.setAttribute('systemLanguage', 'key1 key2');

			expect(element.systemLanguage.length).toBe(2);
			expect(element.systemLanguage[0]).toBe('key1');
			expect(element.systemLanguage[1]).toBe('key2');

			element.setAttribute('systemLanguage', 'key3 key4');

			expect(element.systemLanguage.length).toBe(2);
			expect(element.systemLanguage[0]).toBe('key3');
			expect(element.systemLanguage[1]).toBe('key4');

			element.systemLanguage.appendItem('key5');

			expect(element.getAttribute('systemLanguage')).toBe('key3 key4 key5');

			element.systemLanguage.removeItem(1);

			expect(element.getAttribute('systemLanguage')).toBe('key3 key5');

			element.systemLanguage.clear();

			expect(element.getAttribute('systemLanguage')).toBe('');
		});
	});

	describe('get transform()', () => {
		it('Should return an instance of SVGAnimatedTransformList', () => {
			const transform = element.transform;
			expect(transform).toBeInstanceOf(window.SVGAnimatedTransformList);
			expect(element.transform).toBe(transform);
		});

		it('Reflects the "transform" attribute', () => {
			element.setAttribute('transform', 'matrix(1 2 3 4 5 6) translate(10 20)');

			expect(element.transform.baseVal.numberOfItems).toBe(2);
			expect(element.transform.baseVal.getItem(0).type).toBe(SVGTransformTypeEnum.matrix);
			expect(element.transform.baseVal.getItem(0).matrix.a).toBe(1);
			expect(element.transform.baseVal.getItem(0).matrix.b).toBe(2);
			expect(element.transform.baseVal.getItem(0).matrix.c).toBe(3);
			expect(element.transform.baseVal.getItem(0).matrix.d).toBe(4);
			expect(element.transform.baseVal.getItem(0).matrix.e).toBe(5);
			expect(element.transform.baseVal.getItem(0).matrix.f).toBe(6);

			expect(element.transform.baseVal.getItem(1).type).toBe(SVGTransformTypeEnum.translate);
			expect(element.transform.baseVal.getItem(1).matrix.a).toBe(1);
			expect(element.transform.baseVal.getItem(1).matrix.b).toBe(0);
			expect(element.transform.baseVal.getItem(1).matrix.c).toBe(0);
			expect(element.transform.baseVal.getItem(1).matrix.d).toBe(1);
			expect(element.transform.baseVal.getItem(1).matrix.e).toBe(10);
			expect(element.transform.baseVal.getItem(1).matrix.f).toBe(20);

			expect(element.transform.animVal.numberOfItems).toBe(2);
			expect(element.transform.animVal.getItem(0).type).toBe(SVGTransformTypeEnum.matrix);
			expect(element.transform.animVal.getItem(0).matrix.a).toBe(1);
			expect(element.transform.animVal.getItem(0).matrix.b).toBe(2);
			expect(element.transform.animVal.getItem(0).matrix.c).toBe(3);
			expect(element.transform.animVal.getItem(0).matrix.d).toBe(4);
			expect(element.transform.animVal.getItem(0).matrix.e).toBe(5);
			expect(element.transform.animVal.getItem(0).matrix.f).toBe(6);

			expect(element.transform.animVal.getItem(1).type).toBe(SVGTransformTypeEnum.translate);
			expect(element.transform.animVal.getItem(1).matrix.a).toBe(1);
			expect(element.transform.animVal.getItem(1).matrix.b).toBe(0);
			expect(element.transform.animVal.getItem(1).matrix.c).toBe(0);
			expect(element.transform.animVal.getItem(1).matrix.d).toBe(1);
			expect(element.transform.animVal.getItem(1).matrix.e).toBe(10);
			expect(element.transform.animVal.getItem(1).matrix.f).toBe(20);

			const transform = new window.SVGTransform(PropertySymbol.illegalConstructor, window);

			transform.setScale(10, 20);

			element.transform.baseVal.initialize(transform);

			expect(element.getAttribute('transform')).toBe('scale(10 20)');

			// Does nothing
			expect(() =>
				element.transform.animVal.initialize(
					new window.SVGTransform(PropertySymbol.illegalConstructor, window)
				)
			).toThrow(
				new TypeError(
					`Failed to execute 'initialize' on 'SVGTransformList': The object is read-only.`
				)
			);
		});
	});

	describe('getBBBox()', () => {
		it('Should return an instance of DOMRect', () => {
			expect(element.getBBox()).toBeInstanceOf(window.DOMRect);
		});
	});

	describe('getCTM()', () => {
		it('Should return an instance of DOMMatrix', () => {
			expect(element.getCTM()).toBeInstanceOf(window.DOMMatrix);
		});
	});

	describe('getScreenCTM()', () => {
		it('Should return an instance of DOMMatrix', () => {
			expect(element.getScreenCTM()).toBeInstanceOf(window.DOMMatrix);
		});
	});
});

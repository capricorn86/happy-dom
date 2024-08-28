import HTMLLegendElement from '../../../src/nodes/html-legend-element/HTMLLegendElement.js';
import Window from '../../../src/window/Window.js';
import Document from '../../../src/nodes/document/Document.js';
import { beforeEach, describe, it, expect } from 'vitest';

describe('HTMLLegendElement', () => {
	let window: Window;
	let document: Document;
	let element: HTMLLegendElement;

	beforeEach(() => {
		window = new Window();
		document = window.document;
		element = document.createElement('legend');
	});

	describe('constructor()', () => {
		it('Should be an instanceof HTMLLegendElement', () => {
			expect(element instanceof HTMLLegendElement).toBe(true);
		});
	});

	describe('get form()', () => {
		it('Returns null if no parent fieldset or form element exists.', () => {
			expect(element.form).toBe(null);

			document.body.innerHTML = `<form><legend></legend></form>`;

			expect(document.querySelector('legend')?.form).toBe(null);

			document.body.innerHTML = `<fieldset><legend></legend></fieldset>`;

			expect(document.querySelector('legend')?.form).toBe(null);
		});

		it('Returns form of the parent fieldset.', () => {
			document.body.innerHTML = `<form>
                <fieldset>
                    <legend>Choose your favorite monster</legend>

                    <input type="radio" id="kraken" name="monster" value="K" />
                    <label for="kraken">Kraken</label><br />

                    <input type="radio" id="sasquatch" name="monster" value="S" />
                    <label for="sasquatch">Sasquatch</label><br />

                    <input type="radio" id="mothman" name="monster" value="M" />
                    <label for="mothman">Mothman</label>
                </fieldset>
            </form>`;

			const form = document.querySelector('form');
			const legend = document.querySelector('legend');

			expect(legend?.form).toBe(form);
		});
	});
});

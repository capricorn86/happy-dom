import type HTMLButtonElement from '../html-button-element/HTMLButtonElement.js';
import type HTMLFieldSetElement from '../html-field-set-element/HTMLFieldSetElement.js';
import type HTMLInputElement from '../html-input-element/HTMLInputElement.js';
import type HTMLObjectElement from '../html-object-element/HTMLObjectElement.js';
import type HTMLOutputElement from '../html-output-element/HTMLOutputElement.js';
import type HTMLSelectElement from '../html-select-element/HTMLSelectElement.js';
import type HTMLTextAreaElement from '../html-text-area-element/HTMLTextAreaElement.js';

export type THTMLFormControlElement =
	| HTMLInputElement
	| HTMLSelectElement
	| HTMLTextAreaElement
	| HTMLButtonElement
	| HTMLFieldSetElement
	| HTMLObjectElement
	| HTMLOutputElement;

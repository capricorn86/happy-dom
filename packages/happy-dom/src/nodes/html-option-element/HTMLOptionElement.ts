import * as PropertySymbol from '../../PropertySymbol.js';
import Attr from '../attr/Attr.js';
import HTMLElement from '../html-element/HTMLElement.js';
import HTMLFormElement from '../html-form-element/HTMLFormElement.js';
import HTMLSelectElement from '../html-select-element/HTMLSelectElement.js';

/**
 * HTML Option Element.
 *
 * Reference:
 * https://developer.mozilla.org/en-US/docs/Web/API/HTMLOptionElement.
 */
export default class HTMLOptionElement extends HTMLElement {
	public [PropertySymbol.selectedness] = false;
	public [PropertySymbol.dirtyness] = false;
	public [PropertySymbol.selectNode]: HTMLSelectElement | null = null;

	/**
	 * Constructor.
	 */
	constructor() {
		super();
		this[PropertySymbol.attributes][PropertySymbol.addEventListener](
			'set',
			this.#onSetAttribute.bind(this)
		);
		this[PropertySymbol.attributes][PropertySymbol.addEventListener](
			'remove',
			this.#onRemoveAttribute.bind(this)
		);
	}

	/**
	 * Returns inner text, which is the rendered appearance of text.
	 *
	 * @returns Inner text.
	 */
	public get text(): string {
		return this.innerText;
	}

	/**
	 * Sets the inner text, which is the rendered appearance of text.
	 *
	 * @param innerText Inner text.
	 */
	public set text(text: string) {
		this.innerText = text;
	}

	/**
	 * Returns index.
	 *
	 * @returns Index.
	 */
	public get index(): number {
		return this[PropertySymbol.selectNode]
			? (<HTMLSelectElement>this[PropertySymbol.selectNode]).options.indexOf(this)
			: 0;
	}

	/**
	 * Returns the parent form element.
	 *
	 * @returns Form.
	 */
	public get form(): HTMLFormElement {
		return (<HTMLSelectElement>this[PropertySymbol.selectNode])?.form;
	}

	/**
	 * Returns selected.
	 *
	 * @returns Selected.
	 */
	public get selected(): boolean {
		return this[PropertySymbol.selectedness];
	}

	/**
	 * Sets selected.
	 *
	 * @param selected Selected.
	 */
	public set selected(selected: boolean) {
		const selectNode = <HTMLSelectElement>this[PropertySymbol.selectNode];

		this[PropertySymbol.dirtyness] = true;
		this[PropertySymbol.selectedness] = Boolean(selected);

		if (selectNode) {
			selectNode[PropertySymbol.updateSelectedness](
				this[PropertySymbol.selectedness] ? this : null
			);
		}
	}

	/**
	 * Returns disabled.
	 *
	 * @returns Disabled.
	 */
	public get disabled(): boolean {
		return this.getAttribute('disabled') !== null;
	}

	/**
	 * Sets disabled.
	 *
	 * @param disabled Disabled.
	 */
	public set disabled(disabled: boolean) {
		if (!disabled) {
			this.removeAttribute('disabled');
		} else {
			this.setAttribute('disabled', '');
		}
	}

	/**
	 * Returns value.
	 *
	 * @returns Value.
	 */
	public get value(): string {
		return this.getAttribute('value') ?? this.textContent;
	}

	/**
	 * Sets value.
	 *
	 * @param value Value.
	 */
	public set value(value: string) {
		this.setAttribute('value', value);
	}

	/**
	 * Triggered when an attribute is set.
	 *
	 * @param attribute Attribute.
	 * @param replacedAttribute Replaced attribute.
	 */
	#onSetAttribute(attribute: Attr, replacedAttribute: Attr | null): void {
		if (
			!this[PropertySymbol.dirtyness] &&
			attribute[PropertySymbol.name] === 'selected' &&
			replacedAttribute?.[PropertySymbol.value] !== attribute[PropertySymbol.value]
		) {
			const selectNode = <HTMLSelectElement>this[PropertySymbol.selectNode];

			this[PropertySymbol.selectedness] = true;

			if (selectNode) {
				selectNode[PropertySymbol.updateSelectedness](this);
			}
		}
	}

	/**
	 * Triggered when an attribute is removed.
	 *
	 * @param removedAttribute Removed attribute.
	 */
	#onRemoveAttribute(removedAttribute: Attr): void {
		if (
			removedAttribute &&
			!this[PropertySymbol.dirtyness] &&
			removedAttribute[PropertySymbol.name] === 'selected'
		) {
			const selectNode = <HTMLSelectElement>this[PropertySymbol.selectNode];

			this[PropertySymbol.selectedness] = false;

			if (selectNode) {
				selectNode[PropertySymbol.updateSelectedness]();
			}
		}
	}
}

import INamedNodeMap from '../../named-node-map/INamedNodeMap.js';
import * as PropertySymbol from '../../PropertySymbol.js';
import HTMLElement from '../html-element/HTMLElement.js';
import IHTMLFormElement from '../html-form-element/IHTMLFormElement.js';
import HTMLSelectElement from '../html-select-element/HTMLSelectElement.js';
import IHTMLSelectElement from '../html-select-element/IHTMLSelectElement.js';
import INode from '../node/INode.js';
import HTMLOptionElementNamedNodeMap from './HTMLOptionElementNamedNodeMap.js';
import IHTMLOptionElement from './IHTMLOptionElement.js';

/**
 * HTML Option Element.
 *
 * Reference:
 * https://developer.mozilla.org/en-US/docs/Web/API/HTMLOptionElement.
 */
export default class HTMLOptionElement extends HTMLElement implements IHTMLOptionElement {
	public override [PropertySymbol.attributes]: INamedNodeMap = new HTMLOptionElementNamedNodeMap(
		this
	);
	public [PropertySymbol.selectedness] = false;
	public [PropertySymbol.dirtyness] = false;

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
			? (<IHTMLSelectElement>this[PropertySymbol.selectNode]).options.indexOf(this)
			: 0;
	}

	/**
	 * Returns the parent form element.
	 *
	 * @returns Form.
	 */
	public get form(): IHTMLFormElement {
		return <IHTMLFormElement>this[PropertySymbol.formNode];
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
			selectNode[PropertySymbol.updateOptionItems](this[PropertySymbol.selectedness] ? this : null);
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
		return this.getAttribute('value') || this.textContent;
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
	 * @override
	 */
	public override [PropertySymbol.connectToNode](parentNode: INode = null): void {
		const oldSelectNode = <HTMLSelectElement>this[PropertySymbol.selectNode];

		super[PropertySymbol.connectToNode](parentNode);

		if (oldSelectNode !== this[PropertySymbol.selectNode]) {
			if (oldSelectNode) {
				oldSelectNode[PropertySymbol.updateOptionItems]();
			}
			if (this[PropertySymbol.selectNode]) {
				(<HTMLSelectElement>this[PropertySymbol.selectNode])[PropertySymbol.updateOptionItems]();
			}
		}
	}
}

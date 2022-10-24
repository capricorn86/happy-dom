import HTMLElement from '../html-element/HTMLElement';
import IHTMLElement from '../html-element/IHTMLElement';
import IHTMLFormElement from '../html-form-element/IHTMLFormElement';
import IHTMLSelectElement from '../html-select-element/IHTMLSelectElement';
import IHTMLOptionElement from './IHTMLOptionElement';

/**
 * HTML Option Element.
 *
 * Reference:
 * https://developer.mozilla.org/en-US/docs/Web/API/HTMLOptionElement.
 */
export default class HTMLOptionElement extends HTMLElement implements IHTMLOptionElement {
	public _index: number;

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
		return this._index;
	}

	/**
	 * Returns the parent form element.
	 *
	 * @returns Form.
	 */
	public get form(): IHTMLFormElement {
		let parent = <IHTMLElement>this.parentNode;
		while (parent && parent.tagName !== 'FORM') {
			parent = <IHTMLElement>parent.parentNode;
		}
		return <IHTMLFormElement>parent;
	}

	/**
	 * Returns selected.
	 *
	 * @returns Selected.
	 */
	public get selected(): boolean {
		const parentNode = <IHTMLSelectElement>this.parentNode;

		if (parentNode?.tagName === 'SELECT') {
			let index = -1;
			for (let i = 0; i < parentNode.options.length; i++) {
				if (parentNode.options[i] === this) {
					index = i;
					break;
				}
			}
			return index !== -1 && parentNode.options.selectedIndex === index;
		}

		return false;
	}

	/**
	 * Sets selected.
	 *
	 * @param selected Selected.
	 */
	public set selected(selected: boolean) {
		const parentNode = <IHTMLSelectElement>this.parentNode;
		if (parentNode?.tagName === 'SELECT') {
			if (selected) {
				let index = -1;

				for (let i = 0; i < parentNode.options.length; i++) {
					if (parentNode.options[i] === this) {
						index = i;
						break;
					}
				}

				if (index !== -1) {
					parentNode.options.selectedIndex = index;
				}
			} else if (parentNode.options.length) {
				parentNode.options.selectedIndex = 0;
			} else {
				parentNode.options.selectedIndex = -1;
			}
		}
	}

	/**
	 * Returns disabled.
	 *
	 * @returns Disabled.
	 */
	public get disabled(): boolean {
		return this.getAttributeNS(null, 'disabled') !== null;
	}

	/**
	 * Sets disabled.
	 *
	 * @param disabled Disabled.
	 */
	public set disabled(disabled: boolean) {
		if (!disabled) {
			this.removeAttributeNS(null, 'disabled');
		} else {
			this.setAttributeNS(null, 'disabled', '');
		}
	}

	/**
	 * Returns value.
	 *
	 * @returns Value.
	 */
	public get value(): string {
		return this.getAttributeNS(null, 'value') || '';
	}

	/**
	 * Sets value.
	 *
	 * @param value Value.
	 */
	public set value(value: string) {
		this.setAttributeNS(null, 'value', value);
	}
}

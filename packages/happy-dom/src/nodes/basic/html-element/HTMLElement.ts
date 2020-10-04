import Element from '../element/Element';
import Event from '../../../event/Event';

/**
 * HTMLElement.
 */
export default class HTMLElement extends Element {
	public style: { [k: string]: string } = {};
	public tabIndex = -1;
	public offsetHeight = 0;
	public offsetWidth = 0;
	public offsetLeft = 0;
	public offsetTop = 0;
	public clientHeight = 0;
	public clientWidth = 0;

	/**
	 * Returns inner text.
	 *
	 * @return Text.
	 */
	public get innerText(): string {
		return this.textContent;
	}

	/**
	 * Sets inner text.
	 *
	 * @param text Text.
	 */
	public set innerText(text: string) {
		this.textContent = text;
	}

	/**
	 * Triggers a click event.
	 */
	public click(): void {
		const event = new Event('click', {
			bubbles: true,
			composed: true
		});
		event.target = this;
		event.currentTarget = this;
		this.dispatchEvent(event);
	}

	/**
	 * Triggers a blur event.
	 */
	public blur(): void {
		const event = new Event('blur', {
			bubbles: true,
			composed: true
		});
		event.target = this;
		event.currentTarget = this;
		this.dispatchEvent(event);
	}

	/**
	 * Triggers a focus event.
	 */
	public focus(): void {
		const event = new Event('focus', {
			bubbles: true,
			composed: true
		});
		event.target = this;
		event.currentTarget = this;
		this.dispatchEvent(event);
	}
}

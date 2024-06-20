import HTMLElement from '../html-element/HTMLElement.js';
import * as PropertySymbol from '../../PropertySymbol.js';
import Event from '../../event/Event.js';
import SubmitEvent from '../../event/events/SubmitEvent.js';
import HTMLFormControlsCollection from './HTMLFormControlsCollection.js';
import Node from '../node/Node.js';
import HTMLInputElement from '../html-input-element/HTMLInputElement.js';
import HTMLSelectElement from '../html-select-element/HTMLSelectElement.js';
import HTMLButtonElement from '../html-button-element/HTMLButtonElement.js';
import IBrowserFrame from '../../browser/types/IBrowserFrame.js';
import BrowserFrameNavigator from '../../browser/utilities/BrowserFrameNavigator.js';
import FormData from '../../form-data/FormData.js';
import BrowserWindow from '../../window/BrowserWindow.js';
import Attr from '../attr/Attr.js';
import THTMLFormControlElement from './THTMLFormControlElement.js';
import IHTMLFormControlsCollection from './IHTMLFormControlsCollection.js';
import IMutationListener from '../../mutation-observer/IMutationListener.js';
import MutationRecord from '../../mutation-observer/MutationRecord.js';
import MutationTypeEnum from '../../mutation-observer/MutationTypeEnum.js';
import NodeTypeEnum from '../node/NodeTypeEnum.js';

/**
 * HTML Form Element.
 *
 * Reference:
 * https://developer.mozilla.org/en-US/docs/Web/API/HTMLFormElement.
 */
export default class HTMLFormElement extends HTMLElement {
	// Public properties
	public declare cloneNode: (deep?: boolean) => HTMLFormElement;

	// Internal properties.
	public [PropertySymbol.elements]: HTMLFormControlsCollection = new HTMLFormControlsCollection(
		this
	);
	public [PropertySymbol.formNode]: Node = this;

	// Events
	public onformdata: (event: Event) => void | null = null;
	public onreset: (event: Event) => void | null = null;
	public onsubmit: (event: Event) => void | null = null;

	// Private properties
	#browserFrame: IBrowserFrame;
	#documentMutationListener: IMutationListener | null = null;

	/**
	 * Constructor.
	 *
	 * @param browserFrame Browser frame.
	 */
	constructor(browserFrame: IBrowserFrame) {
		super();
		this.#browserFrame = browserFrame;
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
	 * Returns elements.
	 *
	 * @returns Elements.
	 */
	public get elements(): IHTMLFormControlsCollection {
		return this[PropertySymbol.elements];
	}

	/**
	 * Returns length.
	 *
	 * @returns Length.
	 */
	public get length(): number {
		return this[PropertySymbol.elements].length;
	}

	/**
	 * Returns name.
	 *
	 * @returns Name.
	 */
	public get name(): string {
		return this.getAttribute('name') || '';
	}

	/**
	 * Sets name.
	 *
	 * @param name Name.
	 */
	public set name(name: string) {
		this.setAttribute('name', name);
	}

	/**
	 * Returns method.
	 *
	 * @returns Method.
	 */
	public get method(): string {
		return this.getAttribute('method') || 'get';
	}

	/**
	 * Sets method.
	 *
	 * @param method Method.
	 */
	public set method(method: string) {
		this.setAttribute('method', method);
	}

	/**
	 * Returns target.
	 *
	 * @returns Target.
	 */
	public get target(): string {
		return this.getAttribute('target') || '';
	}

	/**
	 * Sets target.
	 *
	 * @param target Target.
	 */
	public set target(target: string) {
		this.setAttribute('target', target);
	}

	/**
	 * Returns action.
	 *
	 * @returns Action.
	 */
	public get action(): string {
		if (!this.hasAttribute('action')) {
			return this[PropertySymbol.ownerDocument].location.href;
		}

		try {
			return new URL(this.getAttribute('action'), this[PropertySymbol.ownerDocument].location.href)
				.href;
		} catch (e) {
			return '';
		}
	}

	/**
	 * Sets action.
	 *
	 * @param action Action.
	 */
	public set action(action: string) {
		this.setAttribute('action', action);
	}

	/**
	 * Returns encoding.
	 *
	 * @returns Encoding.
	 */
	public get encoding(): string {
		return this.getAttribute('encoding') || '';
	}

	/**
	 * Sets encoding.
	 *
	 * @param encoding Encoding.
	 */
	public set encoding(encoding: string) {
		this.setAttribute('encoding', encoding);
	}

	/**
	 * Returns enctype.
	 *
	 * @returns Enctype.
	 */
	public get enctype(): string {
		return this.getAttribute('enctype') || '';
	}

	/**
	 * Sets enctype.
	 *
	 * @param enctype Enctype.
	 */
	public set enctype(enctype: string) {
		this.setAttribute('enctype', enctype);
	}

	/**
	 * Returns autocomplete.
	 *
	 * @returns Autocomplete.
	 */
	public get autocomplete(): string {
		return this.getAttribute('autocomplete') || '';
	}

	/**
	 * Sets autocomplete.
	 *
	 * @param autocomplete Autocomplete.
	 */
	public set autocomplete(autocomplete: string) {
		this.setAttribute('autocomplete', autocomplete);
	}

	/**
	 * Returns accept charset.
	 *
	 * @returns Accept charset.
	 */
	public get acceptCharset(): string {
		return this.getAttribute('acceptcharset') || '';
	}

	/**
	 * Sets accept charset.
	 *
	 * @param acceptCharset Accept charset.
	 */
	public set acceptCharset(acceptCharset: string) {
		this.setAttribute('acceptcharset', acceptCharset);
	}

	/**
	 * Returns no validate.
	 *
	 * @returns No validate.
	 */
	public get noValidate(): boolean {
		return this.getAttribute('novalidate') !== null;
	}

	/**
	 * Sets no validate.
	 *
	 * @param noValidate No validate.
	 */
	public set noValidate(noValidate: boolean) {
		if (!noValidate) {
			this.removeAttribute('novalidate');
		} else {
			this.setAttribute('novalidate', '');
		}
	}

	/**
	 * Submits form. No submit event is raised. In particular, the form's "submit" event handler is not run.
	 */
	public submit(): void {
		this.#submit();
	}

	/**
	 * Submits form, reports validity and raises submit event.
	 *
	 * @param [submitter] Submitter.
	 */
	public requestSubmit(submitter?: HTMLInputElement | HTMLButtonElement): void {
		const noValidate = submitter?.formNoValidate || this.noValidate;
		if (noValidate || this.checkValidity()) {
			this.dispatchEvent(
				new SubmitEvent('submit', { bubbles: true, cancelable: true, submitter: submitter || this })
			);
			this.#submit(submitter);
		}
	}

	/**
	 * Resets form.
	 */
	public reset(): void {
		for (const element of this[PropertySymbol.elements]) {
			if (
				element[PropertySymbol.tagName] === 'INPUT' ||
				element[PropertySymbol.tagName] === 'TEXTAREA'
			) {
				element[PropertySymbol.value] = null;
				element[PropertySymbol.checked] = null;
			} else if (element[PropertySymbol.tagName] === 'TEXTAREA') {
				element[PropertySymbol.value] = null;
			} else if (element[PropertySymbol.tagName] === 'SELECT') {
				let hasSelectedAttribute = false;
				for (const option of (<HTMLSelectElement>element).options) {
					if (option.hasAttribute('selected')) {
						hasSelectedAttribute = true;
						option.selected = true;
						break;
					}
				}
				if (!hasSelectedAttribute && (<HTMLSelectElement>element).options.length > 0) {
					(<HTMLSelectElement>element).options[0].selected = true;
				}
			}
		}

		this.dispatchEvent(new Event('reset', { bubbles: true, cancelable: true }));
	}

	/**
	 * Checks validity.
	 *
	 * @returns "true" if validation does'nt fail.
	 */
	public checkValidity(): boolean {
		const radioValidationState: { [k: string]: boolean } = {};
		let isFormValid = true;

		for (const element of this[PropertySymbol.elements]) {
			if (element[PropertySymbol.tagName] === 'INPUT' && element.type === 'radio' && element.name) {
				if (!radioValidationState[element.name]) {
					radioValidationState[element.name] = true;
					if (!element.checkValidity()) {
						isFormValid = false;
					}
				}
			} else if (!element.checkValidity()) {
				isFormValid = false;
			}
		}

		return isFormValid;
	}

	/**
	 * Reports validity.
	 *
	 * @returns "true" if validation does'nt fail.
	 */
	public reportValidity(): boolean {
		return this.checkValidity();
	}

	/**
	 * @override
	 */
	public override [PropertySymbol.cloneNode](deep = false): HTMLFormElement {
		return <HTMLFormElement>super[PropertySymbol.cloneNode](deep);
	}

	/**
	 * @override
	 */
	public override [PropertySymbol.connectedToDocument](): void {
		super[PropertySymbol.connectedToDocument]();

		/**
		 * It is possible to associate a form control element by setting the "form" attribute to the form's id.
		 *
		 * We need to listen for changes to all elements in the document to detect when a form control element is added or removed.
		 */
		this.#documentMutationListener = {
			options: {
				childList: true,
				subtree: true,
				attributes: true
			},
			callback: new WeakRef((record: MutationRecord) => {
				const id = this[PropertySymbol.attributes]?.['id']?.value;
				if (!id) {
					return;
				}

				switch (record.type) {
					case MutationTypeEnum.childList:
						if (record.addedNodes.length) {
							const addedNode = record.addedNodes[0];

							if (
								addedNode[PropertySymbol.nodeType] === NodeTypeEnum.elementNode &&
								addedNode[PropertySymbol.attributes]?.['form']?.value === id &&
								!addedNode[PropertySymbol.isInsideObservedFormNode] &&
								this.#isFormControlElement(<THTMLFormControlElement>addedNode)
							) {
								addedNode[PropertySymbol.formNode] = this;
								this[PropertySymbol.elements][PropertySymbol.addItem](
									<THTMLFormControlElement>addedNode
								);
							} else if (addedNode[PropertySymbol.nodeType] === NodeTypeEnum.elementNode) {
								const items = this.querySelectorAll(
									`INPUT['form="${id}"], SELECT['form="${id}"], TEXTAREA['form="${id}"], BUTTON['form="${id}"], FIELDSET['form="${id}"]`
								);
								for (const item of items) {
									if (!item[PropertySymbol.isInsideObservedFormNode]) {
										this[PropertySymbol.elements][PropertySymbol.addItem](
											<THTMLFormControlElement>item
										);
									}
								}
							}
						} else {
							const removedNode = record.removedNodes[0];

							if (
								removedNode[PropertySymbol.nodeType] === NodeTypeEnum.elementNode &&
								removedNode[PropertySymbol.attributes]?.['form']?.value === id &&
								!removedNode[PropertySymbol.isInsideObservedFormNode] &&
								this.#isFormControlElement(<THTMLFormControlElement>removedNode)
							) {
								this[PropertySymbol.elements][PropertySymbol.removeItem](
									<THTMLFormControlElement>removedNode
								);
							} else if (removedNode[PropertySymbol.nodeType] === NodeTypeEnum.elementNode) {
								const items = this.querySelectorAll(
									`INPUT['form="${id}"], SELECT['form="${id}"], TEXTAREA['form="${id}"], BUTTON['form="${id}"], FIELDSET['form="${id}"]`
								);
								for (const item of items) {
									if (!item[PropertySymbol.isInsideObservedFormNode]) {
										this[PropertySymbol.elements][PropertySymbol.removeItem](
											<THTMLFormControlElement>item
										);
									}
								}
							}
						}
						break;
					case MutationTypeEnum.attributes:
						if (
							record.attributeName === 'form' &&
							this.#isFormControlElement(<THTMLFormControlElement>record.target)
						) {
							if (
								record.target[PropertySymbol.attributes]?.['form']?.[PropertySymbol.value] ===
									this[PropertySymbol.attributes]?.['id']?.[PropertySymbol.value] &&
								!record.target[PropertySymbol.isInsideObservedFormNode]
							) {
								this[PropertySymbol.elements][PropertySymbol.addItem](
									<THTMLFormControlElement>record.target
								);
							} else if (!record.target[PropertySymbol.isInsideObservedFormNode]) {
								this[PropertySymbol.elements][PropertySymbol.removeItem](
									<THTMLFormControlElement>record.target
								);
							}
						}
						break;
				}
			})
		};

		this[PropertySymbol.ownerDocument][PropertySymbol.observeMutations](
			this.#documentMutationListener
		);

		const id = this[PropertySymbol.attributes]?.['id']?.value;

		if (!id) {
			return;
		}

		for (const element of this[PropertySymbol.ownerDocument].querySelectorAll(
			`INPUT[form="${id}"], SELECT[form="${id}"], TEXTAREA[form="${id}"], BUTTON[form="${id}"], FIELDSET[form="${id}"]`
		)) {
			if (!element[PropertySymbol.isInsideObservedFormNode]) {
				this[PropertySymbol.elements][PropertySymbol.addItem](<THTMLFormControlElement>element);
			}
		}
	}

	/**
	 * @override
	 */
	public override [PropertySymbol.disconnectedFromDocument](): void {
		super[PropertySymbol.disconnectedFromDocument]();

		this[PropertySymbol.ownerDocument][PropertySymbol.unobserveMutations](
			this.#documentMutationListener
		);

		this.#documentMutationListener = null;

		const id = this.id;

		if (!id) {
			return;
		}

		for (const element of this[PropertySymbol.elements]) {
			if (element[PropertySymbol.attributes]?.['form']?.value === id && !this.contains(element)) {
				this[PropertySymbol.elements][PropertySymbol.removeItem](<THTMLFormControlElement>element);
			}
		}
	}

	/**
	 * Submits form.
	 *
	 * @param [submitter] Submitter.
	 */
	#submit(submitter?: HTMLInputElement | HTMLButtonElement): void {
		const action = submitter?.hasAttribute('formaction')
			? submitter?.formAction || this.action
			: this.action;

		if (!action) {
			// The URL is invalid when the action is empty.
			// This is what Chrome does when the URL is invalid.
			this[PropertySymbol.ownerDocument].location.hash = '#blocked';
			return;
		}

		const method = submitter?.formMethod || this.method;
		const formData = new FormData(this);
		let targetFrame: IBrowserFrame;

		switch (submitter?.formTarget || this.target) {
			default:
			case '_self':
				targetFrame = this.#browserFrame;
				break;
			case '_top':
				targetFrame = this.#browserFrame.page.mainFrame;
				break;
			case '_parent':
				targetFrame = this.#browserFrame.parentFrame ?? this.#browserFrame;
				break;
			case '_blank':
				const newPage = this.#browserFrame.page.context.newPage();
				targetFrame = newPage.mainFrame;
				targetFrame[PropertySymbol.openerFrame] = this.#browserFrame;
				break;
		}

		if (method === 'get') {
			const url = new URL(action);

			for (const [key, value] of formData) {
				if (typeof value === 'string') {
					url.searchParams.append(key, value);
				}
			}

			BrowserFrameNavigator.navigate({
				windowClass: <typeof BrowserWindow>(
					this[PropertySymbol.ownerDocument][PropertySymbol.defaultView].constructor
				),
				frame: targetFrame,
				url: url.href,
				goToOptions: {
					referrer: this.#browserFrame.page.mainFrame.window.location.origin
				}
			});

			return;
		}

		BrowserFrameNavigator.navigate({
			windowClass: <typeof BrowserWindow>(
				this[PropertySymbol.ownerDocument][PropertySymbol.defaultView].constructor
			),
			frame: targetFrame,
			method: method,
			url: action,
			formData,
			goToOptions: {
				referrer: this.#browserFrame.page.mainFrame.window.location.origin
			}
		});
	}

	/**
	 * Checks if an element is a form control element.
	 *
	 * @param item Item.
	 * @returns True if the item is a form control element.
	 */
	#isFormControlElement(item: THTMLFormControlElement): boolean {
		return (
			item[PropertySymbol.tagName] === 'INPUT' ||
			item[PropertySymbol.tagName] === 'SELECT' ||
			item[PropertySymbol.tagName] === 'TEXTAREA' ||
			item[PropertySymbol.tagName] === 'BUTTON' ||
			item[PropertySymbol.tagName] === 'FIELDSET'
		);
	}

	/**
	 * Triggered when an attribute is set.
	 *
	 * @param attribute Attribute.
	 * @param replacedAttribute Replaced attribute.
	 */
	#onSetAttribute(attribute: Attr, replacedAttribute: Attr | null): void {
		if (attribute.name !== 'id' || !this[PropertySymbol.isConnected]) {
			return;
		}

		if (replacedAttribute[PropertySymbol.value]) {
			const id = replacedAttribute[PropertySymbol.value];
			for (const element of this[PropertySymbol.elements]) {
				if (element[PropertySymbol.attributes]?.['form']?.value === id && !this.contains(element)) {
					this[PropertySymbol.elements][PropertySymbol.removeItem](
						<THTMLFormControlElement>element
					);
				}
			}
		}

		if (attribute[PropertySymbol.value]) {
			const id = attribute[PropertySymbol.value];
			for (const element of this[PropertySymbol.elements]) {
				if (
					element[PropertySymbol.attributes]?.['form']?.value === id &&
					element[PropertySymbol.formNode] !== this
				) {
					this[PropertySymbol.elements][PropertySymbol.addItem](<THTMLFormControlElement>element);
				}
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
			removedAttribute.name !== 'id' ||
			!removedAttribute[PropertySymbol.value] ||
			!this[PropertySymbol.isConnected]
		) {
			return;
		}

		const id = removedAttribute[PropertySymbol.value];
		for (const element of this[PropertySymbol.elements]) {
			if (element[PropertySymbol.attributes]?.['form']?.value === id && !this.contains(element)) {
				this[PropertySymbol.elements][PropertySymbol.removeItem](<THTMLFormControlElement>element);
			}
		}
	}
}

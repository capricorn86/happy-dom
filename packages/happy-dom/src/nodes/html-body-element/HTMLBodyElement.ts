import Event from '../../event/Event.js';
import ElementEventAttributeUtility from '../element/ElementEventAttributeUtility.js';
import HTMLElement from '../html-element/HTMLElement.js';
import * as PropertySymbol from '../../PropertySymbol.js';

/**
 * HTMLBodyElement
 *
 * @see https://developer.mozilla.org/en-US/docs/Web/API/HTMLBodyElement
 */
export default class HTMLBodyElement extends HTMLElement {
	// Events

	/* eslint-disable jsdoc/require-jsdoc */

	public get onafterprint(): ((event: Event) => void) | null {
		return ElementEventAttributeUtility.getEventListener(this, 'onafterprint');
	}

	public set onafterprint(value: ((event: Event) => void) | null) {
		this[PropertySymbol.propertyEventListeners].set('onafterprint', value);
	}

	public get onbeforeprint(): ((event: Event) => void) | null {
		return ElementEventAttributeUtility.getEventListener(this, 'onbeforeprint');
	}

	public set onbeforeprint(value: ((event: Event) => void) | null) {
		this[PropertySymbol.propertyEventListeners].set('onbeforeprint', value);
	}

	public get onbeforeunload(): ((event: Event) => void) | null {
		return ElementEventAttributeUtility.getEventListener(this, 'onbeforeunload');
	}

	public set onbeforeunload(value: ((event: Event) => void) | null) {
		this[PropertySymbol.propertyEventListeners].set('onbeforeunload', value);
	}

	public get ongamepadconnected(): ((event: Event) => void) | null {
		return ElementEventAttributeUtility.getEventListener(this, 'ongamepadconnected');
	}

	public set ongamepadconnected(value: ((event: Event) => void) | null) {
		this[PropertySymbol.propertyEventListeners].set('ongamepadconnected', value);
	}

	public get ongamepaddisconnected(): ((event: Event) => void) | null {
		return ElementEventAttributeUtility.getEventListener(this, 'ongamepaddisconnected');
	}

	public set ongamepaddisconnected(value: ((event: Event) => void) | null) {
		this[PropertySymbol.propertyEventListeners].set('ongamepaddisconnected', value);
	}

	public get onhashchange(): ((event: Event) => void) | null {
		return ElementEventAttributeUtility.getEventListener(this, 'onhashchange');
	}

	public set onhashchange(value: ((event: Event) => void) | null) {
		this[PropertySymbol.propertyEventListeners].set('onhashchange', value);
	}

	public get onlanguagechange(): ((event: Event) => void) | null {
		return ElementEventAttributeUtility.getEventListener(this, 'onlanguagechange');
	}

	public set onlanguagechange(value: ((event: Event) => void) | null) {
		this[PropertySymbol.propertyEventListeners].set('onlanguagechange', value);
	}

	public get onmessage(): ((event: Event) => void) | null {
		return ElementEventAttributeUtility.getEventListener(this, 'onmessage');
	}

	public set onmessage(value: ((event: Event) => void) | null) {
		this[PropertySymbol.propertyEventListeners].set('onmessage', value);
	}

	public get onmessageerror(): ((event: Event) => void) | null {
		return ElementEventAttributeUtility.getEventListener(this, 'onmessageerror');
	}

	public set onmessageerror(value: ((event: Event) => void) | null) {
		this[PropertySymbol.propertyEventListeners].set('onmessageerror', value);
	}

	public get onoffline(): ((event: Event) => void) | null {
		return ElementEventAttributeUtility.getEventListener(this, 'onoffline');
	}

	public set onoffline(value: ((event: Event) => void) | null) {
		this[PropertySymbol.propertyEventListeners].set('onoffline', value);
	}

	public get ononline(): ((event: Event) => void) | null {
		return ElementEventAttributeUtility.getEventListener(this, 'ononline');
	}

	public set ononline(value: ((event: Event) => void) | null) {
		this[PropertySymbol.propertyEventListeners].set('ononline', value);
	}

	public get onpagehide(): ((event: Event) => void) | null {
		return ElementEventAttributeUtility.getEventListener(this, 'onpagehide');
	}

	public set onpagehide(value: ((event: Event) => void) | null) {
		this[PropertySymbol.propertyEventListeners].set('onpagehide', value);
	}

	public get onpageshow(): ((event: Event) => void) | null {
		return ElementEventAttributeUtility.getEventListener(this, 'onpageshow');
	}

	public set onpageshow(value: ((event: Event) => void) | null) {
		this[PropertySymbol.propertyEventListeners].set('onpageshow', value);
	}

	public get onpopstate(): ((event: Event) => void) | null {
		return ElementEventAttributeUtility.getEventListener(this, 'onpopstate');
	}

	public set onpopstate(value: ((event: Event) => void) | null) {
		this[PropertySymbol.propertyEventListeners].set('onpopstate', value);
	}

	public get onrejectionhandled(): ((event: Event) => void) | null {
		return ElementEventAttributeUtility.getEventListener(this, 'onrejectionhandled');
	}

	public set onrejectionhandled(value: ((event: Event) => void) | null) {
		this[PropertySymbol.propertyEventListeners].set('onrejectionhandled', value);
	}

	public get onstorage(): ((event: Event) => void) | null {
		return ElementEventAttributeUtility.getEventListener(this, 'onstorage');
	}

	public set onstorage(value: ((event: Event) => void) | null) {
		this[PropertySymbol.propertyEventListeners].set('onstorage', value);
	}

	public get onunhandledrejection(): ((event: Event) => void) | null {
		return ElementEventAttributeUtility.getEventListener(this, 'onunhandledrejection');
	}

	public set onunhandledrejection(value: ((event: Event) => void) | null) {
		this[PropertySymbol.propertyEventListeners].set('onunhandledrejection', value);
	}

	public get onunload(): ((event: Event) => void) | null {
		return ElementEventAttributeUtility.getEventListener(this, 'onunload');
	}

	public set onunload(value: ((event: Event) => void) | null) {
		this[PropertySymbol.propertyEventListeners].set('onunload', value);
	}

	/* eslint-enable jsdoc/require-jsdoc */
}

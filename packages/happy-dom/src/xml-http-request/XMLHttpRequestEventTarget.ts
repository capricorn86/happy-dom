import type ProgressEvent from '../event/events/ProgressEvent.js';
import EventTarget from '../event/EventTarget.js';
import * as PropertySymbol from '../PropertySymbol.js';

export type ProgressEventListener = (event: ProgressEvent) => void;

/**
 * References: https://xhr.spec.whatwg.org/#xmlhttprequesteventtarget.
 */
export default class XMLHttpRequestEventTarget extends EventTarget {
	// Internal properties
	public [PropertySymbol.propertyEventListeners]: Map<string, ProgressEventListener | null> =
		new Map();

	/* eslint-disable jsdoc/require-jsdoc */

	public get onloadstart(): ProgressEventListener | null {
		return <ProgressEventListener | null>(
			(this[PropertySymbol.propertyEventListeners].get('onloadstart') ?? null)
		);
	}

	public set onloadstart(value: ProgressEventListener | null) {
		this[PropertySymbol.propertyEventListeners].set('onloadstart', value);
	}

	public get onprogress(): ProgressEventListener | null {
		return <ProgressEventListener | null>(
			(this[PropertySymbol.propertyEventListeners].get('onprogress') ?? null)
		);
	}

	public set onprogress(value: ProgressEventListener | null) {
		this[PropertySymbol.propertyEventListeners].set('onprogress', value);
	}

	public get onabort(): ((event: ProgressEvent) => void) | null {
		return <((event: ProgressEvent) => void) | null>(
			(this[PropertySymbol.propertyEventListeners].get('onabort') ?? null)
		);
	}

	public set onabort(value: ((event: ProgressEvent) => void) | null) {
		this[PropertySymbol.propertyEventListeners].set('onabort', value);
	}

	public get onerror(): ProgressEventListener | null {
		return <ProgressEventListener | null>(
			(this[PropertySymbol.propertyEventListeners].get('onerror') ?? null)
		);
	}

	public set onerror(value: ProgressEventListener | null) {
		this[PropertySymbol.propertyEventListeners].set('onerror', value);
	}

	public get onload(): ProgressEventListener | null {
		return <ProgressEventListener | null>(
			(this[PropertySymbol.propertyEventListeners].get('onload') ?? null)
		);
	}

	public set onload(value: ProgressEventListener | null) {
		this[PropertySymbol.propertyEventListeners].set('onload', value);
	}

	public get ontimeout(): ProgressEventListener | null {
		return <ProgressEventListener | null>(
			(this[PropertySymbol.propertyEventListeners].get('ontimeout') ?? null)
		);
	}

	public set ontimeout(value: ProgressEventListener | null) {
		this[PropertySymbol.propertyEventListeners].set('ontimeout', value);
	}

	public get onloadend(): ProgressEventListener | null {
		return <ProgressEventListener | null>(
			(this[PropertySymbol.propertyEventListeners].get('onloadend') ?? null)
		);
	}

	public set onloadend(value: ProgressEventListener | null) {
		this[PropertySymbol.propertyEventListeners].set('onloadend', value);
	}

	/* eslint-enable jsdoc/require-jsdoc */
}

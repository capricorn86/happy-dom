import Node from '../nodes/basic-types/node/Node';
import IEventInit from './IEventInit';

export default class Event {
	public readonly bubbles: boolean = false;
	public readonly cancelable: boolean = false;
	public readonly composed: boolean = false;
	public readonly currentTarget: Node = null;
	public readonly target: Node = null;
	public defaultPrevented: boolean = false;
	public _immediatePropagationStopped: boolean = false;
	public _propagationStopped: boolean = false;
	public type: string = null;

	/**
	 * Constructor.
	 *
	 * @param {string} type Event type.
	 * @param {IEventInit} eventInit Event init.
	 */
	constructor(type: string, eventInit: IEventInit = null) {
		this.type = type;
		this.bubbles = eventInit && eventInit.bubbles ? true : false;
		this.cancelable = eventInit && eventInit.cancelable ? true : false;
		this.composed = eventInit && eventInit.composed ? true : false;
	}

	/**
	 * Init event.
	 *
	 * @legacy
	 */
	public initEvent(): void {
		this.defaultPrevented = true;
	}

	/**
	 * Prevents default.
	 */
	public preventDefault(): void {
		this.defaultPrevented = true;
	}

	/**
	 * Stops immediate propagation.
	 */
	public stopImmediatePropagation(): void {
		this._immediatePropagationStopped = true;
	}

	/**
	 * Stops propagation.
	 */
	public stopPropagation(): void {
		this._propagationStopped = true;
	}
}

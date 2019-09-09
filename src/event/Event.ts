import Node from '../nodes/Node';

export default class Event {
	public readonly bubbles: boolean = false;
	public readonly cancelable: boolean = false;
	public readonly composed: boolean = false;
	public readonly currentTarget: Node = null;
	public readonly target: Node = null;
	public defaultPrevented: boolean = false;
	public immediatePropagationStopped: boolean = false;
	public type: string = null;

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
		this.immediatePropagationStopped = true;
	}
}

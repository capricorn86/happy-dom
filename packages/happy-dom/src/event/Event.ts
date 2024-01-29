import IEventInit from './IEventInit.js';
import * as PropertySymbol from '../PropertySymbol.js';
import INode from '../nodes/node/INode.js';
import IBrowserWindow from '../window/IBrowserWindow.js';
import IShadowRoot from '../nodes/shadow-root/IShadowRoot.js';
import IEventTarget from './IEventTarget.js';
import NodeTypeEnum from '../nodes/node/NodeTypeEnum.js';
import EventPhaseEnum from './EventPhaseEnum.js';
import IDocument from '../nodes/document/IDocument.js';

/**
 * Event.
 */
export default class Event {
	public composed: boolean;
	public bubbles: boolean;
	public cancelable: boolean;
	public defaultPrevented = false;
	public eventPhase: EventPhaseEnum = EventPhaseEnum.none;
	public timeStamp: number = performance.now();
	public type: string;
	public NONE = EventPhaseEnum.none;
	public CAPTURING_PHASE = EventPhaseEnum.capturing;
	public AT_TARGET = EventPhaseEnum.atTarget;
	public BUBBLING_PHASE = EventPhaseEnum.bubbling;

	public [PropertySymbol.immediatePropagationStopped] = false;
	public [PropertySymbol.propagationStopped] = false;
	public [PropertySymbol.target]: IEventTarget = null;
	public [PropertySymbol.currentTarget]: IEventTarget = null;
	public [PropertySymbol.isInPassiveEventListener] = false;

	/**
	 * Constructor.
	 *
	 * @param type Event type.
	 * @param [eventInit] Event init.
	 */
	constructor(type: string, eventInit: IEventInit | null = null) {
		this.type = type;

		this.bubbles = eventInit?.bubbles ?? false;
		this.cancelable = eventInit?.cancelable ?? false;
		this.composed = eventInit?.composed ?? false;
	}

	/**
	 * Returns target.
	 *
	 * @returns Target.
	 */
	public get target(): IEventTarget {
		return this[PropertySymbol.target];
	}

	/**
	 * Returns target.
	 *
	 * @returns Target.
	 */
	public get currentTarget(): IEventTarget {
		return this[PropertySymbol.currentTarget];
	}

	/**
	 * Returns "true" if propagation has been stopped.
	 *
	 * @returns "true" if propagation has been stopped.
	 */
	public get cancelBubble(): boolean {
		return this[PropertySymbol.propagationStopped];
	}

	/**
	 * Returns composed path.
	 *
	 * @returns Composed path.
	 */
	public composedPath(): IEventTarget[] {
		if (!this[PropertySymbol.target]) {
			return [];
		}

		const composedPath = [];
		let eventTarget: INode | IShadowRoot | IBrowserWindow = <INode | IShadowRoot>(
			(<unknown>this[PropertySymbol.target])
		);

		while (eventTarget) {
			composedPath.push(eventTarget);

			if ((<INode>(<unknown>eventTarget)).parentNode) {
				eventTarget = (<INode>(<unknown>eventTarget)).parentNode;
			} else if (
				this.composed &&
				(<INode>eventTarget)[PropertySymbol.nodeType] === NodeTypeEnum.documentFragmentNode &&
				(<IShadowRoot>eventTarget).host
			) {
				eventTarget = (<IShadowRoot>eventTarget).host;
			} else if ((<INode>eventTarget)[PropertySymbol.nodeType] === NodeTypeEnum.documentNode) {
				eventTarget = (<IDocument>(<unknown>eventTarget))[PropertySymbol.ownerWindow];
			} else {
				break;
			}
		}

		return composedPath;
	}

	/**
	 * Init event.
	 *
	 * @deprecated
	 * @param type Type.
	 * @param [bubbles=false] "true" if it bubbles.
	 * @param [cancelable=false] "true" if it cancelable.
	 */
	public initEvent(type: string, bubbles = false, cancelable = false): void {
		this.type = type;
		this.bubbles = bubbles;
		this.cancelable = cancelable;
	}

	/**
	 * Prevents default.
	 */
	public preventDefault(): void {
		if (!this[PropertySymbol.isInPassiveEventListener]) {
			this.defaultPrevented = true;
		}
	}

	/**
	 * Stops immediate propagation.
	 */
	public stopImmediatePropagation(): void {
		this[PropertySymbol.immediatePropagationStopped] = true;
	}

	/**
	 * Stops propagation.
	 */
	public stopPropagation(): void {
		this[PropertySymbol.propagationStopped] = true;
	}
}

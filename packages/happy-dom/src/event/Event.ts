import IEventInit from './IEventInit.js';
import INode from '../nodes/node/INode.js';
import IWindow from '../window/IWindow.js';
import IShadowRoot from '../nodes/shadow-root/IShadowRoot.js';
import IEventTarget from './IEventTarget.js';
import NodeTypeEnum from '../nodes/node/NodeTypeEnum.js';
import { performance } from 'perf_hooks';
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
	public _immediatePropagationStopped = false;
	public _propagationStopped = false;
	public _target: IEventTarget = null;
	public _currentTarget: IEventTarget = null;
	public timeStamp: number = performance.now();
	public type: string;
	public _isInPassiveEventListener = false;
	public NONE = EventPhaseEnum.none;
	public CAPTURING_PHASE = EventPhaseEnum.capturing;
	public AT_TARGET = EventPhaseEnum.atTarget;
	public BUBBLING_PHASE = EventPhaseEnum.bubbling;

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
		return this._target;
	}

	/**
	 * Returns target.
	 *
	 * @returns Target.
	 */
	public get currentTarget(): IEventTarget {
		return this._currentTarget;
	}

	/**
	 * Returns "true" if propagation has been stopped.
	 *
	 * @returns "true" if propagation has been stopped.
	 */
	public get cancelBubble(): boolean {
		return this._propagationStopped;
	}

	/**
	 * Returns composed path.
	 *
	 * @returns Composed path.
	 */
	public composedPath(): IEventTarget[] {
		if (!this._target) {
			return [];
		}

		const composedPath = [];
		let eventTarget: INode | IShadowRoot | IWindow = <INode | IShadowRoot>(<unknown>this._target);

		while (eventTarget) {
			composedPath.push(eventTarget);

			if ((<INode>(<unknown>eventTarget)).parentNode) {
				eventTarget = (<INode>(<unknown>eventTarget)).parentNode;
			} else if (
				this.composed &&
				(<INode>eventTarget).nodeType === NodeTypeEnum.documentFragmentNode &&
				(<IShadowRoot>eventTarget).host
			) {
				eventTarget = (<IShadowRoot>eventTarget).host;
			} else if ((<INode>eventTarget).nodeType === NodeTypeEnum.documentNode) {
				eventTarget = (<IDocument>(<unknown>eventTarget)).defaultView;
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
		if (!this._isInPassiveEventListener) {
			this.defaultPrevented = true;
		}
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

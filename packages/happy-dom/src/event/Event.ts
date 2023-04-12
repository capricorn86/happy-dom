import IEventInit from './IEventInit';
import INode from '../nodes/node/INode';
import IWindow from '../window/IWindow';
import IShadowRoot from '../nodes/shadow-root/IShadowRoot';
import IEventTarget from './IEventTarget';
import NodeTypeEnum from '../nodes/node/NodeTypeEnum';
import { performance } from 'perf_hooks';

/**
 * Event.
 */
export default class Event {
	public composed = false;
	public bubbles = false;
	public cancelable = false;
	public defaultPrevented = false;
	public _immediatePropagationStopped = false;
	public _propagationStopped = false;
	public _target: IEventTarget = null;
	public _currentTarget: IEventTarget = null;
	public timeStamp: number = performance.now();
	public type: string = null;

	/**
	 * Constructor.
	 *
	 * @param type Event type.
	 * @param [eventInit] Event init.
	 */
	constructor(type: string, eventInit: IEventInit = null) {
		this.type = type;

		if (eventInit) {
			this.bubbles = eventInit.bubbles || false;
			this.cancelable = eventInit.cancelable || false;
			this.composed = eventInit.composed || false;
		}
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
	 * Returns composed path.
	 *
	 * @returns Composed path.
	 */
	public composedPath(): IEventTarget[] {
		if (!this.target) {
			return [];
		}

		const composedPath = [];
		let eventTarget: INode | IShadowRoot | IWindow = <INode | IShadowRoot>(<unknown>this.target);

		while (eventTarget) {
			composedPath.push(eventTarget);

			if (this.bubbles) {
				if (
					this.composed &&
					(<INode>eventTarget).nodeType === NodeTypeEnum.documentFragmentNode &&
					(<IShadowRoot>eventTarget).host
				) {
					eventTarget = (<IShadowRoot>eventTarget).host;
				} else if ((<INode>(<unknown>this.target)).ownerDocument === eventTarget) {
					eventTarget = (<INode>(<unknown>this.target)).ownerDocument.defaultView;
				} else {
					eventTarget = (<INode>(<unknown>eventTarget)).parentNode || null;
				}
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

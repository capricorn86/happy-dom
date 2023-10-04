import DOMException from '../exception/DOMException.js';
import INode from '../nodes/node/INode.js';
import Node from '../nodes/node/Node.js';
import IMutationObserverInit from './IMutationObserverInit.js';
import MutationObserverListener from './MutationListener.js';
import MutationRecord from './MutationRecord.js';

/**
 * The MutationObserver interface provides the ability to watch for changes being made to the DOM tree.
 *
 * @see https://developer.mozilla.org/en-US/docs/Web/API/MutationObserver
 */
export default class MutationObserver {
	private callback: (records: MutationRecord[], observer: MutationObserver) => void;
	private target: INode = null;
	private listener: MutationObserverListener = null;

	/**
	 * Constructor.
	 *
	 * @param callback Callback.
	 */
	constructor(callback: (records: MutationRecord[], observer: MutationObserver) => void) {
		this.callback = callback;
	}

	/**
	 * Starts observing.
	 *
	 * @param target Target.
	 * @param options Options.
	 */
	public observe(target: INode, options: IMutationObserverInit): void {
		if (!target) {
			throw new DOMException(
				'Failed to observer. The first parameter "target" should be of type "Node".'
			);
		}

		options = Object.assign({}, options, {
			attributeFilter: options.attributeFilter
				? options.attributeFilter.map((name) => name.toLowerCase())
				: null
		});

		this.target = target;
		this.listener = new MutationObserverListener();
		this.listener.options = options;
		this.listener.callback = this.callback.bind(this);
		this.listener.observer = this;

		(<Node>target)._observe(this.listener);
	}

	/**
	 * Disconnects.
	 */
	public disconnect(): void {
		if (this.target) {
			(<Node>this.target)._unobserve(this.listener);
			this.target = null;
		}
	}

	/**
	 * Takes records.
	 */
	public takeRecords(): [] {
		return [];
	}
}

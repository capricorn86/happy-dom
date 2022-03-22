import DOMException from '../exception/DOMException';
import INode from '../nodes/node/INode';
import Node from '../nodes/node/Node';
import IMutationObserverInit from './IMutationObserverInit';
import MutationObserverListener from './MutationListener';
import MutationRecord from './MutationRecord';

/**
 * The MutationObserver interface provides the ability to watch for changes being made to the DOM tree.
 *
 * @see https://developer.mozilla.org/en-US/docs/Web/API/MutationObserver
 */
export default class MutationObserver {
	private callback: (records: MutationRecord[]) => void;
	private target: INode = null;
	private listener: MutationObserverListener = null;

	/**
	 * Constructor.
	 *
	 * @param callback Callback.
	 */
	constructor(callback: (records: MutationRecord[]) => void) {
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

		(<Node>target)._observe(this.listener);
	}

	/**
	 * Disconnects.
	 */
	public disconnect(): void {
		(<Node>this.target)._unobserve(this.listener);
	}

	/**
	 * Takes records.
	 */
	public takeRecords(): [] {
		return [];
	}
}

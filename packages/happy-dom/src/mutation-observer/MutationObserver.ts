import * as PropertySymbol from '../PropertySymbol.js';
import INode from '../nodes/node/INode.js';
import Node from '../nodes/node/Node.js';
import IMutationObserverInit from './IMutationObserverInit.js';
import MutationListener from './MutationListener.js';
import MutationRecord from './MutationRecord.js';
import IBrowserWindow from '../window/IBrowserWindow.js';

/**
 * The MutationObserver interface provides the ability to watch for changes being made to the DOM tree.
 *
 * @see https://developer.mozilla.org/en-US/docs/Web/API/MutationObserver
 */
export default class MutationObserver {
	#callback: (records: MutationRecord[], observer: MutationObserver) => void;
	#listeners: MutationListener[] = [];
	#window: IBrowserWindow | null = null;

	/**
	 * Constructor.
	 *
	 * @param callback Callback.
	 */
	constructor(callback: (records: MutationRecord[], observer: MutationObserver) => void) {
		this.#callback = callback;
	}

	/**
	 * Starts observing.
	 *
	 * @param target Target.
	 * @param options Options.
	 */
	public observe(target: INode, options: IMutationObserverInit): void {
		if (!target) {
			throw new TypeError(
				`Failed to execute 'observe' on 'MutationObserver': The first parameter "target" should be of type "Node".`
			);
		}

		if (options && (options.attributeFilter || options.attributeOldValue)) {
			if (options.attributes === undefined) {
				options = Object.assign({}, options, {
					attributes: true,
					attributeFilter: options.attributeFilter,
					attributeOldValue: options.attributeOldValue
				});
			}

			if (!options.attributes && options.attributeOldValue) {
				throw new TypeError(
					`Failed to execute 'observe' on 'MutationObserver': The options object may only set 'attributeOldValue' to true when 'attributes' is true or not present.`
				);
			}

			if (!options.attributes && options.attributeFilter) {
				throw new TypeError(
					`Failed to execute 'observe' on 'MutationObserver': The options object may only set 'attributeFilter' when 'attributes' is true or not present.`
				);
			}
		}

		if (options && options.characterDataOldValue) {
			if (options.characterData === undefined) {
				options = Object.assign({}, options, {
					characterData: true,
					characterDataOldValue: options.characterDataOldValue
				});
			}

			if (!options.characterData && options.characterDataOldValue) {
				throw new TypeError(
					`Failed to execute 'observe' on 'MutationObserver': The options object may only set 'characterDataOldValue' to true when 'characterData' is true or not present.`
				);
			}
		}

		if (!options || (!options.childList && !options.attributes && !options.characterData)) {
			throw new TypeError(
				`Failed to execute 'observe' on 'MutationObserver': The options object must set at least one of 'attributes', 'characterData', or 'childList' to true.`
			);
		}

		if (!this.#window) {
			this.#window = target[PropertySymbol.ownerDocument]
				? target[PropertySymbol.ownerDocument][PropertySymbol.ownerWindow]
				: target[PropertySymbol.ownerWindow];
		}

		// Makes sure that attribute names are lower case.
		// TODO: Is this correct?
		options = Object.assign({}, options, {
			attributeFilter: options.attributeFilter
				? options.attributeFilter.map((name) => name.toLowerCase())
				: null
		});

		/**
		 * @see https://developer.mozilla.org/en-US/docs/Web/API/MutationObserver/observe#reusing_mutationobservers
		 */
		for (const listener of this.#listeners) {
			if (listener.target === target) {
				listener.options = options;
				return;
			}
		}

		const listener = new MutationListener({
			window: this.#window,
			options,
			callback: this.#callback.bind(this),
			observer: this,
			target
		});

		this.#listeners.push(listener);

		// Stores all observers on the window object, so that they can be disconnected when the window is closed.
		this.#window[PropertySymbol.mutationObservers].push(this);

		// Starts observing target node.
		(<Node>target)[PropertySymbol.observe](listener);
	}

	/**
	 * Disconnects.
	 */
	public disconnect(): void {
		if (this.#listeners.length === 0) {
			return;
		}

		const mutationObservers = this.#window[PropertySymbol.mutationObservers];
		const index = mutationObservers.indexOf(this);

		if (index !== -1) {
			mutationObservers.splice(index, 1);
		}

		for (const listener of this.#listeners) {
			(<Node>listener.target)[PropertySymbol.unobserve](listener);
			listener.destroy();
		}

		this.#listeners = [];
	}

	/**
	 * Returns a list of all matching DOM changes that have been detected but not yet processed by the observer's callback function, leaving the mutation queue empty.
	 *
	 * @returns Records.
	 */
	public takeRecords(): MutationRecord[] {
		let records = [];
		for (const listener of this.#listeners) {
			records = records.concat(listener.takeRecords());
		}
		return records;
	}
}

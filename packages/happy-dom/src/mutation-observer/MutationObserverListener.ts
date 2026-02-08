import type IMutationObserverInit from './IMutationObserverInit.js';
import type MutationObserver from './MutationObserver.js';
import type MutationRecord from './MutationRecord.js';
import type Node from '../nodes/node/Node.js';
import type BrowserWindow from '../window/BrowserWindow.js';
import type IMutationListener from './IMutationListener.js';

/**
 * Mutation Observer Listener.
 */
export default class MutationObserverListener {
	public target: Node;
	public options: IMutationObserverInit;
	public mutationListener: IMutationListener;
	#window: BrowserWindow;
	#observer: MutationObserver;
	#callback: (record: MutationRecord[], observer: MutationObserver) => void;
	#records: MutationRecord[] = [];
	#destroyed = false;
	#microtaskQueued = false;

	/**
	 * Constructor.
	 *
	 * @param init Options.
	 * @param init.window Window.
	 * @param init.options Options.
	 * @param init.target Target.
	 * @param init.observer Observer.
	 * @param init.callback Callback.
	 */
	constructor(init: {
		window: BrowserWindow;
		options: IMutationObserverInit;
		target: Node;
		observer: MutationObserver;
		callback: (record: MutationRecord[], observer: MutationObserver) => void;
	}) {
		this.options = init.options;
		this.target = init.target;
		this.mutationListener = {
			options: init.options,
			callback: new WeakRef((record: MutationRecord) => this.report(record))
		};
		this.#window = init.window;
		this.#observer = init.observer;
		this.#callback = init.callback;
	}

	/**
	 * Reports mutations.
	 *
	 * @param record Record.
	 */
	public report(record: MutationRecord): void {
		if (this.#destroyed) {
			return;
		}

		this.#records.push(record);

		if (this.#microtaskQueued) {
			return;
		}

		this.#window.queueMicrotask(() => {
			if (this.#destroyed) {
				return;
			}

			this.#microtaskQueued = false;

			const records = this.#records;

			if (records?.length > 0) {
				this.#records = [];
				this.#callback(records, this.#observer);
			}
		});

		this.#microtaskQueued = true;
	}

	/**
	 * Destroys the listener.
	 */
	public takeRecords(): MutationRecord[] {
		if (this.#destroyed) {
			return [];
		}
		const records = this.#records;
		this.#records = [];
		return records;
	}

	/**
	 * Destroys the listener.
	 */
	public destroy(): void {
		if (this.#destroyed) {
			return;
		}
		this.#destroyed = true;
		this.options = null!;
		this.target = null!;
		this.mutationListener = null!;
		this.#window = null!;
		this.#observer = null!;
		this.#callback = null!;
		this.#records = null!;
	}
}

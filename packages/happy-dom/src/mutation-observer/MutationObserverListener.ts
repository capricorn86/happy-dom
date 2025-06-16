import IMutationObserverInit from './IMutationObserverInit.js';
import MutationObserver from './MutationObserver.js';
import MutationRecord from './MutationRecord.js';
import Node from '../nodes/node/Node.js';
import BrowserWindow from '../window/BrowserWindow.js';
import IMutationListener from './IMutationListener.js';

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
	#timeout: NodeJS.Timeout | null = null;

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

		if (this.#timeout) {
			this.#window.clearTimeout(this.#timeout);
		}

		this.#timeout = this.#window.setTimeout(() => {
			if (this.#destroyed) {
				return;
			}
			const records = this.#records;
			if (records?.length > 0) {
				this.#records = [];
				this.#callback(records, this.#observer);
			}
		});
	}

	/**
	 * Destroys the listener.
	 */
	public takeRecords(): MutationRecord[] {
		if (this.#timeout) {
			this.#window.clearTimeout(this.#timeout);
		}
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
		if (this.#timeout) {
			this.#window.clearTimeout(this.#timeout);
		}
		this.#destroyed = true;
		this.options = null!;
		this.target = null!;
		this.mutationListener = null!;
		this.#window = null!;
		this.#observer = null!;
		this.#callback = null!;
		this.#timeout = null;
		this.#records = null!;
	}
}

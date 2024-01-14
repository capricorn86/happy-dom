import IMutationObserverInit from './IMutationObserverInit.js';
import MutationObserver from './MutationObserver.js';
import MutationRecord from './MutationRecord.js';
import INode from '../nodes/node/INode.js';
import IBrowserWindow from '../window/IBrowserWindow.js';

/**
 * Mutation Observer Listener.
 */
export default class MutationListener {
	public readonly target: INode;
	public options: IMutationObserverInit;
	#window: IBrowserWindow;
	#observer: MutationObserver;
	#callback: (record: MutationRecord[], observer: MutationObserver) => void;
	#records: MutationRecord[] = [];
	#immediate: NodeJS.Immediate | null = null;

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
		window: IBrowserWindow;
		options: IMutationObserverInit;
		target: INode;
		observer: MutationObserver;
		callback: (record: MutationRecord[], observer: MutationObserver) => void;
	}) {
		this.options = init.options;
		this.target = init.target;
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
		this.#records.push(record);
		if (this.#immediate) {
			this.#window.cancelAnimationFrame(this.#immediate);
		}
		this.#immediate = this.#window.requestAnimationFrame(() => {
			const records = this.#records;
			if (records.length > 0) {
				this.#records = [];
				this.#callback(records, this.#observer);
			}
		});
	}

	/**
	 * Destroys the listener.
	 */
	public takeRecords(): MutationRecord[] {
		if (this.#immediate) {
			this.#window.cancelAnimationFrame(this.#immediate);
		}
		const records = this.#records;
		this.#records = [];
		return records;
	}

	/**
	 * Destroys the listener.
	 */
	public destroy(): void {
		if (this.#immediate) {
			this.#window.cancelAnimationFrame(this.#immediate);
		}
		(<null>this.options) = null;
		(<null>this.target) = null;
		(<null>this.#observer) = null;
		(<null>this.#callback) = null;
		(<null>this.#immediate) = null;
		(<null>this.#records) = null;
	}
}

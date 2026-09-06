import type IVirtualConsoleLogEntry from './IVirtualConsoleLogEntry.js';
import VirtualConsoleLogLevelEnum from './enums/VirtualConsoleLogLevelEnum.js';
import Event from '../event/Event.js';
import VirtualConsoleLogEntryStringifier from './utilities/VirtualConsoleLogEntryStringifier.js';
import type IVirtualConsolePrinter from './IVirtualConsolePrinter.js';

/**
 * Virtual console printer.
 */
export default class VirtualConsolePrinter implements IVirtualConsolePrinter {
	#logEntries: IVirtualConsoleLogEntry[] = [];
	#listeners: {
		print: Array<(event: Event) => void>;
		clear: Array<(event: Event) => void>;
	} = { print: [], clear: [] };
	#closed = false;
	// Maximum number of buffered log entries kept when nothing reads the buffer. Prevents an
	// unbounded buffer (and the objects its entries retain) from leaking on a long-lived Window.
	#maxLogEntries = 1000;

	/**
	 * Returns closed state.
	 *
	 * @returns True if the printer is closed.
	 */
	public get closed(): boolean {
		return this.#closed;
	}

	/**
	 * Writes to the output.
	 *
	 * @param logEntry Log entry.
	 */
	public print(logEntry: IVirtualConsoleLogEntry): void {
		if (this.#closed) {
			return;
		}

		// On V8, an Error keeps its structured stack trace (an array of call sites) alive until
		// ".stack" is first read, and each call site retains its frame's receiver. When an exception
		// thrown from an event listener is caught and logged here, that receiver is the listening
		// element, so the buffered Error pins the element - and through it the document. The buffer
		// is rarely read, so the trace would otherwise never be released. Materialize ".stack" now to
		// drop the structured trace (and the receivers it holds) while keeping the formatted string.
		for (const message of logEntry.message) {
			if (message instanceof Error) {
				void message.stack;
			}
		}

		// Log entries are buffered until read(). When nothing reads them (the default when a Window
		// is used without inspecting its console) the buffer grows without bound, so cap it and drop
		// the oldest entries, matching how a real console keeps only a limited scrollback.
		if (this.#logEntries.length >= this.#maxLogEntries) {
			this.#logEntries.splice(0, this.#logEntries.length - this.#maxLogEntries + 1);
		}

		this.#logEntries.push(logEntry);
		this.dispatchEvent(new Event('print'));
	}

	/**
	 * Clears the output.
	 */
	public clear(): void {
		if (this.#closed) {
			return;
		}
		this.#logEntries = [];
		this.dispatchEvent(new Event('clear'));
	}

	/**
	 * Clears and closes the virtual console printer.
	 */
	public close(): void {
		if (this.#closed) {
			return;
		}
		this.#logEntries = [];
		this.#listeners = { print: [], clear: [] };
		this.#closed = true;
	}

	/**
	 * Adds an event listener.
	 *
	 * @param eventType Event type ("print" or "clear").
	 * @param listener Listener.
	 */
	public addEventListener(eventType: 'print' | 'clear', listener: (event: Event) => void): void {
		if (this.#closed) {
			return;
		}
		if (!this.#listeners[eventType]) {
			throw new Error(`Event type "${eventType}" is not supported.`);
		}
		this.#listeners[eventType].push(listener);
	}

	/**
	 * Removes an event listener.
	 *
	 * @param eventType Event type ("print" or "clear").
	 * @param listener Listener.
	 */
	public removeEventListener(eventType: 'print' | 'clear', listener: (event: Event) => void): void {
		if (this.#closed) {
			return;
		}
		if (!this.#listeners[eventType]) {
			throw new Error(`Event type "${eventType}" is not supported.`);
		}
		const index = this.#listeners[eventType].indexOf(listener);
		if (index !== -1) {
			this.#listeners[eventType].splice(index, 1);
		}
	}

	/**
	 * Dispatches an event.
	 *
	 * @param event Event.
	 */
	public dispatchEvent(event: Event): void {
		if (this.#closed) {
			return;
		}
		switch (event.type) {
			case 'print':
			case 'clear':
				for (const listener of this.#listeners[event.type]) {
					listener(event);
				}
				break;
			default:
				throw new Error(`Event type "${event.type}" is not supported.`);
		}
	}

	/**
	 * Reads the buffer.
	 *
	 * @returns Console log entries.
	 */
	public read(): IVirtualConsoleLogEntry[] {
		const logEntries = this.#logEntries;
		this.#logEntries = [];
		return logEntries;
	}

	/**
	 * Returns the buffer as a string.
	 *
	 * @param [logLevel] Log level.
	 * @returns Buffer as a string of concatenated log entries.
	 */
	public readAsString(
		logLevel: VirtualConsoleLogLevelEnum = VirtualConsoleLogLevelEnum.log
	): string {
		const logEntries = this.read();
		let output = '';
		for (const logEntry of logEntries) {
			if (logEntry.level >= logLevel) {
				output += VirtualConsoleLogEntryStringifier.toString(logEntry);
			}
		}
		return output;
	}
}

import IVirtualConsoleLogEntry from './IVirtualConsoleLogEntry.js';
import VirtualConsoleLogLevelEnum from './enums/VirtualConsoleLogLevelEnum.js';
import Event from '../event/Event.js';
import VirtualConsoleLogEntryStringifier from './utilities/VirtualConsoleLogEntryStringifier.js';
import IVirtualConsolePrinter from './IVirtualConsolePrinter.js';

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

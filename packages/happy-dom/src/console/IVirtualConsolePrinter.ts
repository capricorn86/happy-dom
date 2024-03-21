import IVirtualConsoleLogEntry from './IVirtualConsoleLogEntry.js';
import VirtualConsoleLogLevelEnum from './enums/VirtualConsoleLogLevelEnum.js';
import Event from '../event/Event.js';

/**
 * Virtual console printer.
 */
export default interface IVirtualConsolePrinter {
	/**
	 * Writes to the output.
	 *
	 * @param logEntry Log entry.
	 */
	print(logEntry: IVirtualConsoleLogEntry): void;

	/**
	 * Clears the output.
	 */
	clear(): void;

	/**
	 * Adds an event listener.
	 *
	 * @param eventType Event type ("print" or "clear").
	 * @param listener Listener.
	 */
	addEventListener(eventType: 'print' | 'clear', listener: (event: Event) => void): void;

	/**
	 * Removes an event listener.
	 *
	 * @param eventType Event type ("print" or "clear").
	 * @param listener Listener.
	 */
	removeEventListener(eventType: 'print' | 'clear', listener: (event: Event) => void): void;

	/**
	 * Dispatches an event.
	 *
	 * @param event Event.
	 */
	dispatchEvent(event: Event): void;

	/**
	 * Reads the buffer.
	 *
	 * @returns Console log entries.
	 */
	read(): IVirtualConsoleLogEntry[];

	/**
	 * Returns the buffer as a string.
	 *
	 * @param [logLevel] Log level.
	 * @returns Buffer as a string of concatenated log entries.
	 */
	readAsString(logLevel?: VirtualConsoleLogLevelEnum): string;
}

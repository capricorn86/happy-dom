import DOMException from '../exception/DOMException.js';
import IBrowserWindow from '../window/IBrowserWindow.js';
import ClipboardItem from './ClipboardItem.js';
import Blob from '../file/Blob.js';

/**
 * Clipboard API.
 *
 * Reference:
 * https://developer.mozilla.org/en-US/docs/Web/API/Clipboard.
 */
export default class Clipboard {
	#ownerWindow: IBrowserWindow;
	#data: ClipboardItem[] = [];

	/**
	 * Constructor.
	 *
	 * @param ownerWindow Owner window.
	 */
	constructor(ownerWindow: IBrowserWindow) {
		this.#ownerWindow = ownerWindow;
	}

	/**
	 * Returns data.
	 *
	 * @returns Data.
	 */
	public async read(): Promise<ClipboardItem[]> {
		const permissionStatus = await this.#ownerWindow.navigator.permissions.query({
			name: 'clipboard-read'
		});
		if (permissionStatus.state === 'denied') {
			throw new DOMException(`Failed to execute 'read' on 'Clipboard': The request is not allowed`);
		}
		return this.#data;
	}

	/**
	 * Returns text.
	 *
	 * @returns Text.
	 */
	public async readText(): Promise<string> {
		const permissionStatus = await this.#ownerWindow.navigator.permissions.query({
			name: 'clipboard-read'
		});
		if (permissionStatus.state === 'denied') {
			throw new DOMException(
				`Failed to execute 'readText' on 'Clipboard': The request is not allowed`
			);
		}
		let text = '';
		for (const item of this.#data) {
			if (item.types.includes('text/plain')) {
				text += await (await item.getType('text/plain')).text();
			}
		}
		return text;
	}

	/**
	 * Writes data.
	 *
	 * @param data Data.
	 */
	public async write(data: ClipboardItem[]): Promise<void> {
		const permissionStatus = await this.#ownerWindow.navigator.permissions.query({
			name: 'clipboard-write'
		});
		if (permissionStatus.state === 'denied') {
			throw new DOMException(
				`Failed to execute 'write' on 'Clipboard': The request is not allowed`
			);
		}
		this.#data = data;
	}

	/**
	 * Writes text.
	 *
	 * @param text Text.
	 */
	public async writeText(text: string): Promise<void> {
		const permissionStatus = await this.#ownerWindow.navigator.permissions.query({
			name: 'clipboard-write'
		});
		if (permissionStatus.state === 'denied') {
			throw new DOMException(
				`Failed to execute 'writeText' on 'Clipboard': The request is not allowed`
			);
		}
		this.#data = [new ClipboardItem({ 'text/plain': new Blob([text], { type: 'text/plain' }) })];
	}
}

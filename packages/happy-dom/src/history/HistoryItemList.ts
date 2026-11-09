import HistoryScrollRestorationEnum from './HistoryScrollRestorationEnum.js';
import type IHistoryItem from './IHistoryItem.js';

/**
 * History item list.
 */
export default class HistoryItemList {
	public currentItem: IHistoryItem = {
		title: '',
		url: 'about:blank',
		navigationURL: 'about:blank',
		state: null,
		scrollRestoration: HistoryScrollRestorationEnum.auto,
		method: 'GET',
		formData: null,
		inheritOrigin: true
	};
	public readonly items: IHistoryItem[] = [this.currentItem];

	/**
	 * History item list.
	 *
	 * @param historyItem History item.
	 */
	public push(historyItem: IHistoryItem): void {
		const index = this.items.indexOf(this.currentItem);

		// If the current item is not the last one, remove all items after it.
		if (index !== this.items.length - 1) {
			this.items.length = index + 1;
		}

		this.items.push(historyItem);
		this.currentItem = historyItem;
	}

	/**
	 * Replaces the current history item with the provided one.
	 *
	 * @param historyItem History item to replace the current one with.
	 */
	public replace(historyItem: IHistoryItem): void {
		const index = this.items.indexOf(this.currentItem);

		// If the current item is not the last one, remove all items after it.
		if (index !== this.items.length - 1) {
			this.items.length = index + 1;
		}

		if (index === -1) {
			throw new Error('Current history item not found');
		}

		this.currentItem = historyItem;
		this.items[index] = historyItem;
	}

	/**
	 * Clears history and sets current item to "about:blank".
	 */
	public clear(): void {
		this.items.length = 0;
		this.currentItem = {
			title: '',
			url: 'about:blank',
			navigationURL: 'about:blank',
			state: null,
			scrollRestoration: HistoryScrollRestorationEnum.auto,
			method: 'GET',
			formData: null,
			inheritOrigin: true
		};
		this.items.push(this.currentItem);
	}

	/**
	 * Returns the current navigation URL by looking back in the history items.
	 *
	 * @returns The current navigation URL.
	 */
	public getNavigationURL(): string {
		const index = this.items.indexOf(this.currentItem);
		if (index !== -1) {
			for (let i = index; i >= 0; i--) {
				const item = this.items[i];
				if (item.navigationURL) {
					return item.navigationURL;
				}
			}
		}
		return 'about:blank';
	}
}

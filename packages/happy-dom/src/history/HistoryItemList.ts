import HistoryScrollRestorationEnum from './HistoryScrollRestorationEnum.js';
import IHistoryItem from './IHistoryItem.js';

/**
 * History item list.
 */
export default class HistoryItemList {
	public currentItem: IHistoryItem = {
		title: '',
		href: 'about:blank',
		state: null,
		popState: false,
		scrollRestoration: HistoryScrollRestorationEnum.auto,
		method: 'GET',
		formData: null
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
	 *
	 * @param historyItem
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
			href: 'about:blank',
			state: null,
			popState: false,
			scrollRestoration: HistoryScrollRestorationEnum.auto,
			method: 'GET',
			formData: null
		};
		this.items.push(this.currentItem);
	}
}

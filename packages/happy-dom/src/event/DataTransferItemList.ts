import File from '../file/File';
import DataTransferItem from './DataTransferItem';

/**
 *
 */
export default class DataTransferItemList {
	public readonly DataTransferItem: DataTransferItem[] = [];

	/**
	 * Adds an item.
	 *
	 * @param item Item.
	 */
	public add(item: File | string): void {
		this.DataTransferItem.push(new DataTransferItem(item));
	}

	/**
	 * Removes an item.
	 *
	 * @param index Index.
	 */
	public remove(index: number): void {
		this.DataTransferItem.splice(index, 1);
	}

	/**
	 * Clears list.
	 */
	public clear(): void {
		(<DataTransferItem[]>this.DataTransferItem) = [];
	}
}

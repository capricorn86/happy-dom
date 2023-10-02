import File from '../file/File.js';
import DataTransferItemList from './DataTransferItemList.js';

/**
 *
 */
export default class DataTransfer {
	public dropEffect = 'none';
	public effectAllowed = 'none';
	public readonly items: DataTransferItemList = new DataTransferItemList();
	public readonly types: string[] = [];

	/**
	 * Returns files.
	 *
	 * @returns Files.
	 */
	public get files(): File[] {
		const files = [];
		for (const item of this.items) {
			if (item.kind === 'file') {
				files.push(item.getAsFile());
			}
		}
		return files;
	}
}

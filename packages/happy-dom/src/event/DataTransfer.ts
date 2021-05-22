import File from '../file/File';
import DataTransferItemList from './DataTransferItemList';

/**
 *
 */
export default class DataTransfer {
	public dropEffect = 'none';
	public effectAllowed = 'none';
	public files: File[] = [];
	public readonly items: DataTransferItemList = new DataTransferItemList();
	public readonly types: string[] = [];
}

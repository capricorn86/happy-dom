import type IEventInit from '../IEventInit.js';
import type Storage from '../../storage/Storage.js';

export default interface IStorageEventInit extends IEventInit {
	key?: string;
	oldValue?: string;
	newValue?: string;
	url?: string;
	storageArea?: Storage;
}

import IEventInit from '../IEventInit.js';
import Storage from '../../storage/Storage.js';

export default interface IStorageEventInit extends IEventInit {
	key?: string;
	newValue?: string;
	oldValue?: string;
	storageArea?: Storage;
}

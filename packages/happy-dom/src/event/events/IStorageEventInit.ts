import IEventInit from '../IEventInit';
import Storage from '../../storage/Storage';

export default interface IStorageEventInit extends IEventInit {
	key?: string;
	newValue?: string;
	oldValue?: string;
	storageArea?: Storage;
}

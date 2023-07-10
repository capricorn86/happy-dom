import Event from '../Event.js';
import IStorageEventInit from './IStorageEventInit.js';
import Storage from '../../storage/Storage.js';

/**
 *
 */
export default class StorageEvent extends Event {
	public readonly key: string = null;
	public readonly newValue: string = null;
	public readonly oldValue: string = null;
	public readonly storageArea: Storage = null;

	/**
	 * Constructor.
	 *
	 * @param type Event type.
	 * @param [eventInit] Event init.
	 */
	constructor(type: string, eventInit: IStorageEventInit = null) {
		super(type);

		if (eventInit) {
			this.key = eventInit.key !== undefined ? eventInit.key : null;
			this.newValue = eventInit.newValue !== undefined ? eventInit.newValue : null;
			this.oldValue = eventInit.oldValue !== undefined ? eventInit.oldValue : null;
			this.storageArea = eventInit.storageArea !== undefined ? eventInit.storageArea : null;
		}
	}
}

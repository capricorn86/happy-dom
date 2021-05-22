import Event from '../Event';
import IProgressEventInit from './IProgressEventInit';

/**
 *
 */
export default class ProgressEvent extends Event {
	public readonly lengthComputable: boolean = false;
	public readonly loaded: number = 0;
	public readonly total: number = 0;

	/**
	 * Constructor.
	 *
	 * @param type Event type.
	 * @param [eventInit] Event init.
	 */
	constructor(type: string, eventInit: IProgressEventInit = null) {
		super(type);

		if (eventInit) {
			this.lengthComputable = eventInit.lengthComputable || false;
			this.loaded = eventInit.loaded !== undefined ? eventInit.loaded : 0;
			this.total = eventInit.total !== undefined ? eventInit.total : 0;
		}
	}
}

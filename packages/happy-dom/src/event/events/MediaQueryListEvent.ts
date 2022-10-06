import Event from '../Event';
import IMediaQueryListInit from './IMediaQueryListInit';

/**
 *
 */
export default class MediaQueryListEvent extends Event {
	public readonly matches: boolean = false;
	public readonly media: string = '';

	/**
	 * Constructor.
	 *
	 * @param type Event type.
	 * @param [eventInit] Event init.
	 */
	constructor(type: string, eventInit: IMediaQueryListInit = null) {
		super(type, eventInit);

		if (eventInit) {
			this.matches = eventInit.matches || false;
			this.media = eventInit.media || '';
		}
	}
}

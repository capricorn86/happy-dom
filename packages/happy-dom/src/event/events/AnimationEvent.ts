import Event from '../Event';
import IAnimationEventInit from './IAnimationEventInit';

/**
 *
 */
export default class AnimationEvent extends Event {
	public animationName = '';
	public elapsedTime = 0;
	public pseudoElement = '';

	/**
	 * Constructor.
	 *
	 * @param type Event type.
	 * @param [eventInit] Event init.
	 */
	constructor(type: string, eventInit?: IAnimationEventInit) {
		super(type, eventInit);
		this.animationName = eventInit?.animationName || '';
		this.elapsedTime = eventInit?.elapsedTime || 0;
		this.pseudoElement = eventInit?.pseudoElement || '';
	}
}

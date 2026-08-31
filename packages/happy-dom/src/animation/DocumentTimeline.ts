import AnimationTimeline from './AnimationTimeline.js';

export interface IDocumentTimelineOptions {
	originTime?: number;
}

/**
 * Document timeline.
 *
 * @see https://drafts.csswg.org/web-animations-1/#the-documenttimeline-interface
 */
export default class DocumentTimeline extends AnimationTimeline {
	#originTime: number;

	/**
	 * Constructor.
	 *
	 * @param options Options.
	 */
	constructor(options: IDocumentTimelineOptions = {}) {
		super();
		this.#originTime = options.originTime ?? 0;
	}

	/**
	 * Returns the current timeline time.
	 *
	 * @returns Current time in milliseconds.
	 */
	public override get currentTime(): number {
		return performance.now() - this.#originTime;
	}
}

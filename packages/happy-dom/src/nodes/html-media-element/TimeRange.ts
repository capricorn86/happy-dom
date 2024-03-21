/**
 * Based on implementation from JSDOM.
 *
 * @see https://github.com/jsdom/jsdom/blob/master/lib/jsdom/living/nodes/HTMLMediaElement-impl.js#L7
 */
export default class TimeRange {
	public readonly length: number = 0;

	/**
	 * Returns start.
	 *
	 * @returns Start.
	 */
	public start(): number {
		return 0;
	}

	/**
	 * Returns end.
	 *
	 * @returns End.
	 */
	public end(): number {
		return 0;
	}
}

import Screen from './Screen.js';

/**
 * ScreenDetailed.
 *
 * @see https://developer.mozilla.org/en-US/docs/Web/API/ScreenDetailed
 */
export default class ScreenDetailed extends Screen {
	public readonly availLeft: number = 0;
	public readonly availTop: number = 0;
	public readonly left: number = 0;
	public readonly top: number = 0;
	public readonly isPrimary: boolean = true;
	public readonly isInternal: boolean = true;
	public readonly devicePixelRatio: number = 1;
	public readonly label: string = '';
}

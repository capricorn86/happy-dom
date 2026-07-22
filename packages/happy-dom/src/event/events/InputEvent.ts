import type DataTransfer from '../DataTransfer.js';
import UIEvent from '../UIEvent.js';
import type StaticRange from '../../range/StaticRange.js';
import type IInputEventInit from './IInputEventInit.js';

/**
 *
 */
export default class InputEvent extends UIEvent {
	public readonly data: string;
	public readonly dataTransfer: DataTransfer | null;
	public readonly inputType: string;
	public readonly isComposing: boolean;
	readonly #targetRanges: StaticRange[];

	/**
	 * Constructor.
	 *
	 * @param type Event type.
	 * @param [eventInit] Event init.
	 */
	constructor(type: string, eventInit: IInputEventInit | null = null) {
		super(type, eventInit);

		this.data = eventInit?.data ?? '';
		this.dataTransfer = eventInit?.dataTransfer ?? null;
		this.inputType = eventInit?.inputType ?? '';
		this.isComposing = eventInit?.isComposing ?? false;
		this.#targetRanges = eventInit?.targetRanges ?? [];
	}

	/**
	 * Returns the ranges that this event will affect.
	 *
	 * @returns A copy of the target ranges array.
	 */
	public getTargetRanges(): StaticRange[] {
		return this.#targetRanges.slice();
	}
}

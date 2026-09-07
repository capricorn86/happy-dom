import DOMException from '../../exception/DOMException.js';
import type HTMLInputElement from './HTMLInputElement.js';

/**
 * HTML input element value stepping.
 */
export default class HTMLInputElementValueStepping {
	/**
	 * Steps up or down.
	 *
	 * @param input Input element.
	 * @param direction Direction.
	 * @param [increment] Increment.
	 * @returns New value.
	 */
	public static step(
		input: HTMLInputElement,
		direction: -1 | 1,
		increment?: number
	): string | null {
		const type = input.type;
		switch (type) {
			case 'number':
				return this.getNumberValue(input, direction, increment);
			case 'date':
			case 'month':
			case 'week':
			case 'time':
			case 'datetime-local':
			case 'range':
				// TODO: Implement support for additional types
				return null;
			default:
				throw new DOMException('This form element is not steppable.');
		}
	}

	/**
	 * Returns the stepped value for "number" input field.
	 *
	 * @see https://html.spec.whatwg.org/multipage/input.html#dom-input-stepup
	 * @param input Input element.
	 * @param direction Direction.
	 * @param [increment] Increment.
	 */
	private static getNumberValue(
		input: HTMLInputElement,
		direction: -1 | 1,
		increment?: number
	): string {
		const minValue = input.min;
		const maxValue = input.max;
		const stepValue = input.step;

		let min = minValue !== '' ? Number(minValue) : null;
		let max = maxValue !== '' ? Number(maxValue) : null;
		let step = stepValue !== '' ? Number(stepValue) : 1;
		let value = Number(input.value);

		min = min === null || Number.isNaN(min) ? null : min;
		max = max === null || Number.isNaN(max) ? null : max;
		step = Number.isNaN(step) || step === 0 ? 1 : step;
		value = Number.isNaN(value) ? 0 : value;

		if (min !== null && max !== null && (min > max || max < min)) {
			return input.value;
		}

		if (increment === 0) {
			return input.value;
		}

		const validIncrementValue = increment !== undefined ? Math.ceil(increment / step) * step : step;
		const candidate = value + validIncrementValue * direction;
		const minOrZero = min !== null ? min : 0;

		switch (direction) {
			// Step down
			case -1:
				if (min !== null && candidate < min) {
					return String(min);
				}
				// Previous valid step from value
				return String(candidate + ((value - minOrZero) % step));
			// Step up
			case 1:
				if (max !== null && candidate > max) {
					return String(minOrZero + Math.floor((max - minOrZero) / step) * step);
				}
				// Next valid step from value
				return String(candidate - ((value - minOrZero) % step));
		}
	}
}

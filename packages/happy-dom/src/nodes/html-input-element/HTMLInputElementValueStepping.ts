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
		let value = input.valueAsNumber;

		min = min === null || Number.isNaN(min) ? null : min;
		max = max === null || Number.isNaN(max) ? null : max;
		step = Number.isNaN(step) || step === 0 ? 1 : step;

		// Preserve value when out of bounds
		if (
			increment === 0 ||
			(direction === -1 && min !== null && value <= min) ||
			(direction === 1 && max !== null && value >= max) ||
			(min !== null && max !== null && min > max)
		) {
			return input.value;
		}

		if (Number.isNaN(value)) {
			value = 0;

			// Default value when min is above zero
			// (Chromium behaviour, WebKit preserves value on step down)
			if (min !== null && min > 0) {
				return minValue;
			}

			// Default value when max is below zero
			// (Chromium behaviour, WebKit preserves value on step up)
			if (max !== null && max < 0) {
				return maxValue;
			}
		}

		let candidate = increment
			? value + Math.ceil(increment / step) * step * direction
			: value + step * direction;

		const base = min ?? 0;

		switch (direction) {
			// Step down
			case -1:
				if (min !== null && candidate < min) {
					candidate = min;
					break;
				}

			// Step up
			case 1:
				if (min !== null && value <= min) {
					candidate = min;
					break;
				}
				if (max !== null && candidate > max) {
					candidate = base + Math.floor((max - base) / step) * step;
					break;
				}

			// Previous or next valid step from value
			default:
				candidate = candidate - ((value - base) % step) * direction;
				break;
		}

		return String(candidate);
	}
}

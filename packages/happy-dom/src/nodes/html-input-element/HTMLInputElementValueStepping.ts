import { Decimal } from 'decimal.js';
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
	 * @param [n] Number of times to step.
	 * @returns New value.
	 */
	public static step(input: HTMLInputElement, direction: -1 | 1, n?: number): string | null {
		const type = input.type;
		switch (type) {
			case 'number':
				return this.getNumberValue(input, direction, n);
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
	 * @param [n] Number of times to step.
	 */
	private static getNumberValue(input: HTMLInputElement, direction: -1 | 1, n?: number): string {
		const minValue = input.min;
		const maxValue = input.max;
		const stepValue = input.step;

		let min = minValue !== '' ? Number(minValue) : null;
		let max = maxValue !== '' ? Number(maxValue) : null;
		let step = stepValue !== '' ? Number(stepValue) : 1;
		let valueBeforeStepping = input.valueAsNumber;

		min = min === null || Number.isNaN(min) ? null : min;
		max = max === null || Number.isNaN(max) ? null : max;
		step = Number.isNaN(step) || step === 0 ? 1 : step;

		// Preserve value when out of bounds
		if (
			n === 0 ||
			(direction === -1 && min !== null && valueBeforeStepping <= min) ||
			(direction === 1 && max !== null && valueBeforeStepping >= max) ||
			(min !== null && max !== null && min > max)
		) {
			return input.value;
		}

		if (Number.isNaN(valueBeforeStepping)) {
			valueBeforeStepping = 0;

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

		const base = min ?? 0;
		const rounding = direction === 1 ? Decimal.ROUND_FLOOR : Decimal.ROUND_CEIL;

		// Previous or next valid step from value
		let value = new Decimal(valueBeforeStepping)
			.minus(base)
			.toNearest(step, rounding)
			.add(base)
			.add(step * (n ?? 1) * direction);

		// Clamp to min
		if (min !== null && value.lessThan(min)) {
			value = new Decimal(min);
		}

		// Clamp to max
		if (max !== null && value.greaterThan(max)) {
			value = new Decimal(max).minus(base).toNearest(step, Decimal.ROUND_FLOOR).add(base);
		}

		return value.toString();
	}
}

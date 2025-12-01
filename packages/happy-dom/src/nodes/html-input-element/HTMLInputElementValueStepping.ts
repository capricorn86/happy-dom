import DOMException from '../../exception/DOMException.js';

export interface IStepConfig {
	type: string;
	value: string;
	direction: -1 | 1;
	increment?: number;
	min?: number | string;
	max?: number | string;
	step?: number | string;
}

/**
 * Calculation to conform number input to HTML spec stepUp/stepDown behavior
 * @param resultConfig Calculation configuration.
 * @param resultConfig.result Initial result.
 * @param resultConfig.min Min.
 * @param resultConfig.max Max.
 * @param [resultConfig.step] Step.
 * @param resultConfig.direction
 * @see {@link https://html.spec.whatwg.org/multipage/input.html#dom-input-stepup|stepUp/stepDown spec}
 */
function calculateSteppedValue({
	result,
	min,
	max,
	direction,
	step
}: {
	result: number;
	min: number;
	max: number;
	direction: -1 | 1;
	step?: number;
}): number {
	if (isNaN(result)) {
		return result;
	}

	let finalResult = Math.min(Math.max(result, min), max);
	if (step === undefined) {
		return finalResult;
	}

	const divisionRemainder = finalResult % step;
	if (divisionRemainder === 0) {
		return finalResult;
	}

	if (direction === -1) {
		// result must not step lower than original result and must be divisble by step
		finalResult = finalResult + step - divisionRemainder;
		return finalResult;
	}

	// result must not step higher than original result and must be divisble by step
	finalResult = finalResult - divisionRemainder;
	return finalResult;
}

/**
 * HTML input element value stepping.
 */
export default class HTMLInputElementValueStepping {
	/**
	 * Steps up or down.
	 *
	 * @param config Step configuration.
	 * @param config.type Type.
	 * @param config.value Value.
	 * @param config.direction Direction.
	 * @param config.increment Increment.
	 * @param config.min Min.
	 * @param config.max Max.
	 * @param config.step Step.
	 * @returns New value.
	 */
	public static step({
		type,
		value,
		direction,
		increment: incrementParam,
		min: minParam,
		max: maxParam,
		step: stepParam
	}: IStepConfig): string | null {
		switch (type) {
			case 'number':
				const step = stepParam !== undefined && stepParam !== '' ? Number(stepParam) : undefined;
				const increment = incrementParam ?? step ?? 1;
				const min = minParam !== undefined && minParam !== '' ? Number(minParam) : -Infinity;
				const max = maxParam !== undefined && maxParam !== '' ? Number(maxParam) : Infinity;
				const calcResult = Number(value) + increment * direction;
				const result = calculateSteppedValue({
					result: calcResult,
					min,
					max,
					direction,
					step
				});
				return String(result);
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
}

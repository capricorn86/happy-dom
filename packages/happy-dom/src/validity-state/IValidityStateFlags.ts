/**
 * Constraint-validation flags accepted by ElementInternals.setValidity().
 *
 * @see https://developer.mozilla.org/en-US/docs/Web/API/ValidityStateFlags
 */
export default interface IValidityStateFlags {
	badInput?: boolean;
	customError?: boolean;
	patternMismatch?: boolean;
	rangeOverflow?: boolean;
	rangeUnderflow?: boolean;
	stepMismatch?: boolean;
	tooLong?: boolean;
	tooShort?: boolean;
	typeMismatch?: boolean;
	valueMissing?: boolean;
}

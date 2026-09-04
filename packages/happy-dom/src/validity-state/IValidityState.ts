import type IValidityStateFlags from './IValidityStateFlags.js';

/**
 * Structural form of ValidityState as exposed by ElementInternals for a form-associated
 * custom element: a simplified pass-through of the flags last reported via setValidity(),
 * unlike the attribute-derived ValidityState class used by built-in form controls.
 *
 * @see https://developer.mozilla.org/en-US/docs/Web/API/ValidityState
 */
export default interface IValidityState extends IValidityStateFlags {
	valid: boolean;
}

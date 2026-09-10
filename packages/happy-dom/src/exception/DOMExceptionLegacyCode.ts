/**
 * Legacy code values for the names listed in the DOMException names table.
 *
 * Reference:
 * https://webidl.spec.whatwg.org/#dfn-error-names-table.
 */
const DOMExceptionLegacyCode: { [name: string]: number } = {
	IndexSizeError: 1,
	HierarchyRequestError: 3,
	WrongDocumentError: 4,
	InvalidCharacterError: 5,
	NoModificationAllowedError: 7,
	NotFoundError: 8,
	NotSupportedError: 9,
	InUseAttributeError: 10,
	InvalidStateError: 11,
	SyntaxError: 12,
	InvalidModificationError: 13,
	NamespaceError: 14,
	InvalidAccessError: 15,
	TypeMismatchError: 17,
	SecurityError: 18,
	NetworkError: 19,
	AbortError: 20,
	URLMismatchError: 21,
	QuotaExceededError: 22,
	TimeoutError: 23,
	InvalidNodeTypeError: 24,
	DataCloneError: 25
};

export default DOMExceptionLegacyCode;

import DOMMatrixReadOnly from './DOMMatrixReadOnly.js';
import IJSONMatrix from './IJSONMatrix.js';

type TDOMMatrixInit =
	| string
	| any[]
	| DOMMatrixReadOnly
	| IJSONMatrix
	| Float32Array
	| Float64Array;
export default TDOMMatrixInit;

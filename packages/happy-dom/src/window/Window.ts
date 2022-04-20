import GlobalWindow from './GlobalWindow';
import VM from 'vm';

/**
 * Browser window without a VM in the global scope.
 *
 * Reference:
 * https://developer.mozilla.org/en-US/docs/Web/API/Window.
 */
export default class Window extends GlobalWindow {
	// Node.js Globals
	public ArrayBuffer;
	public Boolean;
	public Buffer;
	public DataView;
	public Date;
	public Error;
	public EvalError;
	public Float32Array;
	public Float64Array;
	public GLOBAL;
	public Infinity;
	public Int16Array;
	public Int32Array;
	public Int8Array;
	public Intl;
	public JSON;
	public Map;
	public Math;
	public NaN;
	public Number;
	public Promise;
	public RangeError;
	public ReferenceError;
	public RegExp;
	public Reflect;
	public Set;
	public Symbol;
	public SyntaxError;
	public String;
	public TypeError;
	public URIError;
	public Uint16Array;
	public Uint32Array;
	public Uint8Array;
	public Uint8ClampedArray;
	public WeakMap;
	public WeakSet;
	public clearImmediate;
	public decodeURI;
	public decodeURIComponent;
	public encodeURI;
	public encodeURIComponent;
	public escape;
	public global;
	public isFinite;
	public isNaN;
	public parseFloat;
	public parseInt;
	public process;
	public root;
	public setImmediate;
	public queueMicrotask;
	public undefined;
	public unescape;
	public gc;
	public v8debug;
	public AbortController;
	public AbortSignal;
	public Array;
	public Object;
	public Function;

	/**
	 * Constructor.
	 */
	constructor() {
		super();

		if (!VM.isContext(this)) {
			VM.createContext(this);
		}
	}

	/**
	 * Evaluates code.
	 *
	 * @override
	 * @param code Code.
	 * @returns Result.
	 */
	public eval(code: string): unknown {
		return VM.runInContext(code, this);
	}
}

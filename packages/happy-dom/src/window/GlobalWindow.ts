import Window from './Window';

/**
 * Browser window.
 *
 * Reference:
 * https://developer.mozilla.org/en-US/docs/Web/API/Window.
 */
export default class GlobalWindow extends Window {
	// Node.js Globals
	public ArrayBuffer = globalThis.ArrayBuffer;
	public Boolean = globalThis.Boolean;
	public Buffer = globalThis.global ? globalThis.global.Buffer : Buffer;
	public DataView = globalThis.DataView;
	public Date = globalThis.Date;
	public Error = globalThis.Error;
	public EvalError = globalThis.EvalError;
	public Float32Array = globalThis.Float32Array;
	public Float64Array = globalThis.Float64Array;
	public GLOBAL = globalThis.GLOBAL;
	public Infinity = globalThis.Infinity;
	public Int16Array = globalThis.Int16Array;
	public Int32Array = globalThis.Int32Array;
	public Int8Array = globalThis.Int8Array;
	public Intl = globalThis.Intl;
	public JSON = globalThis.JSON;
	public Map = globalThis.Map;
	public Math = globalThis.Math;
	public NaN = globalThis.NaN;
	public Number = globalThis.Number;
	public Promise = globalThis.Promise;
	public RangeError = globalThis.RangeError;
	public ReferenceError = globalThis.ReferenceError;
	public RegExp = globalThis.RegExp;
	public Reflect = globalThis.ArrayBuffer;
	public Set = globalThis.Set;
	public Symbol = globalThis.Symbol;
	public SyntaxError = globalThis.SyntaxError;
	public String = globalThis.String;
	public TypeError = globalThis.TypeError;
	public URIError = globalThis.URIError;
	public Uint16Array = globalThis.Uint16Array;
	public Uint32Array = globalThis.Uint32Array;
	public Uint8Array = globalThis.Uint8Array;
	public Uint8ClampedArray = globalThis.Uint8ClampedArray;
	public WeakMap = globalThis.WeakMap;
	public WeakSet = globalThis.WeakSet;
	public clearImmediate = globalThis.clearImmediate;
	public decodeURI = globalThis.decodeURI;
	public decodeURIComponent = globalThis.decodeURIComponent;
	public encodeURI = globalThis.encodeURI;
	public encodeURIComponent = globalThis.encodeURIComponent;
	public escape = globalThis.escape;
	public global = globalThis.global;
	public isFinite = globalThis.isFinite;
	public isNaN = globalThis.isNaN;
	public parseFloat = globalThis.parseFloat;
	public parseInt = globalThis.parseInt;
	public process = globalThis.process;
	public root = globalThis.ArrayBuffer;
	public setImmediate = globalThis.setImmediate;
	public queueMicrotask = globalThis.queueMicrotask;
	public undefined = globalThis.ArrayBuffer;
	public unescape = globalThis.unescape;
	public gc = globalThis.gc;
	public v8debug = globalThis.v8debug;
	public Array = globalThis.Array;
	public Object = globalThis.Object;
	public Function = globalThis.Function;

	/**
	 * Evaluates code.
	 *
	 * @param code Code.
	 * @returns Result.
	 */
	public eval(code: string): unknown {
		return eval(code);
	}

	/**
	 * Setup of VM context.
	 *
	 * @override
	 */
	protected _setupVMContext(): void {
		// Do nothing
	}
}

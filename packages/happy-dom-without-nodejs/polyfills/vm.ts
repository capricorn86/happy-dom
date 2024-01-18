type Context = object;

/**
 *
 */
class Script {
	private code: string;

	/**
	 *
	 * @param code
	 */
	constructor(code: string) {
		this.code = code;
	}
	/**
	 *
	 * @param context
	 */
	public runInContext(context: Context): void {
		const evaluate = (code: string): void => {
			eval(code);
		};
		evaluate.call(context, this.code);
	}
}
const contextSymbol = Symbol('context');
const isContext = (context: Context): boolean => {
	return context[contextSymbol] === true;
};
const createContext = (context: Context): Context => {
	context[contextSymbol] = true;
	return context;
};
export { Script, isContext, createContext };

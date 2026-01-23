import IModuleInit from './IModuleInit.js';

/**
 * ECMAScript module initialization options.
 */
export default interface IECMAScriptModuleInit extends IModuleInit {
	sourceURL?: string | null;
}

import type ModuleFactory from '../ModuleFactory.js';
import type IModuleInit from './IModuleInit.js';

/**
 * ECMAScript module initialization options.
 */
export default interface IECMAScriptModuleInit extends IModuleInit {
	factory: ModuleFactory;
	sourceURL?: string | null;
}

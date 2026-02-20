import type IECMAScriptModuleImport from './IECMAScriptModuleImport.js';

/**
 * ECMAScript module cached compilation result.
 */
export default interface IECMAScriptModuleCachedResult {
	imports: IECMAScriptModuleImport[];
	code: string;
}

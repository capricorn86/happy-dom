import IModuleImportMapRule from './IModuleImportMapRule.js';
import IModuleImportMapScope from './IModuleImportMapScope.js';

/**
 * @see https://html.spec.whatwg.org/multipage/webappapis.html#import-map
 */
export default interface IModuleImportMap {
	imports: IModuleImportMapRule[];
	scopes: IModuleImportMapScope[];
}

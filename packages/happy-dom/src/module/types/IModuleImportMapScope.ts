import IModuleImportMapRule from './IModuleImportMapRule.js';

export default interface IModuleImportMapScope {
	scope: string;
	rules: IModuleImportMapRule[];
}

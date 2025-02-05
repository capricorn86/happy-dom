import IECMAScriptModuleImport from './IECMAScriptModuleImport.js';

export default interface IECMAScriptModuleCompiledResult {
	imports: IECMAScriptModuleImport[];
	execute: (options: {
		dispatchError: (error: Error) => void;
		dynamicImport: (
			url: string,
			options?: { with?: { type?: string } }
		) => Promise<{ [key: string]: any }>;
		imports: Map<string, { [key: string]: any }>;
		exports: { [key: string]: any };
	}) => void;
}

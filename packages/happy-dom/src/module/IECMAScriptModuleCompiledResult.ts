import IECMAScriptModuleImport from './IECMAScriptModuleImport.js';

export default interface IECMAScriptModuleCompiledResult {
	imports: IECMAScriptModuleImport[];
	execute: (options: {
		dispatchError: (error: Error) => void;
		dynamicImport: (
			url: string,
			options?: { with?: { type?: string } }
		) => Promise<{ [key: string]: any }>;
		importMeta: {
			url: string;
			resolve: (url: string) => string;
		};
		imports: Map<string, { [key: string]: any }>;
		exports: { [key: string]: any };
	}) => Promise<void>;
}

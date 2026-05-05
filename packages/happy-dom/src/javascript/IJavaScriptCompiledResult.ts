export default interface IJavaScriptCompiledResult {
	execute: (options: {
		dispatchError: (error: Error) => void;
		dynamicImport: (
			url: string,
			options?: { with?: { type?: string } }
		) => Promise<{ [key: string]: any }>;
	}) => void;
}

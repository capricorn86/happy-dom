declare let mockedModules: {
	modules: {
		fs: {
			promises: {
				readFile: {
					parameters: {
						path: string;
					};
					returnValue: {
						data: Buffer;
					};
				};
			};
			readFileSync: {
				parameters: {
					path: string;
				};
				returnValue: {
					data: Buffer;
				};
			};
		};
		child_process: {
			execFileSync: {
				parameters: {
					command: string;
					args: string[];
					options: { encoding: string; maxBuffer: Buffer };
				};
				returnValue: {
					data: {
						statusCode: number;
						statusMessage: string;
						headers: { [k: string]: string };
						text: string;
						data: string;
					};
					error: string;
				};
			};
		};
		http: {
			request: {
				parameters: {
					uri: string | null;
					options: object | null;
					callback: function | null;
				};
				internal: {
					body: string | null;
					destroyed: boolean;
					timeout: number | null;
				};
				returnValue: {
					response: {
						headers: { [k: string]: string } | null;
						rawHeaders: string[] | null;
						statusCode: number | null;
						statusMessage: string | null;
						body: string | null;
						error: Error | null;
					};
					request: {
						error: Error | null;
					};
				};
			};
		};
		stream: {
			pipeline: {
				parameters: {
					source: object | null;
					destination: object | null;
					callback: (error: Error | null) => void;
				};
				returnValue: {
					error: Error | null;
				};
			};
		};
	};
	reset: () => void;
};

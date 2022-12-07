declare let mockedModules: {
	modules: {
		'node-fetch': {
			parameters: {
				url: string;
				init: {
					headers: { [k: string]: string };
				};
			};
			returnValue: {
				error: Error;
				response: {
					arrayBuffer: Buffer;
					blob: object;
					buffer: Buffer;
					json: object;
					text: string;
					textConverted: string;
				};
			};
		};
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
					options: object;
				};
				internal: {
					body: string;
					destroyed: boolean;
				};
				returnValue: {
					response: {
						headers: { [k: string]: string };
						statusCode: number;
						statusMessage: string;
						body: string;
						error: Error;
					};
					request: {
						error: Error;
					};
				};
			};
		};
	};
	reset: () => void;
};

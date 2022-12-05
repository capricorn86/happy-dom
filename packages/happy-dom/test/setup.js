/* eslint-disable camelcase */

const modules = {
	'node-fetch': {
		parameters: {
			url: null,
			init: null
		},
		returnValue: {
			error: null,
			response: {
				arrayBuffer: 'nodeFetch.arrayBuffer',
				blob: 'nodeFetch.blob',
				buffer: 'nodeFetch.buffer',
				json: 'nodeFetch.json',
				text: 'nodeFetch.text',
				textConverted: 'nodeFetch.textConverted'
			}
		}
	},
	fs: {
		promises: {
			readFile: {
				parameters: {
					path: null
				},
				returnValue: {
					data: 'fs.promises.readFile'
				}
			}
		},
		readFileSync: {
			parameters: {
				path: null
			},
			returnValue: {
				data: 'fs.readFileSync'
			}
		}
	},
	child_process: {
		execFileSync: {
			parameters: {
				command: null,
				args: null,
				options: null
			},
			returnValue: {
				data: {
					statusCode: 200,
					statusMessage: 'child_process.execFileSync.returnValue.data.statusMessage',
					headers: { key1: 'value1', key2: 'value2' },
					text: 'child_process.execFileSync.returnValue.data.text',
					data: Buffer.from('child_process.execFileSync.returnValue.data.text').toString('base64')
				},
				error: null
			}
		}
	},
	http: {
		request: {
			parameters: {
				options: null
			},
			internal: {
				body: null
			},
			returnValue: {
				response: {
					headers: { key1: 'value1', key2: 'value2' },
					statusCode: 200,
					statusMessage: 'http.request.statusMessage',
					body: 'http.request.body',
					error: null
				},
				request: {
					error: null
				}
			}
		}
	}
};

global.mockedModules = {
	modules: JSON.parse(JSON.stringify(modules)),
	reset: () => {
		global.mockedModules.modules = JSON.parse(JSON.stringify(modules));
	}
};

/* eslint-disable jsdoc/require-jsdoc */
class NodeFetchResponse {
	arrayBuffer() {
		return Promise.resolve(
			global.mockedModules.modules['node-fetch'].returnValue.response.arrayBuffer
		);
	}
	blob() {
		return Promise.resolve(global.mockedModules.modules['node-fetch'].returnValue.response.blob);
	}
	buffer() {
		return Promise.resolve(global.mockedModules.modules['node-fetch'].returnValue.response.buffer);
	}
	json() {
		return Promise.resolve(global.mockedModules.modules['node-fetch'].returnValue.response.json);
	}
	text() {
		return Promise.resolve(global.mockedModules.modules['node-fetch'].returnValue.response.text);
	}
	textConverted() {
		return Promise.resolve(
			global.mockedModules.modules['node-fetch'].returnValue.response.textConverted
		);
	}
}

class NodeFetchRequest extends NodeFetchResponse {}
class NodeFetchHeaders {}

jest.mock('node-fetch', () => {
	return Object.assign(
		(url, options) => {
			global.mockedModules.modules['node-fetch'].parameters.url = url;
			global.mockedModules.modules['node-fetch'].parameters.init = options;
			if (global.mockedModules.modules['node-fetch'].error) {
				return Promise.reject(global.mockedModules.modules['node-fetch'].returnValue.error);
			}
			return Promise.resolve(new NodeFetchResponse());
		},
		{
			Response: NodeFetchResponse,
			Request: NodeFetchRequest,
			Headers: NodeFetchHeaders
		}
	);
});

jest.mock('fs', () => ({
	promises: {
		readFile: (path) => {
			global.mockedModules.modules.fs.promises.readFile.parameters.path = path;
			return Promise.resolve(global.mockedModules.modules.fs.promises.readFile.returnValue.data);
		}
	},
	readFileSync: (path) => {
		global.mockedModules.modules.fs.readFileSync.parameters.path = path;
		return global.mockedModules.modules.fs.readFileSync.returnValue.data;
	}
}));

jest.mock('child_process', () => ({
	execFileSync: (command, args, options) => {
		global.mockedModules.modules.child_process.execFileSync.parameters = {
			command,
			args,
			options
		};
		return JSON.stringify(global.mockedModules.modules.child_process.execFileSync.returnValue);
	}
}));

class IncomingMessage {
	constructor() {
		this.headers = {};
		this.statusCode = null;
		this.statusMessage = null;
		this._eventListeners = {
			data: [],
			end: [],
			error: []
		};
	}

	on(event, callback) {
		this._eventListeners[event].push(callback);
	}
}

const httpMock = () => {
	return {
		request: (options, callback) => {
			let errorCallback = null;
			global.mockedModules.modules.http.request.parameters = {
				options
			};
			const request = {
				write: (chunk) => (global.mockedModules.modules.http.request.internal.body += chunk),
				end: () => {
					setTimeout(() => {
						if (global.mockedModules.modules.http.request.returnValue.request.error) {
							if (errorCallback) {
								errorCallback(global.mockedModules.modules.http.request.returnValue.request.error);
							}
						} else {
							const response = new IncomingMessage();

							response.headers =
								global.mockedModules.modules.http.request.returnValue.response.headers;
							response.statusCode =
								global.mockedModules.modules.http.request.returnValue.response.statusCode;
							response.statusMessage =
								global.mockedModules.modules.http.request.returnValue.response.statusMessage;

							callback(response);

							if (global.mockedModules.modules.http.request.returnValue.error) {
								for (const listener of response._eventListeners.error) {
									listener(global.mockedModules.modules.http.request.returnValue.error);
								}
							} else {
								for (const listener of response._eventListeners.data) {
									listener(global.mockedModules.modules.http.request.returnValue.response.body);
								}
								for (const listener of response._eventListeners.end) {
									listener();
								}
							}
						}
					});
				},
				on: (event, callback) => {
					if (event === 'error') {
						errorCallback = callback;
					}
					return request;
				}
			};
			return request;
		},
		STATUS_CODES: {
			200: 'OK',
			400: 'Bad Request',
			401: 'Unauthorized',
			403: 'Forbidden',
			404: 'Not Found',
			500: 'Internal Server Error',
			502: 'Bad Gateway',
			503: 'Service Unavailable'
		}
	};
};

jest.mock('http', httpMock);
jest.mock('https', httpMock);

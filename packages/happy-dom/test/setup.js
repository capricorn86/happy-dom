/* eslint-disable camelcase */

global.mockedModules = {
	'node-fetch': {
		parameters: {
			url: null,
			init: null
		},
		returnValue: {
			error: null,
			response: {
				arrayBuffer: null,
				blob: null,
				buffer: null,
				json: null,
				text: null,
				textConverted: null
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
					data: null
				}
			}
		},
		readFileSync: {
			parameters: {
				path: null
			},
			returnValue: {
				data: null
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
				data: null
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
					headers: null,
					statusCode: null,
					statusMessage: null,
					body: null,
					error: null
				},
				request: {
					error: null
				}
			}
		}
	}
};

const initialMockedModules = JSON.parse(JSON.stringify(global.mockedModules));

global.resetMockedModules = () => {
	global.mockedModules = JSON.parse(JSON.stringify(initialMockedModules));
};

jest.mock('sync-request', () => (method, url) => {
	global.mockedModules['sync-request'].parameters = {
		method,
		url
	};
	return {
		getBody: () => global.mockedModules['sync-request'].returnValue.body,
		isError: () => global.mockedModules['sync-request'].returnValue.statusCode !== 200,
		statusCode: global.mockedModules['sync-request'].returnValue.statusCode
	};
});

/* eslint-disable jsdoc/require-jsdoc */
class NodeFetchResponse {
	arrayBuffer() {
		return Promise.resolve(global.mockedModules['node-fetch'].returnValue.response.arrayBuffer);
	}
	blob() {
		return Promise.resolve(global.mockedModules['node-fetch'].returnValue.response.blob);
	}
	buffer() {
		return Promise.resolve(global.mockedModules['node-fetch'].rreturnValue.esponse.buffer);
	}
	json() {
		return Promise.resolve(global.mockedModules['node-fetch'].returnValue.response.json);
	}
	text() {
		return Promise.resolve(global.mockedModules['node-fetch'].returnValue.response.text);
	}
	textConverted() {
		return Promise.resolve(global.mockedModules['node-fetch'].returnValue.response.textConverted);
	}
}

class NodeFetchRequest extends NodeFetchResponse {}
class NodeFetchHeaders {}

jest.mock('node-fetch', () => {
	return Object.assign(
		(url, options) => {
			global.mockedModules['node-fetch'].parameters.url = url;
			global.mockedModules['node-fetch'].parameters.init = options;
			if (global.mockedModules['node-fetch'].error) {
				return Promise.reject(global.mockedModules['node-fetch'].returnValue.error);
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

jest.mock('fs', {
	promises: {
		readFile: (path) => {
			global.mockedModules.fs.promises.readFile.parameters.path = path;
			return Promise.resolve(global.mockedModules.fs.promises.readFile.returnValue.data);
		}
	},
	readFileSync: (path) => {
		global.mockedModules.fs.readFileSync.parameters.path = path;
		return global.mockedModules.fs.readFileSync.returnValue.data;
	}
});

jest.mock('child_process', {
	execFileSync: (command, args, options) => {
		global.mockedModules.child_process.parameters = {
			command,
			args,
			options
		};
		return global.mockedModules.child_process.returnValue.data;
	}
});

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

const httpMock = {
	request: (options, callback) => {
		let errorCallback = null;
		global.mockedModules.http.request.parameters = {
			options
		};
		return {
			write: (chunk) => (global.mockedModules.http.request.internal.body += chunk),
			end: () => {
				if (global.mockedModules.http.request.returnValue.request.error) {
					if (errorCallback) {
						errorCallback(global.mockedModules.http.request.returnValue.request.error);
					}
				} else {
					const response = new IncomingMessage();

					response.headers = global.mockedModules.http.request.returnValue.response.headers;
					response.statusCode = global.mockedModules.http.request.returnValue.response.statusCode;
					response.statusMessage =
						global.mockedModules.http.request.returnValue.response.statusMessage;
					callback(response);

					if (global.mockedModules.http.request.returnValue.error) {
						for (const listener of response._eventListeners.error) {
							listener(global.mockedModules.http.request.returnValue.error);
						}
					} else {
						for (const listener of response._eventListeners.data) {
							listener(global.mockedModules.http.request.returnValue.response.body);
						}
						for (const listener of response._eventListeners.end) {
							listener();
						}
					}
				}
			},
			on: (event, callback) => {
				if (event === 'error') {
					errorCallback = callback;
				}
			}
		};
	}
};

jest.mock('http', httpMock);
jest.mock('https', httpMock);

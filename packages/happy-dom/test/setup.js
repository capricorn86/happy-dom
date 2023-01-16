/* eslint-disable camelcase */

const modules = {
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
					headers: { key1: 'value1', key2: 'value2', 'content-length': '48' },
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
				uri: null,
				options: null,
				callback: null
			},
			internal: {
				body: '',
				destroyed: false,
				timeout: null
			},
			returnValue: {
				response: {
					headers: { key1: 'value1', key2: 'value2', 'content-length': '17' },
					rawHeaders: ['key1', 'value1', 'key2', 'value2', 'content-length', '17'],
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
	},
	stream: {
		pipeline: {
			parameters: {
				source: null,
				destination: null,
				callback: null
			},
			returnValue: {
				error: null
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

/**
 *
 */
class IncomingMessage {
	headers = {};
	rawHeaders = [];
	statusCode = null;
	statusMessage = null;
	_eventListeners = {
		data: [],
		end: [],
		error: []
	};
	_onceEventListeners = {
		end: []
	};

	/**
	 *
	 * @param event
	 * @param callback
	 */
	on(event, callback) {
		this._eventListeners[event].push(callback);
	}

	/**
	 *
	 * @param event
	 * @param callback
	 */
	once(event, callback) {
		this._onceEventListeners[event].push(callback);
	}
}

const httpMock = () => {
	return {
		request: (a, b, c) => {
			let eventListeners = {};
			let timeout = null;
			let uri = null;
			let options = null;
			let callback = null;

			for (const arg of [a, b, c]) {
				if (typeof arg === 'function') {
					callback = arg;
				} else if (typeof arg === 'string') {
					uri = arg;
				} else if (typeof arg === 'object') {
					options = arg;
				}
			}

			global.mockedModules.modules.http.request.parameters = {
				uri,
				options,
				callback
			};
			const request = {
				write: (chunk) => (global.mockedModules.modules.http.request.internal.body += chunk),
				end: () => {
					timeout = setTimeout(() => {
						if (global.mockedModules.modules.http.request.returnValue.request.error) {
							if (eventListeners.error) {
								eventListeners.error(
									global.mockedModules.modules.http.request.returnValue.request.error
								);
							}
						} else {
							const response = new IncomingMessage();

							response.headers =
								global.mockedModules.modules.http.request.returnValue.response.headers;
							response.rawHeaders =
								global.mockedModules.modules.http.request.returnValue.response.rawHeaders;
							response.statusCode =
								global.mockedModules.modules.http.request.returnValue.response.statusCode;
							response.statusMessage =
								global.mockedModules.modules.http.request.returnValue.response.statusMessage;

							if (callback) {
								callback(response);
							}

							if (eventListeners.response) {
								eventListeners.response(response);
							}

							if (response._eventListeners.error) {
								if (global.mockedModules.modules.http.request.returnValue.response.error) {
									for (const listener of response._eventListeners.error) {
										listener(global.mockedModules.modules.http.request.returnValue.response.error);
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
						}
					});
				},
				setTimeout: (time) => (global.mockedModules.modules.http.request.internal.timeout = time),
				on: (event, callback) => {
					eventListeners[event] = callback;
					return request;
				},
				destroy: () => {
					eventListeners = {};
					clearTimeout(timeout);
					global.mockedModules.modules.http.request.internal.destroyed = true;
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

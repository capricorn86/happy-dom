global.mockedModules = {
	'sync-request': {
		statusCode: null,
		body: null,
		options: null
	},
	'node-fetch': {
		url: {
			url: Symbol('url')
		},
		init: null,
		error: null,
		response: {
			arrayBuffer: Symbol('arrayBuffer'),
			blob: Symbol('blob'),
			buffer: Symbol('buffer'),
			json: Symbol('json'),
			text: Symbol('text'),
			textConverted: Symbol('textConverted')
		}
	}
};

jest.mock('sync-request', () => (method, url) => {
	global.mockedModules['sync-request'].options = {
		method,
		url
	};
	return {
		getBody: () => global.mockedModules['sync-request'].body,
		isError: () => global.mockedModules['sync-request'].statusCode !== 200,
		statusCode: global.mockedModules['sync-request'].statusCode
	};
});

/* eslint-disable jsdoc/require-jsdoc */
class NodeFetchResponse {
	arrayBuffer() {
		return Promise.resolve(global.mockedModules['node-fetch'].response.arrayBuffer);
	}
	blob() {
		return Promise.resolve(global.mockedModules['node-fetch'].response.blob);
	}
	buffer() {
		return Promise.resolve(global.mockedModules['node-fetch'].response.buffer);
	}
	json() {
		return Promise.resolve(global.mockedModules['node-fetch'].response.json);
	}
	text() {
		return Promise.resolve(global.mockedModules['node-fetch'].response.text);
	}
	textConverted() {
		return Promise.resolve(global.mockedModules['node-fetch'].response.textConverted);
	}
}

class NodeFetchRequest extends NodeFetchResponse {
	constructor(url) {
		super();
		this.url = url;
	}
}
class NodeFetchHeaders {}

jest.mock('node-fetch', () => {
	return Object.assign(
		(url, options) => {
			global.mockedModules['node-fetch'].url = url;
			global.mockedModules['node-fetch'].init = options;
			if (global.mockedModules['node-fetch'].error) {
				return Promise.reject(global.mockedModules['node-fetch'].error);
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

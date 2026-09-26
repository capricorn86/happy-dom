/* eslint-disable jsdoc/require-jsdoc, filenames/match-exported */
export default class WebSocketMock {
	public internalInit: {
		url: string;
		protocols?: string | string[];
		options?: { headers?: Record<string, string>; rejectUnauthorized?: boolean };
	};
	public internalListeners: Record<string, Function[]> = {};
	public internalState: 'open' | 'closed' | 'terminated' = 'open';
	public internalMessagesSent: Array<{ data: any; options?: { binary?: boolean } }> = [];
	public extensions: Record<string, string> = { extension1: 'value1', extensions2: 'value2' };
	public protocol: string = 'protocol1';

	constructor(
		url: string,
		protocols?: string | string[],
		options?: { headers?: Record<string, string>; rejectUnauthorized?: boolean }
	) {
		this.internalInit = { url, protocols, options };
	}

	public on(event: string, listener: Function): void {
		if (!this.internalListeners[event]) {
			this.internalListeners[event] = [];
		}
		this.internalListeners[event].push(listener);
	}

	public once(event: string, listener: Function): void {
		const onceListener = (...args: any[]): void => {
			listener(...args);
			this.off(event, onceListener);
		};
		this.on(event, onceListener);
	}

	public off(event: string, listener: Function): void {
		const index = this.internalListeners[event]?.indexOf(listener);
		if (index === undefined || index === -1) {
			return;
		}
		this.internalListeners[event].splice(index, 1);
	}

	public close(code?: number, reason?: string): void {
		this.internalState = 'closed';
		this.internalListeners.close?.forEach((listener) =>
			listener(code ?? 3000, reason ?? 'close() called')
		);
	}

	public terminate(): void {
		this.internalState = 'terminated';
		this.internalListeners.close?.forEach((listener) => listener(4000, 'terminate() called'));
	}

	public send(data: any, options?: { binary?: boolean }): void {
		this.internalMessagesSent.push({ data, options });
	}
}

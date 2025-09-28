import IServerRendererConfiguration from '../src/types/IServerRendererConfiguration';
import IServerRendererItem from '../src/types/IServerRendererItem';
import IServerRendererResult from '../src/types/IServerRendererResult';

/**
 *
 */
export default class MockedWorker {
	public static openWorkers: MockedWorker[] = [];
	public static terminatedWorkers: MockedWorker[] = [];
	public scriptPath: string;
	public workerData: {
		configuration: IServerRendererConfiguration;
	};
	public listeners: {
		message: Array<(data: { results: IServerRendererResult[] }) => void>;
		error: Array<(error: Error) => void>;
		exit: Array<(code: number) => void>;
	} = {
		message: [],
		error: [],
		exit: []
	};
	public postedData: Array<{ items: IServerRendererItem[]; isCacheWarmup: boolean }> = [];
	public isTerminated: boolean = false;

	/**
	 *
	 * @param scriptPath
	 * @param options
	 * @param options.workerData
	 */
	constructor(scriptPath: string, options: { workerData: any }) {
		this.scriptPath = scriptPath;
		this.workerData = options.workerData;
		(<typeof MockedWorker>this.constructor).openWorkers.push(this);
	}

	/**
	 *
	 * @param event
	 * @param listener
	 */
	public on(event: string, listener: any): void {
		this.listeners[event].push(listener);
	}

	/**
	 *
	 * @param event
	 * @param listener
	 */
	public off(event: string, listener: any): void {
		const index = this.listeners[event].indexOf(listener);
		this.listeners[event].splice(index, 1);
	}

	/**
	 *
	 * @param data
	 */
	public postMessage(data: any): void {
		this.postedData.push(data);
	}

	/**
	 *
	 */
	public terminate(): void {
		this.isTerminated = true;
		(<typeof MockedWorker>this.constructor).terminatedWorkers.push(this);
		const index = (<typeof MockedWorker>this.constructor).openWorkers.indexOf(this);
		(<typeof MockedWorker>this.constructor).openWorkers.splice(index, 1);
	}
}

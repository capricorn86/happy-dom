import IServerRendererConfiguration from '../src/types/IServerRendererConfiguration';
import IServerRendererItem from '../src/types/IServerRendererItem';
import IServerRendererResult from '../src/types/IServerRendererResult';

type TEvent = 'message' | 'error' | 'exit';

/**
 * Mocked worker.
 */
export default class MockedWorker {
	public static runningWorkers: MockedWorker[] = [];
	public static terminatedWorkers: MockedWorker[] = [];
	public scriptPath: string;
	public execArgv: string[] = [];
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
	 * Constructor.
	 *
	 * @param scriptPath Script path.
	 * @param options Options.
	 * @param options.execArgv Exec arguments.
	 * @param options.workerData Worker data.
	 */
	constructor(scriptPath: string, options: { execArgv: string[]; workerData: any }) {
		this.scriptPath = scriptPath;
		this.execArgv = options.execArgv;
		this.workerData = options.workerData;
		(<typeof MockedWorker>this.constructor).runningWorkers.push(this);
	}

	/**
	 *
	 * @param event
	 * @param listener
	 */
	public on(event: TEvent, listener: any): void {
		this.listeners[event].push(listener);
	}

	/**
	 *
	 * @param event
	 * @param listener
	 */
	public off(event: TEvent, listener: any): void {
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
		const index = (<typeof MockedWorker>this.constructor).runningWorkers.indexOf(this);
		(<typeof MockedWorker>this.constructor).runningWorkers.splice(index, 1);
	}
}

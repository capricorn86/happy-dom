import ServerRendererBrowser from './ServerRendererBrowser.js';
import { parentPort, workerData } from 'worker_threads';

/**
 * Server-side rendering worker.
 */
export default class ServerRendererWorker {
	/**
	 * Connects to the worker.
	 */
	public static async connect(): Promise<void> {
        const { options } = workerData;

        parentPort.on('message', async (event) => {
            const { items, isCacheWarmup } = event.value;
            const browser = new ServerRendererBrowser(options);
            await browser.render(items, isCacheWarmup);
            parentPort.postMessage({ status: 'done' });
        });
	}
}

ServerRendererWorker.connect();
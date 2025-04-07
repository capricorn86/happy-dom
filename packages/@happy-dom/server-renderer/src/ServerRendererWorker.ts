import ServerRendererBrowser from './ServerRendererBrowser.js';
import { parentPort, workerData } from 'worker_threads';
import Inspector from 'node:inspector'

/**
 * Server renderer worker.
 */
export default class ServerRendererWorker {
	/**
	 * Connects to the worker.
	 */
	public static async connect(): Promise<void> {
        const { configuration } = workerData;

        if(configuration.inspect) {
            Inspector.open();
            Inspector.waitForDebugger();
        }
        
        const browser = new ServerRendererBrowser(configuration);

        parentPort.on('message', async ({ items, isCacheWarmup }) => {
            const results = await browser.render(items, isCacheWarmup);
            parentPort.postMessage({ status: 'done', results });
        });
	}
}

ServerRendererWorker.connect();
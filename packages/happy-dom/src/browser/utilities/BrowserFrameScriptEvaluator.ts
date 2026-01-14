import CSSModule from '../../module/CSSModule.js';
import ECMAScriptModule from '../../module/ECMAScriptModule.js';
import JSONModule from '../../module/JSONModule.js';
import ModuleFactory from '../../module/ModuleFactory.js';
import IBrowserFrame from '../types/IBrowserFrame.js';
import { Script } from 'vm';

/**
 * Browser frame script evaluator.
 */
export default class BrowserFrameScriptEvaluator {
	/**
	 * Evaluates code or a VM Script in the frame's context.
	 *
	 * @param frame Frame.
	 * @param script Script.
	 * @returns Result.
	 */
	public static evaluate(frame: IBrowserFrame, script: string | Script): any {
		if (!frame.window) {
			throw new Error('The frame has been destroyed, the "window" property is not set.');
		}
		script = typeof script === 'string' ? new Script(script) : script;
		return script.runInContext(frame.window);
	}

	/**
	 * Evaluates a module in the frame's context.
	 *
	 * @param frame Frame.
	 * @param options Options.
	 * @param options.url URL.
	 * @param options.type Module type.
	 * @param options.code Code.
	 * @returns Exports.
	 */
	public static async evaluateModule(
		frame: IBrowserFrame,
		options: { url?: string; type?: 'esm' | 'css' | 'json'; code?: string }
	): Promise<Record<string, any>> {
		if (!frame.window) {
			throw new Error('The frame has been destroyed, the "window" property is not set.');
		}

		const window = frame.window;

		if (options?.code) {
			const url = options.url ? new URL(options.url, window.location.href) : window.location;
			const source = options.code;

			switch (options?.type || 'esm') {
				case 'esm':
					return await new ECMAScriptModule({ window, url, source }).evaluate();
				case 'json':
					return await new JSONModule({ window, url, source }).evaluate();
				case 'css':
					return await new CSSModule({ window, url, source }).evaluate();
			}
		}

		if (options?.url) {
			const module = await new ModuleFactory(window, window.location).getModule(options.url, {
				with: { type: options.type || 'esm' }
			});
			return await module.evaluate();
		}

		return {};
	}
}

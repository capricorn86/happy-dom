#!/bin/env node
'use strict';

import ServerRenderer from '../../lib/ServerRenderer.js';
import ProcessArgumentsParser from '../../lib/utilities/ProcessArgumentsParser.js';
import ChildProcess from 'child_process';

const IS_CODE_GENERATION_FROM_STRINGS_ENVIRONMENT = (() => {
	try {
		// eslint-disable-next-line no-new-func
		new Function('return true;')();
		return true;
	} catch {
		return false;
	}
})();

const IS_UNFROZEN_INTRINSICS_ENVIRONMENT = (() => {
	try {
		(<any>globalThis.Function)['$UNFROZEN$'] = true;
		delete (<any>globalThis.Function)['$UNFROZEN$'];
		return true;
	} catch {
		return false;
	}
})();

main();

/**
 * Main method.
 */
async function main(): Promise<void> {
	if (IS_CODE_GENERATION_FROM_STRINGS_ENVIRONMENT || IS_UNFROZEN_INTRINSICS_ENVIRONMENT) {
		ChildProcess.execSync(
			'NODE_OPTIONS="--disallow-code-generation-from-strings --frozen-intrinsics" ' +
				process.argv.join(' '),
			{
				stdio: 'inherit'
			}
		);
		return;
	}
	const configuration = await ProcessArgumentsParser.getConfiguration(process.argv);

	if (configuration.help) {
		const HelpPrinter = (await import('../../lib/utilities/HelpPrinter.js')).default;
		HelpPrinter.print();
		process.exit(0);
	}

	if (configuration.server.start) {
		const server = new (await import('../../lib/ServerRendererServer.js')).default(configuration);

		await server.start();
	} else {
		const renderer = new ServerRenderer(configuration);

		await renderer.render();
	}
}

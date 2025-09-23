#!/bin/env node
'use strict';

import ServerRenderer from '../../lib/ServerRenderer.js';
import ProcessArgumentsParser from '../../lib/utilities/ProcessArgumentsParser.js';

main();

/**
 * Main method.
 */
async function main(): Promise<void> {
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

#!/bin/env node
"use strict";

const GitUtility = require("../build/GitUtility");

/* eslint-disable no-console*/

process.on("unhandledRejection", (error) => {
	console.error(error);
	process.exit(1);
});

async function main() {
	const nextVersion = await GitUtility.getNextVersion();
	process.stdout.write(nextVersion);
}

main();

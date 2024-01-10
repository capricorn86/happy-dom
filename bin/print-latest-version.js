#!/bin/env node
"use strict";

const GitUtility = require("../build/GitUtility");

/* eslint-disable no-console*/

process.on("unhandledRejection", (error) => {
	console.error(error);
	process.exit(1);
});

async function main() {
	const latestVersion = await GitUtility.getLatestVersion();
	process.stdout.write(latestVersion);
}

main();

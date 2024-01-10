#!/bin/env node
"use strict";

const Fs = require("fs");
const Path = require("path");
const Chalk = require("chalk");
const GitUtility = require("../build/GitUtility");

/* eslint-disable no-console*/

process.on("unhandledRejection", (error) => {
	console.error(error);
	process.exit(1);
});

async function main() {
	const argument = process.argv.find((text) => text.startsWith("--filepath="));
	const filepath = argument
		? argument
				.split(/=/)[1]
				.replace("%HUSKY_GIT_PARAMS%", "")
				.replace("$HUSKY_GIT_PARAMS", "")
		: null;

	if (!filepath) {
		throw new Error(
			'Failed to validate commit message. The argument "--filepath=" was not provided.'
		);
	}

	const commitBuffer = await Fs.promises.readFile(Path.resolve(filepath));
	const commitMessage = GitUtility.parseCommitMessage(commitBuffer.toString());

	if (commitMessage.errors.length > 0) {
		console.error(Chalk.red("\nCommit message validation failed:"));

		for (const error of commitMessage.errors) {
			console.error(Chalk.red(`   ✖ ${error}`));
		}

		console.log("");

		process.exit(1);
	}
}

main();

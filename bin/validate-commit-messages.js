#!/bin/env node
"use strict";

const GitUtility = require("../build/GitUtility");
const Chalk = require("chalk");

/* eslint-disable no-console*/

process.on("unhandledRejection", (error) => {
	console.error(error);
	process.exit(1);
});

async function main() {
	const commitMessages = await GitUtility.getCommitMessages(
		"origin/master",
		"HEAD"
	);
	let hasErrors = false;

	for (const commitMessage of commitMessages) {
		const parsed = GitUtility.parseCommitMessage(commitMessage);

		if (!parsed.errors.length) {
			console.log(Chalk.green("✓ " + commitMessage));
		} else {
			console.log(Chalk.red("✖" + commitMessage));
			for (const error of parsed.errors) {
				console.log(Chalk.red(`    - ${error}`));
			}
			hasErrors = true;
		}
	}

	if (hasErrors) {
		console.error("Commit validation failed.");
		process.exit(1);
	}
}

main();

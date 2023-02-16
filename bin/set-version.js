#!/bin/env node
"use strict";

const FS = require("fs");
const Path = require("path");

process.on("unhandledRejection", (error) => {
	console.error(error);
	process.exit(1);
});

async function main() {
	const version = process.argv
		.find((text) => text.startsWith("--version="))
		.replace("--version=", "");
	const packagesDirectory = Path.resolve("./packages");
	const directories = await FS.promises.readdir(packagesDirectory);
	const writePromises = [];

	for (const directory of directories) {
		const packageJSONFilepath = Path.join(
			packagesDirectory,
			directory,
			"package.json"
		);
		let packageJSON;

		try {
			packageJSON = require(packageJSONFilepath);
		} catch (error) {
			// Ignore error
		}

		if (packageJSON) {
			packageJSON.version = version;

			for (const dependencyType of ["dependencies", "devDependencies"]) {
				for (const dependency of Object.keys(
					packageJSON[dependencyType] || {}
				)) {
					if (packageJSON[dependencyType][dependency].includes("0.0.0")) {
						packageJSON[dependencyType][dependency] = packageJSON[
							dependencyType
						][dependency].replace("0.0.0", version);
					}
				}
			}

			writePromises.push(
				FS.promises.writeFile(
					packageJSONFilepath,
					JSON.stringify(packageJSON, null, 4)
				)
			);
		}
	}

	await Promise.all(writePromises);
}

main();

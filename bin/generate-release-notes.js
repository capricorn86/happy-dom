#!/bin/env node
'use strict';

const GitUtility = require('../build/GitUtility');
const FS = require('fs');
const Path = require('path');

process.on('unhandledRejection', error => {
	console.error(error);
	process.exit(1);
});

async function main() {
	const nextVersion = process.argv.find(text => text.startsWith('--next-version=')).split('=').reverse()[0];
	const latestVersion = process.argv.find(text => text.startsWith('--latest-version=')).split('=').reverse()[0];

	const commitMessages = await GitUtility.getCommitMessages('v' + latestVersion, 'v' + nextVersion);
	const commits = { trivial: [], patch: [], minor: [], major: [] };
	
	for (const commitMessage of commitMessages) {
		const parsed = GitUtility.parseCommitMessage(commitMessage);
	
		if (!parsed.errors.length) {
			commits[parsed.commit.versionType].push(parsed.commit);
		}
	}
	
	let output = [];
	
	if(commits.major.length > 0) {
		let notes = '### :bomb: Breaking Changes\n\n'
		for(const commit of commits.major) {
			notes += ` - ${commit.description} (${commit.taskId})\n`;
		}
		output.push(notes);
	}
	
	if(commits.minor.length > 0) {
		let notes = '### :art: Features\n\n'
		for(const commit of commits.minor) {
			notes += ` - ${commit.description} (${commit.taskId})\n`;
		}
		output.push(notes);
	}
	
	if(commits.patch.length > 0) {
		let notes = '### :construction_worker_man: Patch fixes\n\n';
		for(const commit of commits.patch) {
			notes += ` - ${commit.description} (${commit.taskId})\n`;
		}
		output.push(notes);
	}
	
	await FS.promises.writeFile(Path.resolve('RELEASE_NOTES.md'), output.join('\n\n'));
}

main();
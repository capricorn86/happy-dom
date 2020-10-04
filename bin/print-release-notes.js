#!/bin/env node
'use strict';

const GitUtility = require('../build/GitUtility');

process.on('unhandledRejection', error => {
	console.error(error);
	process.exit(1);
});

async function main() {
	const latestVersion = await GitUtility.getLatestVersion();
	const commitMessages = await GitUtility.getCommitMessages(latestVersion, 'HEAD');
	const commits = { trivial: [], patch: [], minor: [], major: [] };
	
	for (const commitMessage of commitMessages) {
		const parsed = GitUtility.parseCommitMessage(commitMessage);
	
		if (!parsed.errors.length) {
			commits[parsed.commit.versionType].push(parsed.commit);
		}
	}
	
	let output = '';
	
	if(commits.major.length > 0) {
		output += '\n### :bomb: Breaking Changes\n\n';
		for(const commit of commits.major) {
			output += ` - ${commit.description} (${commit.taskId})\n`;
		}
	}
	
	if(commits.minor.length > 0) {
		output += '\n### :art: Features\n\n';
		for(const commit of commits.minor) {
			output += ` - ${commit.description} (${commit.taskId})\n`;
		}
	}
	
	if(commits.patch.length > 0) {
		output += '\n### :construction_worker_man: Patch fixes\n\n';
		for(const commit of commits.patch) {
			output += ` - ${commit.description} (${commit.taskId})\n`;
		}
	}
	
	process.stdout.write(output);
}

main();
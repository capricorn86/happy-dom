const ChildProcess = require('child_process');
const Semver = require('semver');

const COMMIT_MESSAGE_REGEXP = /(#[0-9]+)@([^:]+): (.+)/ms;
const VERSION_TYPES = ['trivial', 'patch', 'minor', 'major'];

/**
 * Git Utility.
 */
class GitUtility {

	/**
	 * Returns commit messages.
	 * 
	 * @param {string} from From branch.
	 * @param {string} to To branch.
	 * @returns {string[]} Commit messages.
	 */
	static async getCommitMessages(from, to) {
		const commits = await this.__getDiffCommits(from, to);
		return await Promise.all(commits.map(commit => {
			return new Promise((resolve, reject) => {
				ChildProcess.exec(`git show -s --format=%B ${commit}`, (error, stdout) => {
					if(error) {
						reject(error);
					} else {
						resolve(stdout.replace(/[\n\r]/gm, '').trim());
					}
				});
			});
		}));
	}

	/**
	 * Parses a commit message.
	 * 
	 * @param {string} commitMessage Commit message.
	 * @returns {{ errors: string[]; commit: { taskId: string; versionType: string; description: string; } }} Parsed commit information.
	 */
	static parseCommitMessage(commitMessage) {
		const match = commitMessage.match(COMMIT_MESSAGE_REGEXP);
		const errors = [];

		if(!match) {
			return {
				errors: ['Invalid format. Expected format to be: "#{taskId}@{trivial|patch|minor|major}: {description}."'],
				commit: null
			};
		}

		const description = match[3].trim();

		if(!VERSION_TYPES.includes(match[2])) {
			errors.push(`Invalid version type. Valid version types: ${VERSION_TYPES.join(', ')}`);
		}

		if(description[0] !== description[0].toUpperCase()) {
			errors.push(`Invalid description. Expected description to start with a capital letter`);
		}

		if(!description.endsWith('.')) {
			errors.push(`Invalid description. Expected description to end with a period (".")`);
		}

		return {
			errors,
			commit: {
				taskId: match[1],
				versionType: match[2],
				description
			}
		};
	}

	/**
	 * Returns the next version.
	 * 
	 * @param {string} from From branch.
	 * @param {string} to To branch.
	 * @returns {string} Next version (e.g. "v1.2.3").
	 */
	static async getNextVersion(from, to) {
		const latest = await this.getLatestVersion();
		const versionType = await this.__getVersionType(from, to);
		return Semver.inc(latest, versionType);
	}

	/**
	 * Returns the latest version.
	 * 
	 * @returns {string} Latest version (e.g. "v1.2.3").
	 */
	static getLatestVersion() {
		return new Promise((resolve, reject) => {
			ChildProcess.exec(`git tag -l --sort=v:refname`, (error, stdout) => {
				if(error) {
					reject(error);
				} else {
					const gitTags = stdout.trim().split('\n');
					gitTags.sort(Semver.compare);
					resolve(gitTags[gitTags.length - 1]);
				}
			});
		});
	}

	/**
	 * @param {string} from From branch.
	 * @param {string} to To branch.
	 * @returns {string} "patch", "minor" or "major".
	 */
	static async __getVersionType(from, to) {
		const commitMessages = await this.getCommitMessages(from, to);
		let isMinor = false;
		
		for (const commitMessage of commitMessages) {
			const parsed = this.parseCommitMessage(commitMessage);
		
			if (parsed.commit && parsed.commit.versionType) {
				if(parsed.commit.versionType === 'major') {
					return 'major';
				}
				if(parsed.commit.versionType === 'minor') {
					isMinor = true;
				}
			}
		}

		return isMinor ? 'minor' : 'patch';
	}

	/**
	 * Return a list of commit hashes that differs between two branches.
	 *
	 * @param {string} from From branch.
	 * @param {string} to To branch.
	 * @returns {string[]} List of commit hashes.
	 */
	static __getDiffCommits(from, to) {
		return new Promise((resolve, reject) => {
			ChildProcess.exec(`git log ${from}..${to} --pretty=format:"%h"`, (error, stdout) => {
				if(error) {
					reject(error);
				} else {
					resolve(stdout
						.trim()
						.split('\n')
						.filter(str => str !== ''));
				}
			});
		});
	}
}

module.exports = GitUtility;

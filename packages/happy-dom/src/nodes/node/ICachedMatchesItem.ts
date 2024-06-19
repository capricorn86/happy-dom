import ISelectorMatch from '../../query-selector/ISelectorMatch.js';

export default interface ICachedMatchesItem {
	result: { match: ISelectorMatch | null } | null;
}

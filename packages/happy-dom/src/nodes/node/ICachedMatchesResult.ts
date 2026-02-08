import type ISelectorMatch from '../../query-selector/ISelectorMatch.js';
import type ICachedResult from './ICachedResult.js';

export default interface ICachedMatchesResult extends ICachedResult {
	result: { match: ISelectorMatch | null } | null;
}

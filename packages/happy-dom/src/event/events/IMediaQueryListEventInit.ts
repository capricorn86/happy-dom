import type MediaStreamTrack from '../../nodes/html-media-element/MediaStreamTrack.js';
import type IEventInit from '../IEventInit.js';

export default interface IMediaQueryListEventInit extends IEventInit {
	track?: MediaStreamTrack;
}

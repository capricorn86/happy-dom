import type IEventInit from '../IEventInit.js';

export default interface IPageTransitionEventInit extends IEventInit {
	persisted?: boolean;
}

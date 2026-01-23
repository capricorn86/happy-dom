import type IEventInit from '../IEventInit.js';
import type ICookieStoreItem from '../../cookie-store/ICookieStoreItem.js';

/**
 * Init options for CookieChangeEvent.
 */
export default interface ICookieChangeEventInit extends IEventInit {
	changed?: ICookieStoreItem[];
	deleted?: ICookieStoreItem[];
}

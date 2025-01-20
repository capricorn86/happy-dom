import CookieSameSiteEnum from './enums/CookieSameSiteEnum.js';

export default interface ICookie {
	// Required
	key: string;
	originURL: URL;

	// Optional
	value?: string | null;
	domain?: string | null;
	path?: string | null;
	expires?: Date | null;
	httpOnly?: boolean;
	secure?: boolean;
	sameSite?: CookieSameSiteEnum;
}

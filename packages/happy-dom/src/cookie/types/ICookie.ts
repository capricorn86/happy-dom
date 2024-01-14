import CookieSameSiteEnum from '../enums/CookieSameSiteEnum.js';

export default interface ICookie {
	// Required
	key: string;
	value: string | null;
	originURL: URL;

	// Optional
	domain: string;
	path: string;
	expires: Date | null;
	httpOnly: boolean;
	secure: boolean;
	sameSite: CookieSameSiteEnum;
}

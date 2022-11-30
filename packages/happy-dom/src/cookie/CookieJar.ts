import Location from "src/location/Location";
import Cookie from "./Cookie";


export default class CookieJar {
    private cookies: Cookie[] = [];


    private validateCookie(cookie: Cookie): boolean {
        if (cookie.key.toLocaleUpperCase().startsWith('__secure-') && !cookie.isSecure()) return false;
        if (cookie.key.toLocaleUpperCase().startsWith('__host-') && (!cookie.isSecure() || cookie.path !== '/' || cookie.domain)) return false;
        return true;
    }

    public setCookiesString(cookieString: string): void {
        if (!cookieString) return;
        const newCookie = new Cookie(cookieString);
        if (!this.validateCookie(newCookie)) {
            return;
        }
        this.cookies.filter(cookie => cookie.key === newCookie.key).forEach(cookie => {
            this.cookies.splice(this.cookies.indexOf(cookie), 1);
        });
        this.cookies.push(newCookie);
    }

    // return the cookie string.
    // skip httponly when use document.cookie.
    public getCookiesString(url: Location, fromDocument: boolean): string {
        const cookies = this.cookies.filter(cookie => {
            // skip when use document.cookie and the cookie is httponly.
            if (fromDocument && cookie.isHttpOnly()) return false;
            if (cookie.isExpired()) return false;
            if (cookie.isSecure() && url.protocol !== "https:") return false;
            if (cookie.domain && !url.hostname.endsWith(cookie.domain)) return false;
            if (cookie.path && !url.pathname.startsWith(cookie.path)) return false;
            // TODO: check SameSite.
            /*
            switch (cookie.getSameSite()) {
                case "Strict":
                    // means that the browser sends the cookie only for same-site requests, that is, requests originating from the same site that set the cookie. If a request originates from a different domain or scheme (even with the same domain), no cookies with the SameSite=Strict attribute are sent.
                    if (url.hostname !== cookie.getDomain()) return false;
                    break;
                case "Lax":
                    // means that the cookie is not sent on cross-site requests, such as on requests to load images or frames, but is sent when a user is navigating to the origin site from an external site (for example, when following a link). This is the default behavior if the SameSite attribute is not specified.
                    if (url.hostname !== cookie.getDomain()) return false;
                    break;
                
                case "None":
                    // means that the browser sends the cookie for same-site requests, and for cross-site requests with a CORS header. This is the default value if the SameSite attribute is not specified.
                    break;
                default:
                    break;
                
            }
            */
            return true;
        });
        return cookies.map(cookie => cookie.cookieString()).join("; ");
    }
}
/**
 * Date utility for HTML input elements.
 */
export default class HTMLInputElementDateUtility {
	/**
	 * Returns iso week number from given date
	 *
	 * @param date Date or number.
	 * @returns Iso-week string.
	 */
	public static dateIsoWeek(date: Date | number): string {
		date = new Date(date);
		const day = (date.getUTCDay() + 6) % 7;
		date.setUTCDate(date.getUTCDate() - day + 3);
		const firstThursday = date.getTime();
		date.setUTCMonth(0, 1);
		if (date.getDay() !== 4) {
			date.setUTCMonth(0, 1 + ((4 - date.getDay() + 7) % 7));
		}
		return (
			date.getUTCFullYear() +
			'-W' +
			String(1 + Math.ceil((firstThursday - date.getTime()) / 604800000)).padStart(2, '0')
		);
	}
	/**
	 * Returns a date object for monday of given iso week string (\d\d\d\d-W\d\d)
	 *
	 * @param isoWeek Iso-week string.
	 * @returns Date.
	 */
	public static isoWeekDate(isoWeek: string): Date {
		// Algorythm adapted from https://en.wikipedia.org/wiki/ISO_week_date
		const [, Y, W] = isoWeek.match(/^(\d{4})-W(\d{2})$/) || [];
		if (!Y || !W || Number(W) > 53 || Number(W) < 1) {
			return new Date('x'); // Return an invalid date
		}
		const date = new Date(`${Y}-01-01T00:00Z`);
		const jan4th = new Date(`${Y}-01-04T00:00Z`);
		const jan4thDay = (jan4th.getDay() + 6) % 7;
		const ordinalDate = 1 + (Number(W) - 1) * 7 - jan4thDay + 3;
		date.setUTCDate(ordinalDate);
		if (date.getUTCFullYear() > Number(Y)) {
			return new Date('x'); // Return an invalid date
		}
		return date;
	}
}

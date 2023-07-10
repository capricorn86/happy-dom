/**
 * Return iso-week number from given date
 *
 * @param date Date|number.
 * @returns Iso-week string.
 */
export const dateIsoWeek = (date: Date | number): string => {
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
};

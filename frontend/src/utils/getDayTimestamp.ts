const millisecondsInDay = 1000 * 60 * 60 * 24;

export function getDayTimestamp(date: Date) {
	// return Math.floor(date.getTime() / millisecondsInDay);

	// ISO date string (YYYY-MM-DD)
	const YYYY = String(date.getUTCFullYear()).padStart(4, "0");
	const MM = String(date.getUTCMonth() + 1).padStart(2, "0");
	const DD = String(date.getUTCDate()).padStart(2, "0");
	return `${YYYY}-${MM}-${DD}`;
}

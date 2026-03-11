import axios from "axios";
import { SIMULATE_HOLIDAY_DELAY } from "../constants/simulateDelay";

export interface CountryInfo {
	countryCode: string;
	name: string;
}

export interface PublicHoliday {
	date: string;
	localName: string;
	name: string;
	countryCode: string;
	fixed: boolean;
	global: boolean;
	counties: string[] | null;
	launchYear: number | null;
	types: string[];
}

export class HolidayService {
	private countriesCache: CountryInfo[] | null = null;
	private holidaysCache: Map<string, PublicHoliday[] | null> = new Map();

	async getAvailableCountries(): Promise<CountryInfo[]> {
		await new Promise((resolve) => {
			setTimeout(resolve, SIMULATE_HOLIDAY_DELAY);
		});

		if (this.countriesCache) {
			return this.countriesCache;
		}

		try {
			const { data } = await axios.get<CountryInfo[]>(
				"https://date.nager.at/api/v3/AvailableCountries",
			);

			this.countriesCache = data;
			return data;
		} catch (error) {
			console.error(error);
			throw new Error(
				"Failed to fetch available countries from Nager.Date API",
			);
		}
	}

	async getPublicHolidays(
		year: number,
		countryCode: string,
	): Promise<PublicHoliday[]> {
		await new Promise((resolve) => {
			setTimeout(resolve, SIMULATE_HOLIDAY_DELAY);
		});

		const cacheKey = `${year}-${countryCode}`;
		if (this.holidaysCache.has(cacheKey)) {
			return this.holidaysCache.get(cacheKey) || [];
		}

		try {
			const { data } = await axios.get<PublicHoliday[]>(
				`https://date.nager.at/api/v3/PublicHolidays/${year}/${countryCode}`,
			);

			this.holidaysCache.set(cacheKey, data);
			return data;
		} catch (error: any) {
			if (error.response && error.response.status === 404) {
				// Nager.Date returns 404 for unsupported countries or years
				this.holidaysCache.set(cacheKey, null);
				return [];
			}
			console.error(error);
			throw new Error(
				`Failed to fetch public holidays for ${year} ${countryCode} from Nager.Date API`,
			);
		}
	}
}

import { useQuery } from "@tanstack/react-query";
import axios from "axios";

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

const API_URL = "/api/holidays";

export function useCountries() {
	return useQuery<CountryInfo[]>({
		queryKey: ["countries"],
		queryFn: async () => {
			const res = await axios.get<CountryInfo[]>(`${API_URL}/countries`);
			return res.data || [];
		},
		staleTime: 1000 * 60 * 60 * 24, // 24 hours cache time
	});
}

export function useHolidays(year: number, countryCode: string | null) {
	return useQuery<PublicHoliday[]>({
		queryKey: ["holidays", year, countryCode],
		queryFn: async () => {
			if (!countryCode) return [];
			const { data } = await axios.get<PublicHoliday[]>(
				`${API_URL}/${year}/${countryCode}`,
			);
			return data || [];
		},
		enabled: !!countryCode,
		staleTime: 1000 * 60 * 60 * 24, // 24 hours cache time
	});
}

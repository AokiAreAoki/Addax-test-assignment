import { Request, Response } from "express";
import { HolidayService } from "../services/HolidayService";

export class HolidayController {
	private holidayService: HolidayService;

	constructor() {
		this.holidayService = new HolidayService();
	}

	async getCountries(req: Request, res: Response) {
		try {
			const countries = await this.holidayService.getAvailableCountries();
			res.json(countries);
		} catch (error) {
			res.status(500).json({
				error: "Failed to fetch available countries",
				details: (error as Error).message,
			});
		}
	}

	async getHolidays(req: Request, res: Response) {
		const { year, countryCode } = req.params;
		
		const parsedYear = parseInt(year, 10);
		if (isNaN(parsedYear)) {
			return res.status(400).json({
				error: "Year must be a valid number",
			});
		}

		try {
			const holidays = await this.holidayService.getPublicHolidays(parsedYear, countryCode);
			res.json(holidays);
		} catch (error) {
			res.status(500).json({
				error: "Failed to fetch public holidays",
				details: (error as Error).message,
			});
		}
	}
}

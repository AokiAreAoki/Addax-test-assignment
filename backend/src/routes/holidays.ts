import { Router } from "express";
import { HolidayController } from "../controllers/HolidayController";

const router = Router();
const holidayController = new HolidayController();

router.get("/countries", (req, res) => holidayController.getCountries(req, res));
router.get("/:year/:countryCode", (req, res) => holidayController.getHolidays(req, res));

export default router;

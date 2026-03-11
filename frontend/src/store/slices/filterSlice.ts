import { createSlice, PayloadAction } from "@reduxjs/toolkit";

export interface FilterState {
	countryCode: string | null;
	displayHolidays: boolean;
	displayTasks: boolean;
}

const initialState: FilterState = {
	countryCode: null,
	displayHolidays: true,
	displayTasks: true,
};

export const filterSlice = createSlice({
	name: "filter",
	initialState,
	reducers: {
		setCountryCode: (state, action: PayloadAction<string | null>) => {
			state.countryCode = action.payload;
		},
		setDisplayHolidays: (state, action: PayloadAction<boolean>) => {
			state.displayHolidays = action.payload;
		},
		setDisplayTasks: (state, action: PayloadAction<boolean>) => {
			state.displayTasks = action.payload;
		},
	},
});

export const { setCountryCode, setDisplayHolidays, setDisplayTasks } = filterSlice.actions;

export default filterSlice.reducer;

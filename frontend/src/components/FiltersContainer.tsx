import { FC, useMemo, useState } from "react";
import styled from "styled-components";
import MonthSelector from "./MonthSelector";
import YearSelector from "./YearSelector";
import { StyledButton } from "./StyledButton";
import { useAppDispatch, useAppSelector } from "../store/hooks";
import { useCountries } from "../hooks/useHolidays";
import { Modal } from "./SimpleModal";
import {
	setCountryCode,
	setDisplayHolidays,
	setDisplayTasks,
} from "../store/slices/filterSlice";
import { Loading } from "./Loading";

export namespace FiltersContainer {
	export interface Props {}
}

export const FiltersContainer: FC<FiltersContainer.Props> = ({}) => {
	const [showCountriesModal, setShowCountriesModal] = useState(false);

	const dispatch = useAppDispatch();
	const { countryCode, displayTasks, displayHolidays } = useAppSelector(
		(state) => state.filter,
	);

	const { data: countries, isFetching: areCountriesLoading } = useCountries();

	const myCountry = useMemo(() => {
		return countries?.find((country) => country.countryCode === countryCode);
	}, [countries, countryCode]);

	const modal = showCountriesModal && (
		<Modal center>
			<CountriesModal>
				<span>
					<b>Select Your Country</b>
				</span>

				<div className="main">
					{countries?.map((country) => (
						<StyledButton
							key={country.countryCode}
							onClick={() => {
								setShowCountriesModal(false);
								dispatch(setCountryCode(country.countryCode));
							}}
						>
							{country.name}
						</StyledButton>
					))}
				</div>

				<div className="footer">
					<StyledButton
						onClick={() => {
							setShowCountriesModal(false);
						}}
					>
						Cancel
					</StyledButton>
				</div>
			</CountriesModal>
		</Modal>
	);

	return (
		<Root>
			{modal}

			<StyledButton onClick={() => setShowCountriesModal(true)}>
				{areCountriesLoading ? (
					<>
						My Country: <Loading />
					</>
				) : myCountry ? (
					`My Country: ${myCountry.name}`
				) : (
					"My Country"
				)}
			</StyledButton>

			<StyledCheckbox>
				<label for="display-tasks">Display Tasks: </label>
				<input
					type="checkbox"
					id="display-tasks"
					name="display-tasks"
					checked={displayTasks}
					onChange={(e) => {
						dispatch(setDisplayTasks(e.target.checked));
					}}
				/>
			</StyledCheckbox>

			<StyledCheckbox>
				<label for="display-holidays">Display Holidays: </label>
				<input
					type="checkbox"
					id="display-holidays"
					name="display-holidays"
					checked={displayHolidays}
					onChange={(e) => {
						dispatch(setDisplayHolidays(e.target.checked));
					}}
				/>
			</StyledCheckbox>
		</Root>
	);
};

const StyledCheckbox = styled.span`
	font-size: 1rem;
	font-weight: 700;
	padding: 0.2rem 0.4rem;
	color: #6366f1;
	outline: none;
	border: none;
	border-radius: 4px;
	background: none;
	cursor: pointer;
	user-select: none;

	&:hover {
		color: #4338ca;
		background-color: rgba(99, 102, 241, 0.1);
	}

	& input {
		width: 1rem;
		height: 1rem;
	}

	& label {
		padding-top: 0.2rem;
	}
`;

const CountriesModal = styled.div`
	background-color: white;
	border: none;
	border-radius: 15px;
	overflow: hidden;
	max-width: 95vw;
	max-height: 95vh;

	display: flex;
	flex-direction: column;
	align-items: stretch;
	gap: 15px;
	padding: 15px;

	& .main {
		display: grid;
		gap: 10px;
		grid-template-columns: 1fr;
		overflow: auto;
	}

	& .footer {
		display: flex;
		flex-direction: row;
		justify-content: flex-end;
	}
`;

const Root = styled.div`
	display: flex;
	flex-direction: row;
	align-items: center;
	gap: 25px;
`;

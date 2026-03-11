import { FC, useState } from "react";
import { CalendarGrid } from "./components/CalendarGrid";
import styled from "styled-components";
import Selector from "./components/Selector";
import MonthSelector, { currentMonthOption } from "./components/MonthSelector";
import YearSelector, { currentYearOption } from "./components/YearSelector";
import { ControlsContainer } from "./components/ControlsContainer";
import { FiltersContainer } from "./components/FiltersContainer";
import { useHolidays } from "./hooks/useHolidays";
import { useTasks, Task } from "./hooks/useTasks";
import { useAppSelector } from "./store/hooks";
import { Input } from "./components/Input";

const App: FC = () => {
	const { countryCode } = useAppSelector((state) => state.filter);
	const [monthOption, setMonthOption] = useState(currentMonthOption);
	const [yearOption, setYearOption] = useState(currentYearOption);
	const [searchFilter, setSearchFilter] = useState("");

	const {
		data: allTasks,
		isLoading: areTasksLoading,
		isFetching: areTasksFetching,
	} = useTasks(yearOption.value, monthOption.value);

	const {
		data: allHolidays,
		isLoading: areHolidaysLoading,
		isFetching: areHolidaysFetching,
	} = useHolidays(yearOption.value, countryCode);

	return (
		<AppContainer>
			<HeaderContainer>
				<HeaderContainer>
					<Title>Calendar 🗓️</Title>

					<FiltersContainer />
				</HeaderContainer>

				<HeaderContainer>
					<ControlsContainer
						monthOption={monthOption}
						yearOption={yearOption}
						onMonthOptionChange={setMonthOption}
						onYearOptionChange={setYearOption}
					/>

					<Input
						value={searchFilter}
						onChange={setSearchFilter}
						placeholder="Search..."
					/>
				</HeaderContainer>
			</HeaderContainer>

			<CalendarGrid
				isEverythingLoading={areHolidaysFetching || areTasksLoading}
				month={monthOption.value}
				year={yearOption.value}
				allHolidays={allHolidays}
				allTasks={allTasks}
				searchFilter={searchFilter}
			/>
		</AppContainer>
	);
};

const AppContainer = styled.div`
	padding-top: 12px;
	display: flex;
	flex-direction: column;
	align-items: stretch;
	width: 100vw;
	height: 100vh;
	overflow: hidden;
`;

const HeaderContainer = styled.div`
	flex-grow: 1;
	display: flex;
	flex-direction: row;
	align-items: center;
	flex-wrap: wrap;
	padding-inline: 16px;
	gap: 10px;

	justify-content: space-between;

	& > :not(:first-child) {
		margin-left: auto;
	}
`;

const Title = styled.span`
	font-size: 1.3rem;
	font-weight: bold;
`;

export default App;

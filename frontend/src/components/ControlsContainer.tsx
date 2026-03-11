import { FC } from "react";
import styled from "styled-components";
import MonthSelector from "./MonthSelector";
import YearSelector from "./YearSelector";

export namespace ControlsContainer {
	export interface Props {
		monthOption: MonthSelector.Option;
		yearOption: YearSelector.Option;
		onMonthOptionChange: (monthOption: MonthSelector.Option) => void;
		onYearOptionChange: (yearOption: YearSelector.Option) => void;
	}
}

export const ControlsContainer: FC<ControlsContainer.Props> = ({
	monthOption,
	yearOption,
	onMonthOptionChange,
	onYearOptionChange,
}) => {
	const onPrevMonth: MonthSelector.Props["onPrev"] = (
		prevOption,
		nextOption,
		hasCycled,
	) => {
		if (hasCycled) {
			onYearOptionChange((prev) => {
				const prevYear = prev.value - 1;

				return {
					key: String(prevYear),
					name: String(prevYear),
					value: prevYear,
				};
			});
		}
	};

	const onNextMonth: MonthSelector.Props["onNext"] = (
		prevOption,
		nextOption,
		hasCycled,
	) => {
		if (hasCycled) {
			onYearOptionChange((prev) => {
				const nextYear = prev.value + 1;

				return {
					key: String(nextYear),
					name: String(nextYear),
					value: nextYear,
				};
			});
		}
	};

	const onPrevYear: YearSelector.Props["onPrev"] = (
		prevOption,
		nextOption,
		hasCycled,
	) => {
		const prevYear = prevOption.value - 1;
		return {
			key: String(prevYear),
			name: String(prevYear),
			value: prevYear,
		};
	};

	const onNextYear: YearSelector.Props["onNext"] = (
		prevOption,
		nextOption,
		hasCycled,
	) => {
		const nextYear = prevOption.value + 1;
		return {
			key: String(nextYear),
			name: String(nextYear),
			value: nextYear,
		};
	};

	const handleMonthChange: MonthSelector.Props["onChange"] = (option) => {
		onMonthOptionChange(option);
	};

	const handleYearChange: YearSelector.Props["onChange"] = (option) => {
		onYearOptionChange(option);
	};

	return (
		<Root>
			<MonthSelector
				year={yearOption.value}
				value={monthOption}
				onChange={handleMonthChange}
				onPrev={onPrevMonth}
				onNext={onNextMonth}
			/>
			<YearSelector
				value={yearOption}
				onChange={handleYearChange}
				onPrev={onPrevYear}
				onNext={onNextYear}
			/>
		</Root>
	);
};

const Root = styled.div`
	display: flex;
	flex-direction: row;
	align-items: center;
	gap: 25px;
`;

import Selector from "./Selector";
import { FC, useMemo } from "react";
import { currentYear } from "./YearSelector";

export const monthOptions = [
	{ key: "jan", name: "January", value: 0 },
	{ key: "feb", name: "February", value: 1 },
	{ key: "mar", name: "March", value: 2 },
	{ key: "apr", name: "April", value: 3 },
	{ key: "may", name: "May", value: 4 },
	{ key: "jun", name: "June", value: 5 },
	{ key: "jul", name: "July", value: 6 },
	{ key: "aug", name: "August", value: 7 },
	{ key: "sep", name: "September", value: 8 },
	{ key: "oct", name: "October", value: 9 },
	{ key: "nov", name: "November", value: 10 },
	{ key: "dec", name: "December", value: 11 },
];

const currentMonth = new Date().getMonth();

export const currentMonthOption = monthOptions.find(
	(opt) => opt.value === currentMonth,
)!;

namespace MonthSelector {
	export type Option = Selector.Option<number>;
	export interface Props extends Omit<Selector.Props<number>, "options"> {
		year: number;
	}
}

const MonthSelector: FC<MonthSelector.Props> = ({
	year,
	value,
	onChange,
	onNext,
	onPrev,
}) => {
	const options = useMemo(() => {
		return monthOptions.map((option) =>
			year === currentYear && option.value === currentMonth
				? {
						...option,
						name: `${option.name} (now)`,
					}
				: option,
		);
	}, [year]);

	return (
		<Selector
			options={options}
			value={value}
			onChange={onChange}
			onNext={onNext}
			onPrev={onPrev}
		/>
	);
};

export default MonthSelector;

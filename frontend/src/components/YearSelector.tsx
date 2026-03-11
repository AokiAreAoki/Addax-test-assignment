import Selector from "./Selector";
import { FC, useMemo } from "react";

export const currentYear = new Date().getFullYear();

export const currentYearOption: YearSelector.Option = {
	key: String(currentYear),
	name: `${currentYear} (now)`,
	value: currentYear,
};

function generateYearsRange(
	middleYear: number,
	minOffset: number,
	maxOffset: number,
) {
	const yearOptions: YearSelector.Props["options"] = [];

	console.log({ middleYear });

	if (currentYear < middleYear - minOffset) {
		yearOptions.push(currentYearOption);
	}

	for (
		let year = middleYear - minOffset;
		year <= middleYear + maxOffset;
		++year
	) {
		yearOptions.push({
			key: String(year),
			name: year === currentYear ? `${year} (now)` : String(year),
			value: year,
		});
	}

	if (currentYear > middleYear + maxOffset) {
		yearOptions.push(currentYearOption);
	}

	return yearOptions;
}

namespace YearSelector {
	export type Option = Selector.Option<number>;
	export interface Props extends Omit<Selector.Props<number>, "options"> {
		minOffset?: number;
		maxOffset?: number;
	}
}

const YearSelector: FC<YearSelector.Props> = ({
	value,
	onChange,
	onNext,
	onPrev,

	minOffset = 5,
	maxOffset = 5,
}) => {
	const yearOptions = useMemo(() => {
		console.log(value);

		return generateYearsRange(value.value, minOffset, maxOffset);
	}, [value]);

	return (
		<Selector
			options={yearOptions}
			value={value}
			onChange={onChange}
			onNext={onNext}
			onPrev={onPrev}
		/>
	);
};

export default YearSelector;

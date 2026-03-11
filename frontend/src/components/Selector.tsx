import { FC } from "react";
import styled from "styled-components";

const SelectorContainer = styled.div`
	display: flex;
	align-items: center;
	gap: 4px;
`;

const Button = styled.button`
	background: #6366f1;
	color: #fff;
	border: none;
	border-radius: 8px;
	padding: 6px 12px;
	font-size: 1rem;
	cursor: pointer;
	transition: background 0.2s;
	&:hover {
		background: #4f46e5;
	}
`;

const Option = styled.div`
	font-size: 1.1rem;
	font-weight: 600;
	color: #374151;
	min-width: 80px;
	text-align: center;
`;

const OptionSelect = styled.select`
	font-size: 1.1rem;
	font-weight: 600;
	color: #374151;
	min-width: 80px;
	text-align: center;
	border-radius: 8px;
	border: 1px solid #cbd5e1;
	padding: 4px 8px;
	background: #fff;
`;

function Selector<T>({
	options,
	value,
	onChange,
	onNext,
	onPrev,
}: Selector.Props<T>) {
	// Find current index
	const currentIndex = options.findIndex((opt) => opt.key === value.key);

	const handlePrev = () => {
		let newIndex = currentIndex - 1;
		let cycled = false;
		if (newIndex < 0) {
			newIndex = options.length - 1;
			cycled = true;
		}
		const nextOption = options[newIndex];
		const overriddenOption = onPrev && onPrev(value, nextOption, cycled);
		onChange(overriddenOption ?? nextOption);
	};

	const handleNext = () => {
		let newIndex = currentIndex + 1;
		let cycled = false;
		if (newIndex >= options.length) {
			newIndex = 0;
			cycled = true;
		}
		const nextOption = options[newIndex];
		const overriddenOption = onNext && onNext(value, nextOption, cycled);
		onChange(overriddenOption ?? nextOption);
	};

	return (
		<SelectorContainer>
			{onPrev && <Button onClick={handlePrev}>&lt;</Button>}

			<OptionSelect
				key={value.key}
				value={value.key}
				onChange={(e) => {
					const selected = options.find((opt) => opt.key === e.target.value);
					if (selected) onChange(selected);
				}}
			>
				{options.map((opt) => (
					<option key={opt.key} value={opt.key}>
						{opt.name}
					</option>
				))}
			</OptionSelect>

			{onNext && <Button onClick={handleNext}>&gt;</Button>}
		</SelectorContainer>
	);
}

namespace Selector {
	export interface Props<T> {
		options: Option<T>[];
		value: Option<T>;
		onChange: (value: Option<T>) => void;
		onNext?: (
			prevOption: Option<T>,
			nextOption: Option<T>,
			cycled: boolean,
		) => Option<T> | null | undefined;
		onPrev?: (
			prevOption: Option<T>,
			nextOption: Option<T>,
			cycled: boolean,
		) => Option<T> | null | undefined;
	}

	export interface Option<T> {
		key: string;
		name: string;
		value: T;
	}
}

export default Selector;

import { FC, useState, FormEvent } from "react";
import styled from "styled-components";

namespace Input {
	export interface Props extends React.InputHTMLAttributes<HTMLInputElement> {
		value?: string;
		onChange?: (value: string) => void;
		onSubmit?: (value: string) => void;
		placeholder?: string;
	}
}

export const Input: FC<Input.Props> = ({
	value = "",
	onChange,
	onSubmit,
	placeholder,
	...rest
}) => {
	const [internalValue, setInternalValue] = useState(value);

	const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		setInternalValue(e.target.value);
		onChange?.(e.target.value);
	};

	const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
		if (e.key === "Enter") {
			e.preventDefault();
			onChange?.(e.target.value);
			onSubmit?.(internalValue);
		}
	};

	return (
		<StyledInput
			{...rest}
			type="text"
			value={internalValue}
			onChange={handleChange}
			onKeyDown={handleKeyDown}
			placeholder={placeholder}
		/>
	);
};

const StyledInput = styled.input`
	font-size: 1rem;
	padding: 8px 12px;
	border: 1px solid #e0e7ef;
	border-radius: 8px;
	outline: none;
	background: #fbfcfd;
	transition: border-color 0.2s;

	&:focus {
		border-color: #6366f1;
		background: #fff;
	}
`;

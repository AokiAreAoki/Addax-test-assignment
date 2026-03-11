import styled from "styled-components";

export const StyledButton = styled.button`
	font-size: 1rem;
	font-weight: 700;
	padding-top: 0.2rem;
	padding-bottom: 1px;
	padding-inline: 6px;
	color: #6366f1;
	outline: none;
	border: none;
	border-radius: 4px;
	background: none;
	cursor: pointer;
	user-select: none;
	display: flex;
	flex-direction: row;
	align-items: center;
	gap: 0.5em;

	&:hover {
		color: #4338ca;
		background-color: rgba(99, 102, 241, 0.1);
	}
`;

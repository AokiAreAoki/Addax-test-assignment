import { FC } from "react";
import styled from "styled-components";

export const Loading: FC<Loading.Props> = ({}) => {
	return <StyledSpinner />;
};

export namespace Loading {
	export namespace Props {}
}

const StyledSpinner = styled.div`
	border: 0.25em solid #f3f3f3;
	border-top: 0.25em solid #6366f1;
	border-radius: 50%;
	width: 1em;
	height: 1em;
	animation: spin 1s cubic-bezier(0.5, 0, 0.5, 1) infinite;
`;

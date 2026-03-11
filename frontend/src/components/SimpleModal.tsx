import { FC, PropsWithChildren, useEffect, useRef, useState } from "react";
import styled from "styled-components";

export const ModalBase = styled.div`
	top: 0;
	left: 0;
	position: relative;
	width: 0px;
	height: 0px;
`;

const modalPadding = 15;

export const Modal: FC<Modal.Props> = ({ center, children }) => {
	const ref = useRef<HTMLDivElement>();
	const [x, setX] = useState(0);
	const [y, setY] = useState(0);

	useEffect(() => {
		const observer = new ResizeObserver(([entry]) => {
			const rect = entry.target.getBoundingClientRect();

			const maxX = window.scrollX + rect.right + modalPadding;
			const maxY = window.scrollY + rect.bottom + modalPadding;
			const xOverflow = Math.max(0, maxX - window.innerWidth);
			const yOverflow = Math.max(0, maxY - window.innerHeight);

			setX(-xOverflow);
			setY(-yOverflow);

			console.log({ rect });
			console.log("xOverflow:", xOverflow);
			console.log("yOverflow:", yOverflow);
		});

		observer.observe(ref.current);

		return () => observer.disconnect();
	}, []);

	return (
		<>
			<ModalBackground />
			<Root ref={ref} x={x} y={y} center={center}>
				{children}
			</Root>
		</>
	);
};

export namespace Modal {
	export interface Props extends PropsWithChildren {
		center: boolean;
	}
}

export const ModalBackground = styled.div`
	position: absolute;
	z-index: 101;
	overflow: hidden;
	top: 0;
	left: 0;
	width: 100vw;
	height: 100vh;
	background-color: rgba(0, 0, 0, 0.2);
`;

export const Root = styled.div<RootProps>(function ({ x, y, center }) {
	return `
		position: absolute;
		z-index: 102;
		overflow: hidden;

		${
			center
				? `
			top: 0;
			left: 0;
			width: 100vw;
			height: 100vh;
			display: flex;
			justify-content: center;
			align-items: center;
		`
				: ""
		}

		transform: translate(${x}px, ${y}px);
	`;
});

interface RootProps {
	center: boolean;
	x: number;
	y: number;
}

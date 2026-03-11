import { FC, memo, useState } from "react";
import styled from "styled-components";
import { Task, useCreateTask } from "../hooks/useTasks";
import { Input } from "./Input";
import { Modal } from "./SimpleModal";
import { DayCellTask, StyledInputButton } from "./DayCellTask";
// import { useDroppable } from "@dnd-kit/react";
import { Draggable, Droppable } from "react-beautiful-dnd";
import { PublicHoliday } from "../hooks/useHolidays";
import { StyledButton } from "./StyledButton";
import { Loading } from "./Loading";

export const DayCell: FC<DayCell.Props> = ({
	isToday,
	isLoading,
	value,
	displayTasks,
	tasks,
	displayHolidays,
	holidays,
}) => {
	const { mutate: createTask, isPending } = useCreateTask();

	const [newTask, setNewTask] = useState("");
	const [showInlineInput, setShowInlineInput] = useState(false);
	const [lastTask, setLastTask] = useState("");

	// const { ref, isDropTarget } = useDroppable({
	// 	id: value.timestamp,
	// 	// type: "column",
	// 	// accept: "item",
	// 	// collisionPriority: 1,
	// });
	//

	return (
		<Root currentMonth={value.type === "current"} isToday={isToday}>
			<div className="top-row">
				<DayNumber>{value.day}</DayNumber>
				{isLoading ? (
					<Loading />
				) : (
					displayTasks && (
						<StyledButton onClick={() => setShowInlineInput(true)}>
							+ Add
						</StyledButton>
					)
				)}
			</div>

			{isPending && (
				<ItemContainer>
					<StyledInputButton>
						<span>{lastTask}</span>
						<Loading />
					</StyledInputButton>
				</ItemContainer>
			)}

			{showInlineInput && (
				// <Modal>
				<Input
					autoFocus
					onBlur={() => {
						if (!newTask) setShowInlineInput(false);
					}}
					value={newTask}
					onChange={(newTask) => setNewTask(newTask.trim())}
					onSubmit={(newTask) => {
						setNewTask("");
						setLastTask(newTask);
						setShowInlineInput(false);

						createTask({
							title: newTask,
							date: value.timestamp, // YYYY-MM-DD
						});
					}}
					placeholder="Add task..."
				/>
				// </Modal>
			)}

			{displayHolidays &&
				holidays?.map((holiday, index) => (
					<StyledHolidayDiv key={holiday.name}>
						<span>
							{/* {holiday.types.map((type) => holidayToEmojiMap[type])} */}
							{/* {holiday.types.map((type) => holidayToEmojiMap[type])} */}
							{holiday.types.map((type) => holidayToEmojiMap[type])}
						</span>
						<span>{holiday.name}</span>
					</StyledHolidayDiv>
				))}

			<Droppable droppableId={value.timestamp} type="group">
				{(provided, snapshot) => (
					<div
						{...provided.droppableProps}
						ref={provided.innerRef}
						// ref={ref}
						id={value.timestamp}
						className="tasks"
					>
						{displayTasks &&
							tasks?.map((task, index) => (
								<Draggable
									key={`${index}-${task._id}-${task.__v}`}
									draggableId={task._id}
									index={index}
								>
									{(provided) => (
										<ItemContainer
											ref={provided?.innerRef}
											{...provided?.draggableProps}
											{...provided?.dragHandleProps}
										>
											<DayCellTask
												value={task}
												index={index}
												timestamp={value.timestamp}
												// provided={provided}
											/>
										</ItemContainer>
									)}
								</Draggable>
							))}

						{provided.placeholder}
					</div>
				)}
			</Droppable>
		</Root>
	);
};

const holidayToEmojiMap = {
	Public: "🎉",
	Bank: "🏦",
	School: "🏫",
	Authorities: "🏛️",
	Optional: "🫥",
	Observance: "👀",
};

export namespace DayCell {
	export interface Props {
		isToday: boolean;
		isLoading: boolean;
		value: CalendarDayCell;
		displayTasks: boolean;
		tasks: Task[] | null | undefined;
		displayHolidays: boolean;
		holidays: PublicHoliday[] | null | undefined;
	}

	export interface CalendarDayCell {
		timestamp: string; // ISO date string (YYYY-MM-DD)
		day: number; // day in month
		type: "prev" | "current" | "next";
	}
}

interface RootProps {
	currentMonth: boolean;
	isToday: boolean;
}

const Root = styled.div<RootProps>(
	({ currentMonth, isToday }) => `
		background: #fff;
		box-shadow: 0 4px 16px rgba(60, 72, 100, 0.08);
		border-radius: 8px;
		padding: 4px 10px;
		min-height: 120px;
		display: flex;
		flex-direction: column;
		align-items: stretch;
		transition: box-shadow 0.2s, opacity 0.2s;
		opacity: ${currentMonth ? 1 : 0.5};

		${
			isToday
				? `
			background-color: #ededf8;
			border: 1px solid #6366f1;
		`
				: ""
		}

		&:hover, &:focus-within {
			opacity: 1;
			box-shadow: 0 8px 24px rgba(60, 72, 100, 0.16);
		}

		.top-row {
			display: flex;
			flex-direction: row;
			justify-content: space-between;
		}

		.tasks {
			flex-grow: 1;
			display: inherit;
			flex-direction: inherit;
			justify-content: inherit;
			overflow-x: hidden;
			overflow-y: auto;

			& > span {
				border: none;
			}
		}
	`,
);

export const StyledHolidayDiv = styled.div`
	margin-top: 6px;
	width: 100%;
	font-size: 1rem;
	border: 1px solid #e0e7ef;
	border-radius: 8px;
	outline: none;
	background: #f8fafc;
	transition: border-color 0.2s;
	user-select: auto;
	display: flex;
	justify-content: flex-start;
	gap: 2px;
	padding: 2px 5px;

	&:focus {
		border-color: #6366f1;
		background: #fff;
	}
`;

const DayNumber = styled.div`
	font-size: 1rem;
	font-weight: 700;
	color: #6366f1;
	/* padding-top: 0.2rem; */
	padding-bottom: 1px;
	padding-inline: 6px;
`;

const ItemContainer = styled.div`
	margin-top: 6px;
`;

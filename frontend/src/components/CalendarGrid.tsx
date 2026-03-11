import { FC, useEffect, useMemo, useState } from "react";
import styled from "styled-components";
import {
	Task,
	useTasks,
	useUpdateTaskDate,
	useUpdateTaskOrder,
} from "../hooks/useTasks";
import { getDayTimestamp } from "../utils/getDayTimestamp";
import { DayCell } from "./DayCell";
// import { DragDropProvider } from "@dnd-kit/react";
import { DragDropContext, OnDragEndResponder } from "react-beautiful-dnd";
import { useHolidays } from "../hooks/useHolidays";
import { useAppDispatch, useAppSelector } from "../store/hooks";

export const CalendarGrid: FC<CalendarGrid.Props> = ({
	isEverythingLoading,
	month,
	year,
	allHolidays,
	allTasks,
	searchFilter,
}) => {
	const { displayTasks, displayHolidays } = useAppSelector(
		(state) => state.filter,
	);
	const { mutate: updateTaskOrder, isPending: orderUpdatePending } =
		useUpdateTaskOrder();
	const { mutate: updateTaskDate, isPending: dateUpdatePending } =
		useUpdateTaskDate();

	const [tasksLookupMap, setTasksLookupMap] = useState<
		Record<string, Task[] | undefined>
	>({});
	const [lastUpdatedSource, setLastUpdatedSource] = useState("");
	const [lastUpdatedDestination, setLastUpdatedDestination] = useState("");

	const today = getDayTimestamp(new Date());

	// Get first day of month (0 = Sunday, 6 = Saturday)
	const weekOffset = (new Date(Date.UTC(year, month, 1)).getDay() + 7 - 1) % 7;

	// Get number of days in current month
	const daysInMonth = new Date(Date.UTC(year, month + 1, 0)).getDate();

	// Get number of days in previous month
	const prevMonth = month === 0 ? 11 : month - 1;
	const prevMonthYear = month === 0 ? year - 1 : year;
	const daysInPrevMonth = new Date(
		Date.UTC(prevMonthYear, prevMonth + 1, 0),
	).getDate();

	// Calculate grid cells
	const cells = useMemo(() => {
		const cells: CalendarDayCell[] = [];

		// Fill start with previous month days
		console.log({ weekOffset });
		for (let idx = weekOffset - 1; idx >= 0; idx--) {
			cells.push({
				timestamp: getDayTimestamp(
					new Date(Date.UTC(prevMonthYear, prevMonth, daysInPrevMonth - idx)),
				),
				day: daysInPrevMonth - idx,
				type: "prev",
			});
		}

		// Fill current month days
		console.log({ daysInMonth });
		for (let i = 1; i <= daysInMonth; i++) {
			cells.push({
				timestamp: getDayTimestamp(new Date(Date.UTC(year, month, i))),
				day: i,
				type: "current",
			});
		}

		// Fill end with next month days to complete 6 weeks (42 cells)
		const totalCells = Math.ceil((weekOffset + daysInMonth) / 7) * 7;
		const nextDays = totalCells - cells.length;
		for (let i = 1; i <= nextDays; i++) {
			cells.push({
				timestamp: getDayTimestamp(new Date(Date.UTC(year, month + 1, i))),
				day: i,
				type: "next",
			});
		}

		return cells;
	}, [weekOffset, daysInMonth, daysInPrevMonth]);

	useEffect(() => {
		const map: Record<string, Task[]> = {};

		allTasks?.forEach((task) => {
			const timestamp = getDayTimestamp(new Date(task.date));

			if (!map[timestamp]) {
				map[timestamp] = [];
			}

			map[timestamp].push(task);
		});

		// return map;
		setTasksLookupMap(map);
	}, [allTasks]);

	console.log({ tasksLookupMap });

	const onDragEnd: OnDragEndResponder = ({ source, destination }) => {
		if (allTasks && source && destination) {
			console.log({
				source,
				destination,
			});

			if (source.droppableId === destination.droppableId) {
				if (source.index === destination.index) return;

				const todayTasks = tasksLookupMap[source.droppableId];
				const movedTask = todayTasks?.[source.index];

				if (movedTask) {
					const filteredTasks = todayTasks.filter(
						(task) => task._id !== movedTask._id,
					);
					const firstHalf = filteredTasks.slice(0, destination.index);
					const secondHalf = filteredTasks.slice(destination.index);
					const newTaskOrder = [...firstHalf, movedTask, ...secondHalf];

					console.log({
						movedTaskID: movedTask._id,
						filteredTasks,
						position: destination.index,
						firstHalf,
						movedTask,
						secondHalf,
					});

					setTasksLookupMap((prev) => ({
						...prev,
						[source.droppableId]: newTaskOrder,
					}));

					updateTaskOrder({
						id: movedTask._id,
						position: destination.index,
					});

					setLastUpdatedSource(source.droppableId);
					setLastUpdatedDestination(destination.droppableId);
				}
			} else {
				const sourceTasks = tasksLookupMap[source.droppableId];
				const destinationTasks = tasksLookupMap[destination.droppableId] || [];

				const movedTask = sourceTasks?.[source.index];

				if (movedTask) {
					const newSourceTasks = sourceTasks.filter(
						(task) => task._id !== movedTask._id,
					);

					const destinationFirstHalf = destinationTasks.slice(
						0,
						destination.index,
					);
					const destinationSecondHalf = destinationTasks.slice(
						destination.index,
					);
					const newDestinationTasks = [
						...destinationFirstHalf,
						movedTask,
						...destinationSecondHalf,
					];

					setTasksLookupMap((prev) => ({
						...prev,
						[source.droppableId]: newSourceTasks,
						[destination.droppableId]: newDestinationTasks,
					}));

					updateTaskDate({
						id: movedTask._id,
						date: getDayTimestamp(new Date(destination.droppableId)),
						position: destination.index,
					});

					setLastUpdatedSource(source.droppableId);
					setLastUpdatedDestination(destination.droppableId);
				}
			}
		}
	};

	const holidaysLookupMap = useMemo(() => {
		const map: Record<string, PublicHoliday[]> = {};

		allHolidays?.forEach((holiday) => {
			const timestamp = getDayTimestamp(new Date(holiday.date));

			if (!map[timestamp]) {
				map[timestamp] = [];
			}

			map[timestamp].push(holiday);
		});

		return map;
	}, [allHolidays]);

	const words = searchFilter.trim().toLowerCase().split(/\s+/g);

	return (
		<DragDropContext onDragEnd={onDragEnd}>
			<Grid>
				{cells.map((cell, idx) => {
					const timestamp = getDayTimestamp(new Date(cell.timestamp));
					const tasks = tasksLookupMap[timestamp]?.filter((task) =>
						words.every((word) => task.title.toLowerCase().includes(word)),
					);
					const holidays = holidaysLookupMap[timestamp];

					const isLoading =
						isEverythingLoading ||
						((orderUpdatePending || dateUpdatePending) &&
							(lastUpdatedSource === cell.timestamp ||
								lastUpdatedDestination === cell.timestamp));

					return (
						<DayCell
							isToday={cell.timestamp === today}
							isLoading={isLoading}
							key={cell.timestamp}
							value={cell}
							displayTasks={displayTasks}
							tasks={tasks}
							displayHolidays={displayHolidays}
							holidays={holidays}
						/>
					);
				})}
			</Grid>
		</DragDropContext>
	);
};

namespace CalendarGrid {
	export interface Props {
		isEverythingLoading: boolean;
		allTasks: Task[] | undefined;
		allHolidays: PublicHoliday[] | undefined;
		month: number;
		year: number;
		searchFilter: string;
	}
}

const Grid = styled.div`
	overflow: auto;
	flex-grow: 1;
	display: grid;
	grid-template-columns: repeat(7, 1fr);
	/* grid-template-rows: repeat(6, 1fr); */
	gap: 8px;
	width: 100vw;
	height: 100vh;
	background: linear-gradient(135deg, #f8fafc 0%, #e0e7ff 100%);
	padding: 8px;
`;

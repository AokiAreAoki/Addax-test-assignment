import { FC, useRef, useState } from "react";
// import { useSortable } from "@dnd-kit/react/sortable";
// import { CSS } from "@dnd-kit/utilities";
import { Task, useDeleteTask, useUpdateTask } from "../hooks/useTasks";
import styled from "styled-components";
import { Input } from "./Input";
import { DragHandle } from "./DragHandle";
import { DraggableProvided } from "react-beautiful-dnd";
import { Loading } from "./Loading";

export const DayCellTask: FC<DayCellTask.Props> = ({
	value,
	index,
	timestamp,
	// provided,
}) => {
	const { mutate: updateTask, isPending: isUpdatePending } = useUpdateTask();
	const { mutate: deleteTask, isPending: isDeletePending } = useDeleteTask();

	const internalTitle = useRef(value.title);
	const [showInput, setShowInput] = useState(false);

	// const {
	// 	attributes,
	// 	listeners,
	// 	setNodeRef,
	// 	transform,
	// 	transition,
	// 	isDragging,
	// } = useSortable({ id: value._id });

	// const {
	// 	handleRef,
	// 	ref,
	// 	// setNodeRef,
	// 	isDragSource,
	// 	// transform,
	// 	// transition,
	// 	// attributes,
	// 	// listeners,
	// } = useSortable({
	// 	id: value._id,
	// 	index,
	// 	// type: "item",
	// 	// accept: "item",
	// 	group: timestamp,
	// });

	// const style = {
	// 	transform: CSS.Transform.toString(transform),
	// 	transition,
	// 	opacity: isDragging ? "0.5" : "",
	// 	cursor: "grab",
	// };

	const save = () => {
		setShowInput(false);

		if (internalTitle.current) {
			if (internalTitle.current !== value.title)
				updateTask({ ...value, title: internalTitle.current });
		} else {
			deleteTask(value._id);
		}
	};

	return showInput ? (
		<Input
			autoFocus
			value={internalTitle.current}
			onChange={(newTitle) => (internalTitle.current = newTitle.trim())}
			onSubmit={save}
			onBlur={save}
			placeholder="Edit task..."
		/>
	) : (
		<StyledInputButton
			onClick={() => {
				if (!isUpdatePending && !isDeletePending) setShowInput(true);
			}}
			// id={value._id}
			// ref={ref}
			// style={{
			// 	// backgroundColor: isDragSource ? "red" : "",
			// 	opacity: isDragSource ? "0.5" : "",
			// }}

			// ref={setNodeRef}
			// style={style}
			// {...attributes}
			// {...listeners}

			style={
				isDeletePending
					? {
							backgroundColor: "pink",
						}
					: undefined
			}
		>
			<span>{index + 1 + ". " + value.title}</span>

			{isUpdatePending || isDeletePending ? (
				<Loading />
			) : (
				<div
					// ref={handleRef}
					className="drag-handle"
				>
					<DragHandle />
				</div>
			)}
		</StyledInputButton>
	);
};

namespace DayCellTask {
	export interface Props {
		value: Task;
		index: number;
		timestamp: string;
		// provided?: DraggableProvided;
	}
}

export const StyledInputButton = styled.button`
	width: 100%;
	font-size: 1rem;
	border: 1px solid #e0e7ef;
	border-radius: 8px;
	outline: none;
	background: #f8fafc;
	transition: border-color 0.2s;
	user-select: auto;
	display: flex;
	justify-content: space-between;

	&:focus {
		border-color: #6366f1;
		background: #fff;
	}

	& > * {
		margin: 4px 4px;
	}

	.drag-handle {
		cursor: move;
		width: 1em;
		height: 1em;
	}
`;

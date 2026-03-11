import { SortOrder } from "mongoose";
import { Task } from "../models/Task";
import { SIMULATE_TASK_DELAY } from "../constants/simulateDelay";

const DAY = 86400e3;
const DEFAULT_TASK_SORT: Record<string, SortOrder> = { order: "asc" };

export function getDayDate(date: string | Date) {
	date = new Date(date);
	return new Date(
		Date.UTC(date.getFullYear(), date.getMonth(), date.getDate()),
	);
}

export class TaskService {
	async getTasksByMonth(
		year: number,
		month: number, // 0-11
	): Promise<import("../models/Task").Task[]> {
		await new Promise((resolve) => {
			setTimeout(resolve, SIMULATE_TASK_DELAY);
		});

		const start = new Date(Date.UTC(year, month, 1));
		const end = new Date(Date.UTC(year, month + 1, 1));

		console.log({
			month,
			start,
			end,
		});

		return Task.find({
			date: {
				$gte: start,
				$lt: end,
			},
		}).sort(DEFAULT_TASK_SORT);
	}

	async createTask(params: { title: string; date: string }) {
		await new Promise((resolve) => {
			setTimeout(resolve, SIMULATE_TASK_DELAY);
		});

		const dayDate = getDayDate(params.date);

		const task = new Task({
			title: params.title,
			date: dayDate,
			order: (
				await Task.find({
					date: {
						$gte: dayDate,
						$lt: new Date(dayDate.getTime() + DAY),
					},
				})
			).length,
		});
		return task.save();
	}

	async updateTask(
		id: string,
		params: { title: string; date: string; order: number },
	) {
		await new Promise((resolve) => {
			setTimeout(resolve, SIMULATE_TASK_DELAY);
		});

		return Task.findByIdAndUpdate(
			id,
			{
				...params,
				date: getDayDate(params.date),
			},
			{ new: true },
		);
	}

	async updateTaskOrder(id: string, position: number) {
		await new Promise((resolve) => {
			setTimeout(resolve, SIMULATE_TASK_DELAY);
		});

		if (isNaN(position) || !isFinite(position)) {
			throw new Error("Position must be a valid number");
		}

		console.log("updateTaskOrder", { id, position });

		let movedTask = await Task.findOne({ _id: id });
		if (!movedTask) {
			throw new Error("Task not found");
		}

		const dayDate = getDayDate(movedTask.date);
		const start = dayDate;
		const end = new Date(dayDate.getTime() + DAY);

		const brokenTasks = await Task.find({
			date: {
				$gt: start,
				$lt: end,
			},
		});

		if (brokenTasks.length > 0) {
			let refetchMovedTask = false;

			const bulkOps = brokenTasks.map((task) => {
				if (task.id === movedTask!.id) {
					refetchMovedTask = true;
				}

				return {
					updateOne: {
						filter: { _id: task.id },
						update: { date: getDayDate(task.date) },
					},
				};
			});

			await Task.bulkWrite(bulkOps);

			if (refetchMovedTask) {
				movedTask = await Task.findOne({ _id: movedTask.id });
				if (!movedTask) {
					throw new Error("Task not found");
				}
			}
		}

		const tasks = await Task.find({
			date: dayDate,
		}).sort(DEFAULT_TASK_SORT);

		if (tasks.length > 1) {
			const filteredTasks = tasks.filter((task) => task.id !== movedTask.id);

			const firstHalf = filteredTasks.slice(0, position);
			const secondHalf = filteredTasks.slice(position);

			console.log({
				movedTaskID: movedTask._id,
				filteredTasks,
				position,
				firstHalf,
				movedTask,
				secondHalf,
			});
			const newTaskOrder = [...firstHalf, movedTask, ...secondHalf].map(
				(task, idx) => task._id,
			);

			const bulkOps = newTaskOrder.map((id, index) => ({
				updateOne: {
					filter: { _id: id },
					update: { order: index },
				},
			}));

			await Task.bulkWrite(bulkOps);
		}

		return movedTask;
	}

	async updateTaskDate(id: string, date: string, position: number) {
		await new Promise((resolve) => {
			setTimeout(resolve, SIMULATE_TASK_DELAY);
		});

		if (isNaN(position) || !isFinite(position)) {
			throw new Error("Position must be a valid number");
		}

		const movedTask = await Task.findOne({ _id: id });
		if (!movedTask) {
			throw new Error("Task not found");
		}

		const newDate = getDayDate(date);
		if (isNaN(newDate.getTime())) {
			throw new Error("Invalid date format");
		}

		movedTask.date = newDate;
		await movedTask.save();
		await this.updateTaskOrder(movedTask.id, position);

		return movedTask;
	}

	async deleteTask(id: string) {
		await new Promise((resolve) => {
			setTimeout(resolve, SIMULATE_TASK_DELAY);
		});

		const deletedTask = await Task.findByIdAndDelete(id);
		return deletedTask;
	}
}

import { Request, Response } from "express";
import { TaskService } from "../services/TaskService";

export class TaskController {
	private taskService: TaskService;

	constructor() {
		this.taskService = new TaskService();
	}

	async getTasksByMonth(req: Request, res: Response) {
		const year = parseInt(req.query.year as string, 10);
		const month = parseInt(req.query.month as string, 10);
		if (isNaN(year) || isNaN(month)) {
			return res.status(400).json({
				error: "year and month query params are required and must be numbers",
			});
		}
		try {
			const tasks = await this.taskService.getTasksByMonth(year, month);
			res.json(tasks);
		} catch (error) {
			res.status(500).json({
				error: "Failed to fetch tasks",
				details: (error as Error).message,
			});
		}
	}

	async createTask(req: Request, res: Response) {
		const { title, date } = req.body;
		try {
			const task = await this.taskService.createTask({ title, date });
			res.status(201).json(task);
		} catch (error) {
			res.status(500).json({
				error: "Failed to create task",
				details: (error as Error).message,
			});
		}
	}

	async updateTask(req: Request, res: Response) {
		const { id } = req.params;
		const { title, date, order } = req.body;
		try {
			const task = await this.taskService.updateTask(id, {
				title,
				date,
				order,
			});
			res.json(task);
		} catch (error) {
			res.status(500).json({
				error: "Failed to update task",
				details: (error as Error).message,
			});
		}
	}

	async updateTaskOrder(req: Request, res: Response) {
		const { id } = req.params;
		const { position } = req.body;
		try {
			const task = await this.taskService.updateTaskOrder(id, position);
			res.status(204).json(task);
		} catch (error) {
			res.status(500).json({
				error: "Failed to update task order",
				details: (error as Error).message,
			});
		}
	}

	async updateTaskDate(req: Request, res: Response) {
		const { id } = req.params;
		const { date, position } = req.body;
		try {
			const task = await this.taskService.updateTaskDate(id, date, position);
			res.json(task);
		} catch (error) {
			res.status(500).json({
				error: "Failed to update task date",
				details: (error as Error).message,
			});
		}
	}

	async deleteTask(req: Request, res: Response) {
		const { id } = req.params;
		try {
			const deletedTask = await this.taskService.deleteTask(id);
			res.status(200).json(deletedTask);
		} catch (error) {
			res.status(500).json({
				error: "Failed to delete task",
				details: (error as Error).message,
			});
		}
	}
}

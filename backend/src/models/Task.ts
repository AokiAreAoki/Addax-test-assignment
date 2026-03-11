import { Schema, model, Document } from "mongoose";

export interface Task extends Document {
	title: string;
	date: Date;
	order: number;
}

const TaskSchema = new Schema<Task>({
	title: { type: String, required: true },
	date: { type: Date, required: true },
	order: { type: Number, required: true },
});

export const Task = model<Task>("Task", TaskSchema);

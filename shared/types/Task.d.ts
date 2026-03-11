export interface Task {
	id: string;
	title: string;
	description?: string;
	date: string; // ISO date string (YYYY-MM-DD)
	order: number;
}

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import axios from "axios";

export interface TaskJSON {
	_id: string;
	__v: number;
	title: string;
	date: string;
	order: number;
}

export interface Task {
	_id: string;
	__v: number;
	title: string;
	date: Date;
	order: number;
}

const API_URL = "/api/tasks";

function deserialize(serializedTask: TaskJSON) {
	return {
		...serializedTask,
		date: new Date(serializedTask.date),
	};
}

export function useTasks(year: number, month: number) {
	return useQuery<Task[]>({
		queryKey: ["tasks", year, month],
		queryFn: async () => {
			const res = await axios.get<TaskJSON[]>(
				`${API_URL}?year=${year}&month=${month}`,
			);
			return res.data?.map((task) => deserialize(task));
		},
	});
}

export function useCreateTask() {
	const queryClient = useQueryClient();
	return useMutation({
		mutationFn: async (task: Omit<Task, "_id">) => {
			const { data: newTask } = await axios.post<TaskJSON>(API_URL, task);
			return deserialize(newTask);
		},
		onSuccess: (task) => {
			queryClient.invalidateQueries({
				queryKey: ["tasks", task.date.getFullYear(), task.date.getMonth()],
				exact: true,
			});
		},
	});
}

export function useUpdateTask() {
	const queryClient = useQueryClient();
	return useMutation({
		mutationFn: async (task: Task) => {
			console.log("mutating:", task);

			const { data: newTask } = await axios.put<TaskJSON>(
				`${API_URL}/${task._id}`,
				task,
			);
			return deserialize(newTask);
		},
		onSuccess: (task) => {
			console.log("on mutation success:", task);

			queryClient.invalidateQueries({
				queryKey: ["tasks", task.date.getFullYear(), task.date.getMonth()],
				exact: true,
			});
		},
	});
}

export function useUpdateTaskOrder() {
	const queryClient = useQueryClient();
	return useMutation({
		mutationFn: async ({ id, position }: { id: string; position: number }) => {
			const { data: newTask } = await axios.patch<TaskJSON>(
				`${API_URL}/${id}/order`,
				{ position },
			);
			return deserialize(newTask);
		},
		onSuccess: (task) => {
			queryClient.invalidateQueries({
				queryKey: ["tasks", task.date.getFullYear(), task.date.getMonth()],
				exact: true,
			});
		},
	});
}

export function useUpdateTaskDate() {
	const queryClient = useQueryClient();
	return useMutation({
		mutationFn: async ({
			id,
			date,
			position,
		}: {
			id: string;
			date: string | Date;
			position: number;
		}) => {
			const { data: newTask } = await axios.patch<TaskJSON>(
				`${API_URL}/${id}/date`,
				{ date: String(date), position },
			);
			return deserialize(newTask);
		},
		onSuccess: (task) => {
			queryClient.invalidateQueries({
				queryKey: ["tasks", task.date.getFullYear(), task.date.getMonth()],
				exact: true,
			});
		},
	});
}

export function useDeleteTask() {
	const queryClient = useQueryClient();
	return useMutation({
		mutationFn: async (id: string) => {
			const { data: deletedTask } = await axios.delete<TaskJSON>(
				`${API_URL}/${id}`,
			);
			console.log("deleted task:", { deletedTask });

			return deserialize(deletedTask);
		},
		onSuccess: (task) => {
			queryClient.invalidateQueries({
				queryKey: ["tasks", task.date.getFullYear(), task.date.getMonth()],
			});
		},
	});
}

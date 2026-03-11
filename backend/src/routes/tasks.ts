import { Router } from "express";
import { TaskController } from "../controllers/TaskController";

const router = Router();
const taskController = new TaskController();

router.get("/", (req, res) => taskController.getTasksByMonth(req, res));
router.post("/", (req, res) => taskController.createTask(req, res));
router.put("/:id", (req, res) => taskController.updateTask(req, res));
router.patch("/:id/order", (req, res) =>
	taskController.updateTaskOrder(req, res),
);
router.patch("/:id/date", (req, res) =>
	taskController.updateTaskDate(req, res),
);
router.delete("/:id", (req, res) => taskController.deleteTask(req, res));

export default router;

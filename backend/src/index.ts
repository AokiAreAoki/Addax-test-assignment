import cors from "cors";
import express from "express";
import mongoose from "mongoose";
import { createProxyMiddleware } from "http-proxy-middleware";
import dotenv from "dotenv";
dotenv.config();

import tasksRouter from "./routes/tasks";
import holidaysRouter from "./routes/holidays";

const PORT = process.env.PORT || 4000;
const MONGO_URI = process.env.MONGO_URI;
if (!MONGO_URI) {
	throw new Error("MONGO_URI environment variable must be specified.");
}

mongoose
	.connect(MONGO_URI)
	.then(() => console.log("MongoDB connected"))
	.catch((err) => console.error("MongoDB connection error:", err));

const app = express();
app.use(cors());
app.use(express.json());

app.use("/api/tasks", tasksRouter);
app.use("/api/holidays", holidaysRouter);

// Proxy frontend requests
app.use(
	"*",
	createProxyMiddleware({
		target: process.env.FRONTEND_URI || "http://localhost:3000",
		changeOrigin: true,
		ws: true,
		logLevel: "warn",
		// Only proxy non-API requests
		// pathRewrite: (path) => (path.startsWith("/api") ? path : "/"),
		onProxyReq: (proxyReq, req, res) => {
			// Optionally add custom headers or logic
		},
	}),
);

app.listen(PORT, () => {
	console.log(`Server running on port ${PORT}`);
});

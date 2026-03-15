import cors from "cors";
import express from "express";
import mongoose from "mongoose";
import { createProxyMiddleware } from "http-proxy-middleware";
import dotenv from "dotenv";
dotenv.config();

import tasksRouter from "./routes/tasks";
import holidaysRouter from "./routes/holidays";

const PORT = process.env.PORT || 4000;
const { MONGO_USER, MONGO_PASS, MONGO_HOST, MONGO_PORT, MONGO_DB_NAME } =
	process.env;

if (
	!MONGO_USER ||
	!MONGO_PASS ||
	!MONGO_HOST ||
	!MONGO_PORT ||
	!MONGO_DB_NAME
) {
	throw new Error(
		"MONGO_USER, MONGO_PASS, MONGO_HOST, MONGO_PORT, and MONGO_DB_NAME environment variables must be specified.",
	);
}

const MONGO_URI = `mongodb://${MONGO_USER}:${MONGO_PASS}@${MONGO_HOST}:${MONGO_PORT}/${MONGO_DB_NAME}?authSource=admin`;

mongoose
	.connect(MONGO_URI)
	.then(() => console.log("MongoDB connected"))
	.catch((err) => console.error("MongoDB connection error:", err));

const app = express();
app.use(cors());
app.use(express.json());

app.use((req, res, next) => {
	console.log(`[${new Date().toISOString()}] ${req.method} ${req.url}`);
	next();
});
app.use("/api/health", (req, res) => {
	res.status(200).json({ status: "ok" });
});

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

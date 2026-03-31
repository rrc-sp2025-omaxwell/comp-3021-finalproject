import express, { Express } from "express";
import morgan from "morgan";

// import the item routes from the new routes file
import Router from "./api/v1/routes/productRoute";

const app: Express = express();

app.use(express.json());
app.use(morgan("combined"));

// Route handler for items
app.use("/api/v1", Router);

// Health Check Interface
interface HealthCheckResponse{
        status: string,
        uptime: number,
        timestamp: string,
        version: string,
    };

// Health Check
app.get("/api/v1/health", (req, res) => {
    const healthData: HealthCheckResponse = {
        status: "OK",
        uptime: process.uptime(),
        timestamp: new Date().toISOString(),
        version: "1.0.0",
    };

    res.json(healthData);
})

// Export the app
export default app;

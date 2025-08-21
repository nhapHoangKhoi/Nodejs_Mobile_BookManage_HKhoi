import express, { Request, Response } from 'express';
import cors from "cors";
import dotenv from "dotenv";
import { connectDatabase } from './config/database';
import job from './config/cron';
// import swaggerUi from 'swagger-ui-express';
// import swaggerFile from './swagger_output.json';

// --- Cookie-parser library, BE can take request.cookies being sent from FE
//     without this library, console.log(request.cookies) => undefined
// import cookieParser from 'cookie-parser';
// --- End cookie-parser library

import adminRoutes from "./routes/admin/index.route";
// import authRoutes from "./routes/admin/auth.route";
// import bookRoutes from "./routes/book.route";

const app = express();
const port = process.env.PORT || 4000;

// Load environment variables from .env file
dotenv.config();

// Connect to database
connectDatabase();

// Cron jobs
job.start();

// Swagger UI
// app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerFile));

// CORS
app.use(cors());
// app.use(cors({
//   origin: "http://localhost:3000", // must be a particular domain name
//   credentials: true, // allow sending cookie
//   methods: ["GET", "POST", "PATCH", "DELETE"], // allowed methods
//   allowedHeaders: ["Content-Type", "Authorization"]
// }));

// allow sending data as json
app.use(express.json());

// --- Cookie-parser library, BE can take request.cookies being sent from FE
//     without this library, console.log(request.cookies) => undefined
//  => Installed library above
// app.use(cookieParser());
// app.use(cookieParser());
// --- End cookie-parser library

// --- Set up routes
app.use("/api", adminRoutes);
// app.use("/api/auth", authRoutes);
// app.use("/api/books", bookRoutes);
// --- End set up routes

app.listen(port, () => {
  console.log(`Website backend is running on port ${port}`);
});
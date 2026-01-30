import cookieParser from "cookie-parser"
import express from "express"
import cors from "cors"
import userRouter from "./routes/user.routes.js"
import taskRouter from "./routes/task.routes.js"
import prayerRoutes from "./routes/prayer.routes.js"
import challengeRouter from "./routes/challenge.routes.js"
import groupRouter from "./routes/group.routes.js"




const app=express()

// CORS configuration for development
const corsOptions = {
  origin: function (origin, callback) {
    // Allow requests with no origin (like mobile apps, curl, postman)
    if (!origin) return callback(null, true);
    // Allow localhost origins for development
    const allowedOrigins = [
      'http://localhost:5173',
      'http://localhost:5174',
      'http://localhost:5175',
      'http://127.0.0.1:5173',
      'http://127.0.0.1:5174',
      'http://127.0.0.1:5175'
    ];
    if (allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(null, true); // Allow all for dev - change in production
    }
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With']
};

app.use(cors(corsOptions));

app.use(express.json({limit:"16kb"}))
app.use(express.urlencoded({extended:true,limit:"16kb"}))
app.use(express.static("public"))
app.use(cookieParser())

app.use("/api/v1/user",userRouter)
app.use("/api/v1/task",taskRouter)
app.use("/api/v1/prayer",prayerRoutes)
app.use("/api/v1/challenge",challengeRouter)
app.use("/api/v1/group",groupRouter)

// Global error handler middleware
app.use((err, req, res, next) => {
  console.error("Error:", err);
  
  const statusCode = err.statuscode || err.statusCode || 500;
  const message = err.message || "Something went wrong";
  
  res.status(statusCode).json({
    success: false,
    message: message,
    errors: err.errors || [],
    ...(process.env.NODE_ENV === 'development' && { stack: err.stack })
  });
});

export {app}
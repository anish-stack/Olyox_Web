const express = require("express");
const dotenv = require("dotenv");
dotenv.config();
const cors = require("cors");
const cookieParser = require("cookie-parser");
const cluster = require("cluster");
const os = require("os");
const PORT = process.env.PORT || 5000;
const app = express();
const redis = require("redis");
const connectDb = require("./config/db");
const router = require("./routes/routes");
const setupBullBoard = require('./bullBoard');

// Redis client setup
const redisClient = redis.createClient({
    url: `redis://${process.env.REDIS_HOST || 'localhost'}:${process.env.REDIS_PORT || 6379}`
});

(async () => {
    redisClient.on("error", (err) => {
        console.log(err);
    });

    redisClient.on("ready", () => console.log("Redis is ready"));

    try {
        await redisClient.connect();
        await redisClient.ping();
        app.locals.redis = redisClient;
    } catch (err) {
        console.log(err);
    }
})();

// ✅ CORS Setup with credentials + subdomain support
const allowedOrigins = [
    'http://localhost:3000',
    'http://localhost:3001',
    'http://localhost:5173',
    'https://olyox.com',
    'https://www.olyox.com',
    'https://www.admin.olyox.com',
    'https://admin.olyox.com',
    /\.olyox\.com$/ // regex for subdomains
];

app.use(cors({
    origin: function (origin, callback) {
        if (!origin) return callback(null, true); // Allow non-browser tools
        if (
            allowedOrigins.includes(origin) ||
            allowedOrigins.some(pattern => pattern instanceof RegExp && pattern.test(origin))
        ) {
            callback(null, true);
        } else {
            callback(new Error('Not allowed by CORS'));
        }
    },
    credentials: true
}));

// Middlewares
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

// DB Connection
connectDb();

// Routes
app.get("/", (req, res) => {
    res.send("Hello World I am From Olyox !");
});

app.get("/Flush-all-Redis-Cached", async (req, res) => {
    try {
        const redisClient = req.app.locals.redis;

        if (!redisClient) {
            return res.status(500).json({
                success: false,
                message: "Redis client is not available.",
            });
        }

        await redisClient.flushAll();
        res.redirect("/");
    } catch (err) {
        console.log("Error in flushing Redis cache:", err);
        res.status(500).json({
            success: false,
            message: "An error occurred while clearing the Redis cache.",
            error: err.message,
        });
    }
});

app.use("/api/v1", router);

// Admin login route
app.post('/admin-login', (req, res) => {
    const { email, password } = req.body;
    const defaultEmail = process.env.ADMIN_EMAIL || "njolyox@gmail.com";
    const defaultPassword = process.env.ADMIN_PASSWORD || "jittunvn28@";

    if (email === defaultEmail && password === defaultPassword) {
        res.json({ message: 'Login successful', login: true });
    } else {
        res.status(401).json({ message: 'Invalid credentials' });
    }
});

// Error handler
app.use((err, req, res, next) => {
    if (err.name === 'ValidationError') {
        for (const field in err.errors) {
            console.log(`Validation Error on field '${field}': ${err.errors[field].message}`);
        }
        return res.status(400).json({
            success: false,
            message: 'Validation failed',
            errors: err.errors,
        });
    }

    if (!res.headersSent) {
        res.status(500).send("Something went wrong!");
    }
});

// Bull board
setupBullBoard(app);

// Cluster Setup
if (cluster.isMaster) {
    const numCores = os.cpus().length;
    console.log(`Master process is running on ${process.pid}`);
    console.log(`Forking ${numCores} workers`);

    for (let i = 0; i < numCores; i++) {
        cluster.fork();
    }

    cluster.on("exit", (worker, code, signal) => {
        console.log(`Worker ${worker.process.pid} died`);
    });
} else {
    app.listen(PORT, () => {
        console.log(`Bull Board available at http://localhost:${PORT}/admin/queues`);
        console.log('Server is running on port', PORT);
    });
}

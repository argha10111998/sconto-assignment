const express = require('express');
const dotenv = require('dotenv');
const dbConn = require('./config/db');
const authRoutes = require("./routes/auth.routes");
const walletRoutes = require("./routes/wallet.routes");
const rewardsRoutes = require("./routes/rewards.routes");
dotenv.config();



const app = express();
app.use(require("./midleware/logger.middleware"));
const PORT = process.env.PORT;
const databaseURI = process.env.MONGODB_URI;

/* =========================
   Middlewares
========================= */
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

/* =========================
   Database Connection
========================= */
async function connectDB() {
    try {
        const db = new dbConn(databaseURI);
        await db.getConnection();
        console.log("Database connected");
        

    } catch (error) {
        console.error("Database connection failed:", error);
        process.exit(1);
    }
}

/* =========================
   Routes
========================= */
// Example test route
app.get('/api/check', (req, res) => {
    console.log(req.body);
    return res.status(200).json({
        success: true,
        message: "API Works"
    });
});

app.use("/api/auth", authRoutes);
app.use("/api/wallet", walletRoutes);
app.use("/api/rewards", rewardsRoutes);

/* =========================
   Start Server
========================= */
async function startServer() {
    await connectDB();

   
    app.listen(PORT, () => {
        console.log(`Server running on port ${PORT}`);
    });
}

// JSON syntax error handler
// app.use((err, req, res, next) => {
//   if (err instanceof SyntaxError && err.status === 400 && "body" in err) {
//     return res.status(400).json({
//       message: "Invalid JSON payload",
//     });
//   }
//   next(err);
// });

app.use((req, res, next) => {
  res.status(404).json({ success: false, error: { message: "Not Found" } });
});

app.use(require("./midleware/error.middleware"));
startServer();

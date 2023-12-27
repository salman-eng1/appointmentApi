const express = require("express");
const dbConnection = require("./config/database");
const dotenv = require("dotenv");
// const mountRoutes = require("./routes");
const morgan = require("morgan");
dotenv.config(".env");
const globalError = require("./middlewares/errorMiddleware");
const profileRoute=require("./routes/profileRoute");
const appointmentRoute=require("./routes/appointmentRoute");


dbConnection(process.env.DB_URI);

const app = express();
app.use(express.json());
app.use(morgan("dev"));

// mountRoutes(app);

app.use("/api/v1/profile", profileRoute);
app.use("/api/v1/appointment", appointmentRoute);

app.all("*", (req, res, next) => {
  next(new Error(`Can't find this route: ${req.originalUrl}`, 400));
});
app.use(globalError);

const PORT = process.env.PORT;
app.listen(PORT, () => {
  console.log(`app running on port ${PORT}`);
});

import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import morgan from "morgan";
import connectDB from "./Config/Db.js";
import router from "./Routes/index.js";
import { errorHandler, notFound, requestLimiter } from "./Middleware/CommonMiddleware.js";
import { ORIGINS } from "./Constants/Constants.js";

dotenv.config();
const app = express();

app.use(cors({
    origin: ORIGINS,
    credentials: true,
}));
app.use(morgan("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(requestLimiter);
app.use("/api", router);
app.use(notFound);
app.use(errorHandler);

connectDB();
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
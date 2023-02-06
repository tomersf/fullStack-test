import express from "express";
import "express-async-errors";
import rateLimiter from "express-rate-limit";
import connectDB from "./db/connect";
import {
  morganMiddleware,
  notFoundMiddleware,
  errorHandlerMiddleware,
} from "./middlewares";
import { personsRouter } from "./routes";
import config from "./config";

const app = express();
app.use(
  rateLimiter({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 100, // limit each IP to 100 requests per windowMs
  })
);

app.use(express.json());
app.use(express.static("build"));
app.use(morganMiddleware);

app.use("/api/persons", personsRouter);

app.use(notFoundMiddleware);
app.use(errorHandlerMiddleware);

const port = config.PORT

const start = async () => {
  try {
    await connectDB(config.MONGODB_URI);
    app.listen(port, () =>
      console.log(`Server is listening on port ${port}...`)
    );
  } catch (error) {
    console.error(error);
  }
};

start();

export default app

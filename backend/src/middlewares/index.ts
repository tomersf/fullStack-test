import morgan from "morgan";
import errorHandlerMiddleware from "./error-handler";
import notFoundMiddleware from "./not-found";

morgan.token("body", (req: any) => {
  if (Object.keys(req.body).length == 0) return "";
  return JSON.stringify(req.body);
});

const morganMiddleware = morgan(
  ":method :url :status :body - :response-time ms"
);

export { morganMiddleware, errorHandlerMiddleware, notFoundMiddleware };

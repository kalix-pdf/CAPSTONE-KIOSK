import express from "express";
import cors from "cors";
import helmet from "helmet";
import morgan from "morgan";
import { initWebSocket } from "./websocket.js";

import routes from "./routes/user.routes.js";
import errorHandler from "./middlewares/error.middleware.js";

const app = express();

app.use(
  helmet({
    crossOriginResourcePolicy: { policy: "cross-origin" }
  })
);
app.use(cors(({origin: '*'})));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(morgan("dev"));

app.use('/uploads', express.static('uploads'));

app.get("/", (req, res) => {
  res.json({ message: "API is running" });
});

app.use("/api", routes);

app.use(errorHandler);

export { initWebSocket };
export default app;

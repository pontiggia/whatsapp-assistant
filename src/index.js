import express from "express";
import bodyParser from "body-parser";
import messageRoutes from "./routes/messageRoutes.js";

const app = express();
// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }));

// parse application/json
app.use(bodyParser.json());

app.use("/api/v1/message", messageRoutes);

app.listen(3000, () => {
  console.log("Server is running...");
});

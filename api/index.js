import express from "express";
import cors from "cors";
import users from "./routes/users.js";
import { configDotenv } from "dotenv";

configDotenv();

const PORT = process.env.PORT || 5050;
const app = express();

app.use(cors());
app.use(express.json());
app.use("/users", users);

// start the Express server
app.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}`);
});

const express = require("express");
if (process.env.NODE_ENV !== "production") {
  require("dotenv").config();
}
const app = express();
const port = process.env.PORT || 4000;
const dbConnect = require("./config/db");
dbConnect();

app.use(express.json());
app.use("/api/user", require("./routes/user"));
app.use("/api/assistant", require("./routes/assistant"));
app.use("/api/meeting", require("./routes/meeting"));

app.listen(port, () => {
  console.log("Server is up on port ", port);
});

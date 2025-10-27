const express = require("express");
const app = express();
const port = 3015;
const todoRoutes = require("./routes/todo.routes");
app.use(express.json());

app.get("/", (req, res) => {
  res.send("Express test");
});

app.use("/todos", todoRoutes);

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`);
});

module.exports = app;

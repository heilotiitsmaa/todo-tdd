const express = require("express");
const app = express();
const todoRoutes = require("./routes/todo.routes");

app.use(express.json());

app.get("/", (req, res) => {
  res.send("Express test");
});

app.use("/todos", todoRoutes);

app.use((error, req, res, next) => {
  res.status(500).json({ message: error.message });
});

module.exports = app;

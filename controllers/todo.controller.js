const TodoModel = require("../models/todo.models");

exports.createTodo = async (req, res, next) => {
  try {
    const createdModel = await TodoModel.create(req.body);
    res.status(201).json(createdModel);
  } catch (error) {
    console.error("Error creating todo:", error);
    res.status(500).json({ message: error.message });
  }
};

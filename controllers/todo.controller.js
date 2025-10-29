const TodoModel = require("../models/todo.models");

exports.createTodo = async (req, res, next) => {
  try {
    const createdModel = await TodoModel.create(req.body);
    res.status(201).json(createdModel);
  } catch (error) {
    next(error);
  }
};

exports.getTodos = async (req, res, next) => {
  try {
    const allTodos = await TodoModel.find({});
    res.status(200).json(allTodos);
  } catch (error) {
    next(error);
  }
};

exports.getTodoById = async (req, res, next) => {
  try {
    const todo = await TodoModel.findById(req.params.id);
    if (!todo) {
      return res.status(404).json({ message: "Todo not found" });
    }
    res.status(200).json(todo);
  } catch (error) {
    next(error);
  }
};

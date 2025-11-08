const TodoController = require("../../controllers/todo.controller");
const TodoModel = require("../../models/todo.models");
const httpMocks = require("node-mocks-http");
const newTodo = require("../mock-data/new.todo.json");
const allTodos = require("../mock-data/all-todos.json");

TodoModel.create = jest.fn();
TodoModel.find = jest.fn();
TodoModel.findById = jest.fn();
TodoModel.findByIdAndUpdate = jest.fn();
TodoModel.findByIdAndDelete = jest.fn();

let req, res, next;
const todoId = "67214bb336d09877c29877f6";

beforeEach(() => {
  req = httpMocks.createRequest();
  res = httpMocks.createResponse();
  next = jest.fn();
});

describe("TodoController.createTodo", () => {
  beforeEach(() => {
    req.body = newTodo;
  });

  it("should have a createTodo function", () => {
    expect(typeof TodoController.createTodo).toBe("function");
  });

  it("should call TodoModel.create", async () => {
    await TodoController.createTodo(req, res, next);
    expect(TodoModel.create).toHaveBeenCalledWith(newTodo);
  });

  it("should return 201 response code", async () => {
    await TodoController.createTodo(req, res, next);
    expect(res.statusCode).toBe(201);
    expect(res._isEndCalled()).toBeTruthy();
  });

  it("should return json body in response", async () => {
    TodoModel.create.mockReturnValue(newTodo);
    await TodoController.createTodo(req, res, next);
    expect(res._getJSONData()).toStrictEqual(newTodo);
  });

  it("should handle errors", async () => {
    const errorMessage = { message: "Done property missing" };
    const rejectedPromise = Promise.reject(errorMessage);
    TodoModel.create.mockReturnValue(rejectedPromise);
    await TodoController.createTodo(req, res, next);
    expect(next).toHaveBeenCalledWith(errorMessage);
  });
});

describe("TodoController.getTodos", () => {
  it("should have a getTodos function", () => {
    expect(typeof TodoController.getTodos).toBe("function");
  });

  it("should call TodoModel.find({})", async () => {
    await TodoController.getTodos(req, res, next);
    expect(TodoModel.find).toHaveBeenCalledWith({});
  });

  it("should return 200 response code and json body", async () => {
    TodoModel.find.mockReturnValue(allTodos);
    await TodoController.getTodos(req, res, next);
    expect(res.statusCode).toBe(200);
    expect(res._isEndCalled()).toBeTruthy();
    expect(res._getJSONData()).toStrictEqual(allTodos);
  });

  it("should handle errors", async () => {
    const errorMessage = { message: "Error finding todos" };
    const rejectedPromise = Promise.reject(errorMessage);
    TodoModel.find.mockReturnValue(rejectedPromise);
    await TodoController.getTodos(req, res, next);
    expect(next).toHaveBeenCalledWith(errorMessage);
  });
});

describe("TodoController.getTodoById", () => {
  beforeEach(() => {
    req.params.id = todoId;
  });

  it("should have a getTodoById function", () => {
    expect(typeof TodoController.getTodoById).toBe("function");
  });

  it("should call TodoModel.findById with route params", async () => {
    await TodoController.getTodoById(req, res, next);
    expect(TodoModel.findById).toHaveBeenCalledWith(todoId);
  });

  it("should return json body and response code 200", async () => {
    TodoModel.findById.mockReturnValue(newTodo);
    await TodoController.getTodoById(req, res, next);
    expect(res.statusCode).toBe(200);
    expect(res._isEndCalled()).toBeTruthy();
    expect(res._getJSONData()).toStrictEqual(newTodo);
  });

  it("should handle errors", async () => {
    const errorMessage = { message: "Error finding todo" };
    const rejectedPromise = Promise.reject(errorMessage);
    TodoModel.findById.mockReturnValue(rejectedPromise);
    await TodoController.getTodoById(req, res, next);
    expect(next).toHaveBeenCalledWith(errorMessage);
  });

  it("should return 404 when todo doesn't exist", async () => {
    TodoModel.findById.mockReturnValue(null);
    await TodoController.getTodoById(req, res, next);
    expect(res.statusCode).toBe(404);
    expect(res._isEndCalled()).toBeTruthy();
  });
});

describe("TodoController.updateTodo", () => {
  beforeEach(() => {
    req.params.id = todoId;
    req.body = newTodo;
  });

  it("should have a updateTodo function", () => {
    expect(typeof TodoController.updateTodo).toBe("function");
  });

  it("should call TodoModel.findByIdAndUpdate", async () => {
    await TodoController.updateTodo(req, res, next);
    expect(TodoModel.findByIdAndUpdate).toHaveBeenCalledWith(todoId, newTodo, {
      new: true,
      useFindAndModify: false,
    });
  });

  it("should return json body and response code 200", async () => {
    TodoModel.findByIdAndUpdate.mockReturnValue(newTodo);
    await TodoController.updateTodo(req, res, next);
    expect(res.statusCode).toBe(200);
    expect(res._isEndCalled()).toBeTruthy();
    expect(res._getJSONData()).toStrictEqual(newTodo);
  });

  it("should handle errors", async () => {
    const errorMessage = { message: "Error updating todo" };
    const rejectedPromise = Promise.reject(errorMessage);
    TodoModel.findByIdAndUpdate.mockReturnValue(rejectedPromise);
    await TodoController.updateTodo(req, res, next);
    expect(next).toHaveBeenCalledWith(errorMessage);
  });

  it("should return 404 when todo doesn't exist", async () => {
    TodoModel.findByIdAndUpdate.mockReturnValue(null);
    await TodoController.updateTodo(req, res, next);
    expect(res.statusCode).toBe(404);
    expect(res._isEndCalled()).toBeTruthy();
  });
});

describe("TodoController.deleteTodo", () => {
  beforeEach(() => {
    req.params.id = todoId;
  });

  it("should have a deleteTodo function", () => {
    expect(typeof TodoController.deleteTodo).toBe("function");
  });

  it("should call TodoModel.findByIdAndDelete", async () => {
    await TodoController.deleteTodo(req, res, next);
    expect(TodoModel.findByIdAndDelete).toHaveBeenCalledWith(todoId);
  });

  it("should return json body and response code 200", async () => {
    TodoModel.findByIdAndDelete.mockReturnValue(newTodo);
    await TodoController.deleteTodo(req, res, next);
    expect(res.statusCode).toBe(200);
    expect(res._isEndCalled()).toBeTruthy();
    expect(res._getJSONData()).toStrictEqual({
      message: "Todo deleted successfully",
    });
  });

  it("should handle errors", async () => {
    const errorMessage = { message: "Error deleting todo" };
    const rejectedPromise = Promise.reject(errorMessage);
    TodoModel.findByIdAndDelete.mockReturnValue(rejectedPromise);
    await TodoController.deleteTodo(req, res, next);
    expect(next).toHaveBeenCalledWith(errorMessage);
  });

  it("should return 404 when todo doesn't exist", async () => {
    TodoModel.findByIdAndDelete.mockReturnValue(null);
    await TodoController.deleteTodo(req, res, next);
    expect(res.statusCode).toBe(404);
    expect(res._isEndCalled()).toBeTruthy();
  });
});

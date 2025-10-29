const request = require("supertest");
const app = require("../../app");
const newTodo = require("../mock-data/new.todo.json");
const mongoose = require("mongoose");
const mongodb = require("../../mongodb/mongodb.connect");

let endpoint = "/todos/";
let firstTodo;
let newTodoId;
const testData = { title: "Updated todo", done: true };
const nonExistentId = "67214bb336d09877c2987999";

beforeAll(async () => {
  await mongodb.connect();
}, 10000);

afterAll(async () => {
  await mongoose.connection.close();
}, 10000);

describe(endpoint, () => {
  it("POST " + endpoint, async () => {
    const response = await request(app).post(endpoint).send(newTodo);

    expect(response.statusCode).toBe(201);
    expect(response.body.title).toBe(newTodo.title);
    expect(response.body.done).toBe(newTodo.done);
  });

  it("should return error 500 on malformed data", async () => {
    const response = await request(app)
      .post(endpoint)
      .send({ title: "Missing done property" });

    expect(response.statusCode).toBe(500);
    expect(response.body).toStrictEqual({
      message: "Todo validation failed: done: Path `done` is required.",
    });
  });

  it("GET " + endpoint, async () => {
    const response = await request(app).get(endpoint);
    expect(response.statusCode).toBe(200);
    expect(Array.isArray(response.body)).toBeTruthy();
  });

  it("GET " + endpoint + " should return todos", async () => {
    const response = await request(app).get(endpoint);
    expect(response.statusCode).toBe(200);
    expect(Array.isArray(response.body)).toBeTruthy();
    expect(response.body[0].title).toBeDefined();
    expect(response.body[0].done).toBeDefined();
    firstTodo = response.body[0];
  });

  it("GET " + endpoint + ":id should return todo by id", async () => {
    const response = await request(app).get(endpoint + firstTodo._id);
    expect(response.statusCode).toBe(200);
    expect(response.body.title).toBe(firstTodo.title);
    expect(response.body.done).toBe(firstTodo.done);
  });

  it(
    "GET " + endpoint + ":id should return 404 when todo not found",
    async () => {
      const response = await request(app).get(endpoint + nonExistentId);
      expect(response.statusCode).toBe(404);
    }
  );

  it(
    "PUT " + endpoint + " should create new todo for update test",
    async () => {
      const response = await request(app).post(endpoint).send(newTodo);
      expect(response.statusCode).toBe(201);
      newTodoId = response.body._id;
    }
  );

  it("PUT " + endpoint + ":id should update todo", async () => {
    const response = await request(app)
      .put(endpoint + newTodoId)
      .send(testData);
    expect(response.statusCode).toBe(200);
    expect(response.body.title).toBe(testData.title);
    expect(response.body.done).toBe(testData.done);
  });

  it(
    "PUT " + endpoint + ":id should return 404 when todo not found",
    async () => {
      const response = await request(app)
        .put(endpoint + nonExistentId)
        .send(testData);
      expect(response.statusCode).toBe(404);
    }
  );
});

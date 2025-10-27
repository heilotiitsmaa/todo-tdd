const request = require("supertest");
const app = require("../../app");
const newTodo = require("../mock-data/new.todo.json");
const mongoose = require("mongoose");
const mongodb = require("../../mongodb/mongodb.connect");

let endpoint = "/todos/";

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
});

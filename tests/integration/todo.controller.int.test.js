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

    console.log("Response:", response.body);
    expect(response.statusCode).toBe(201);
    expect(response.body.title).toBe(newTodo.title);
    expect(response.body.done).toBe(newTodo.done);
  });
});

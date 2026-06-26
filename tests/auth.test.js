require("dotenv").config();

const request = require("supertest");
const chai = require("chai");
const mongoose = require("mongoose");

const expect = chai.expect;

const app = require("../app");
const connectDB = require("../config/db");

describe("Auth API Tests", function () {
  this.timeout(10000);

  before(async () => {
    await connectDB();
  });

  after(async () => {
    await mongoose.connection.close();
  });

  it("should register a new user", async () => {
    const email = `user${Date.now()}@test.com`;

    const res = await request(app).post("/auth/register").send({
      name: "Naina",
      email,
      password: "123456",
    });

    expect(res.status).to.equal(201);
    expect(res.body).to.have.property("message");
    expect(res.body).to.have.property("token");
    expect(res.body).to.have.property("user");
    expect(res.body.user.email).to.equal(email);
  });

  it("should login successfully", async () => {
    const email = `user${Date.now()}@test.com`;

    await request(app).post("/auth/register").send({
      name: "Naina",
      email,
      password: "123456",
    });

    const res = await request(app).post("/auth/login").send({
      email,
      password: "123456",
    });

    expect(res.status).to.equal(200);
    expect(res.body).to.have.property("token");
    expect(res.body.message).to.equal("Login successful");
    expect(res.body.user.email).to.equal(email);
  });

  it("should return 400 if email does not exist", async () => {
    const res = await request(app).post("/auth/login").send({
      email: "unknown@test.com",
      password: "123456",
    });

    expect(res.status).to.equal(400);
    expect(res.body.message).to.equal("Invalid Email");
  });

  it("should return 400 if password is incorrect", async () => {
    const email = `user${Date.now()}@test.com`;

    await request(app).post("/auth/register").send({
      name: "Naina",
      email,
      password: "123456",
    });

    const res = await request(app).post("/auth/login").send({
      email,
      password: "wrongpassword",
    });

    expect(res.status).to.equal(400);
    expect(res.body.message).to.equal("Invalid Password");
  });
});

require("dotenv").config();

const request = require("supertest");
const chai = require("chai");
const mongoose = require("mongoose");

const expect = chai.expect;

const app = require("../app");
const connectDB = require("../config/db");

describe("Subscription API Tests", function () {
  this.timeout(10000);

  let token;
  let subscriptionId;

  before(async () => {
    await connectDB();

    const email = `user${Date.now()}@test.com`;

    const register = await request(app)
      .post("/auth/register")
      .send({
        name: "Naina",
        email,
        password: "123456",
      });

    token = register.body.token;
  });

  after(async () => {
    await mongoose.connection.close();
  });

  // CREATE
  it("should create a subscription", async () => {
    const res = await request(app)
      .post("/subscriptions")
      .set("Authorization", `Bearer ${token}`)
      .send({
        name: "Netflix",
        price: 100,
        billingCycle: "monthly",
      });

    expect(res.status).to.equal(201);
    expect(res.body).to.have.property("subscription");

    subscriptionId = res.body.subscription._id;
  });

  // GET ALL
  it("should get all subscriptions", async () => {
    const res = await request(app)
      .get("/subscriptions")
      .set("Authorization", `Bearer ${token}`);

    expect(res.status).to.equal(200);
    expect(res.body).to.have.property("subscriptions");
  });

  // GET ONE
  it("should get one subscription", async () => {
    const res = await request(app)
      .get(`/subscriptions/${subscriptionId}`)
      .set("Authorization", `Bearer ${token}`);

    expect(res.status).to.equal(200);
    expect(res.body.subscription.name).to.equal("Netflix");
  });

  // UPDATE
  it("should update subscription", async () => {
    const res = await request(app)
      .put(`/subscriptions/${subscriptionId}`)
      .set("Authorization", `Bearer ${token}`)
      .send({
        name: "Spotify",
        price: 120,
        billingCycle: "yearly",
      });

    expect(res.status).to.equal(200);
    expect(res.body.subscription.name).to.equal("Spotify");
    expect(res.body.subscription.price).to.equal(120);
    expect(res.body.subscription.billingCycle).to.equal("yearly");
  });

  // DELETE
  it("should delete subscription", async () => {
    const res = await request(app)
      .delete(`/subscriptions/${subscriptionId}`)
      .set("Authorization", `Bearer ${token}`);

    expect(res.status).to.equal(200);
    expect(res.body.message).to.equal("Subscription deleted");
  });

  // NO TOKEN
  it("should return 401 without token", async () => {
    const res = await request(app)
      .post("/subscriptions")
      .send({
        name: "Netflix",
        price: 100,
        billingCycle: "monthly",
      });

    expect(res.status).to.equal(401);
  });

  // MISSING FIELD
  it("should return 400 if fields are missing", async () => {
    const res = await request(app)
      .post("/subscriptions")
      .set("Authorization", `Bearer ${token}`)
      .send({
        name: "Netflix",
      });

    expect(res.status).to.equal(400);
  });

  // INVALID PRICE
  it("should reject negative price", async () => {
    const res = await request(app)
      .post("/subscriptions")
      .set("Authorization", `Bearer ${token}`)
      .send({
        name: "Netflix",
        price: -100,
        billingCycle: "monthly",
      });

    expect(res.status).to.equal(400);
  });
});
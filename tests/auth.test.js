// import supertest
const request = require("supertest");
const chai = require("chai");

const expect = chai.expect;

const app = require("./app");

describe("POST/auth/login", () => {
  it("should return 400 if email not found", async () => {
    const res = await request(app)
      .post("/auth/login")
      .send({ email: "wrong@test.com", password: "123456" });

    expect(res.status).to.equal(400);

    it("should register new user", async () => {
      const res = await request(app)
      .post("./auth/register")
      .send({
        name: "Naina",
        email: "naina@gmail.com",
        password: "123456",
      });
      expect(res.status).to.equal(201);

      expect(res.body).to.have.property("token");
    });
  });
});

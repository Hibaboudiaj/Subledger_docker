const chai = require("chai");
const expect = chai.expect;

const sum = (n1, n2) => {
  return n1 + n2;
};

describe("checking sum result", () => {
  it("check result", () => {
    expect(sum(1, 2)).to.equal(9);
  });
});

// supertest katisti endoints 
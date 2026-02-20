const request = require("supertest");
const app = require("../src/app");

describe("Auth validation", () => {
  it("rejects signup with invalid email", async () => {
    const response = await request(app).post("/api/auth/signup").send({
      email: "not-an-email",
      password: "123456",
      fullName: "Test User",
    });

    expect(response.status).toBe(400);
    expect(response.body.success).toBe(false);
  });

  it("rejects login with empty password", async () => {
    const response = await request(app).post("/api/auth/login").send({
      email: "test@example.com",
      password: "",
    });

    expect(response.status).toBe(400);
    expect(response.body.success).toBe(false);
  });
});

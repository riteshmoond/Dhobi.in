const request = require("supertest");
const app = require("../src/app");
const {
  connectTestDb,
  clearTestDb,
  disconnectTestDb,
} = require("./helpers/db");

describe("Auth integration", () => {
  beforeAll(async () => {
    await connectTestDb();
  });

  beforeEach(async () => {
    await clearTestDb();
  });

  afterAll(async () => {
    await disconnectTestDb();
  });

  it("signs up customer and returns access + refresh tokens", async () => {
    const response = await request(app).post("/api/auth/signup").send({
      email: "user1@test.com",
      password: "123456",
      fullName: "User One",
    });

    expect(response.status).toBe(201);
    expect(response.body.success).toBe(true);
    expect(response.body.data.user.email).toBe("user1@test.com");
    expect(typeof response.body.data.token).toBe("string");
    expect(typeof response.body.data.refreshToken).toBe("string");
  });

  it("returns current user profile from access token", async () => {
    const signup = await request(app).post("/api/auth/signup").send({
      email: "profile@test.com",
      password: "123456",
      fullName: "Profile User",
    });

    const me = await request(app)
      .get("/api/auth/me")
      .set("Authorization", `Bearer ${signup.body.data.token}`);

    expect(me.status).toBe(200);
    expect(me.body.success).toBe(true);
    expect(me.body.data.user.email).toBe("profile@test.com");
    expect(me.body.data.user.role).toBe("customer");
  });

  it("refreshes access token and supports logout revocation", async () => {
    const signup = await request(app).post("/api/auth/signup").send({
      email: "user2@test.com",
      password: "123456",
      fullName: "User Two",
    });

    const refreshToken = signup.body.data.refreshToken;

    const refresh = await request(app).post("/api/auth/refresh").send({ refreshToken });
    expect(refresh.status).toBe(200);
    expect(typeof refresh.body.data.token).toBe("string");

    const logout = await request(app).post("/api/auth/logout").send({ refreshToken });
    expect(logout.status).toBe(200);

    const refreshAfterLogout = await request(app)
      .post("/api/auth/refresh")
      .send({ refreshToken });
    expect(refreshAfterLogout.status).toBe(401);
  });
});

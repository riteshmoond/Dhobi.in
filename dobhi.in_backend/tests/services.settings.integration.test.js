const request = require("supertest");
const app = require("../src/app");
const {
  connectTestDb,
  clearTestDb,
  disconnectTestDb,
} = require("./helpers/db");

describe("Services and settings integration", () => {
  let customerToken;
  let adminToken;

  beforeAll(async () => {
    await connectTestDb();
  });

  beforeEach(async () => {
    await clearTestDb();

    const customerSignup = await request(app).post("/api/auth/signup").send({
      email: "svc-customer@test.com",
      password: "123456",
      fullName: "Service Customer",
    });
    customerToken = customerSignup.body.data.token;

    const adminLogin = await request(app).post("/api/auth/admin/login").send({
      email: "admin@dhobi.in",
      password: "admin123",
    });
    adminToken = adminLogin.body.data.token;
  });

  afterAll(async () => {
    await disconnectTestDb();
  });

  it("returns public services list", async () => {
    const response = await request(app).get("/api/services");

    expect(response.status).toBe(200);
    expect(response.body.success).toBe(true);
    expect(Array.isArray(response.body.data.services)).toBe(true);
  });

  it("blocks customer from replacing services", async () => {
    const response = await request(app)
      .put("/api/services")
      .set("Authorization", `Bearer ${customerToken}`)
      .send({ services: [] });

    expect(response.status).toBe(403);
  });

  it("allows admin to replace services", async () => {
    const response = await request(app)
      .put("/api/services")
      .set("Authorization", `Bearer ${adminToken}`)
      .send({
        services: [
          {
            id: "M1009",
            name: "Men Blazer",
            unit: "Dry Clean",
            price: 120,
            category: "men",
            popular: true,
            active: true,
          },
        ],
      });

    expect(response.status).toBe(200);
    expect(response.body.success).toBe(true);
    expect(response.body.data.services[0].name).toBe("Men Blazer");
  });

  it("blocks customer from updating settings", async () => {
    const response = await request(app)
      .put("/api/settings")
      .set("Authorization", `Bearer ${customerToken}`)
      .send({ minOrderValue: 300 });

    expect(response.status).toBe(403);
  });

  it("allows admin to update settings", async () => {
    const response = await request(app)
      .put("/api/settings")
      .set("Authorization", `Bearer ${adminToken}`)
      .send({ minOrderValue: 350, deliveryCharge: 60 });

    expect(response.status).toBe(200);
    expect(response.body.success).toBe(true);
    expect(response.body.data.settings.minOrderValue).toBe(350);
    expect(response.body.data.settings.deliveryCharge).toBe(60);
  });
});

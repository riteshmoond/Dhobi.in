const request = require("supertest");
const app = require("../src/app");
const {
  connectTestDb,
  clearTestDb,
  disconnectTestDb,
} = require("./helpers/db");

describe("Role and permission checks", () => {
  let customerToken;
  let adminToken;

  beforeAll(async () => {
    await connectTestDb();
  });

  beforeEach(async () => {
    await clearTestDb();

    const customerSignup = await request(app).post("/api/auth/signup").send({
      email: "rbac-customer@test.com",
      password: "123456",
      fullName: "RBAC Customer",
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

  it("blocks customer from admin-only orders endpoint", async () => {
    const response = await request(app)
      .get("/api/orders/admin/all")
      .set("Authorization", `Bearer ${customerToken}`);

    expect(response.status).toBe(403);
  });

  it("allows admin on admin-only orders endpoint", async () => {
    const response = await request(app)
      .get("/api/orders/admin/all")
      .set("Authorization", `Bearer ${adminToken}`);

    expect(response.status).toBe(200);
    expect(Array.isArray(response.body.data.orders)).toBe(true);
  });

  it("blocks customer from updating settings", async () => {
    const response = await request(app)
      .put("/api/settings")
      .set("Authorization", `Bearer ${customerToken}`)
      .send({ minOrderValue: 300 });

    expect(response.status).toBe(403);
  });

  it("blocks customer from admin order update endpoint", async () => {
    const createOrder = await request(app)
      .post("/api/orders")
      .set("Authorization", `Bearer ${customerToken}`)
      .send({
        items: [{ id: "M1003", name: "Men Shirt", price: 40, qty: 2, unit: "Wash & Iron" }],
        subtotal: 80,
        deliveryCharge: 50,
        rushDelivery: false,
        rushDeliveryCharge: 0,
        total: 210,
        paymentMethod: "cod",
        paymentInfo: { method: "cod" },
        address: {
          fullName: "RBAC Customer",
          phone: "9999999999",
          address: "Street 2",
          city: "Noida",
          pincode: "201301",
        },
      });

    expect(createOrder.status).toBe(201);
    const orderId = createOrder.body.data.order.id;

    const response = await request(app)
      .patch(`/api/orders/admin/${orderId}`)
      .set("Authorization", `Bearer ${customerToken}`)
      .send({ trackingStep: 1 });

    expect(response.status).toBe(403);
  });
});

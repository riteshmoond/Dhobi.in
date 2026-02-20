const request = require("supertest");
const app = require("../src/app");
const {
  connectTestDb,
  clearTestDb,
  disconnectTestDb,
} = require("./helpers/db");

describe("Order and rating integration", () => {
  let customerToken;
  let adminToken;
  let createdOrderId;

  beforeAll(async () => {
    await connectTestDb();
  });

  beforeEach(async () => {
    await clearTestDb();

    const customerSignup = await request(app).post("/api/auth/signup").send({
      email: "shopper@test.com",
      password: "123456",
      fullName: "Shopper",
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

  it("creates order, blocks early rating, allows delivered rating once", async () => {
    const orderCreate = await request(app)
      .post("/api/orders")
      .set("Authorization", `Bearer ${customerToken}`)
      .send({
        items: [{ id: "M1001", name: "Men Shirt", price: 30, qty: 2, unit: "Wash & Iron" }],
        subtotal: 60,
        deliveryCharge: 50,
        rushDelivery: false,
        rushDeliveryCharge: 0,
        total: 210,
        paymentMethod: "cod",
        paymentInfo: { method: "cod" },
        address: {
          fullName: "Shopper",
          phone: "9999999999",
          address: "Street 1",
          city: "Noida",
          pincode: "201301",
        },
      });

    expect(orderCreate.status).toBe(201);
    createdOrderId = orderCreate.body.data.order.id;

    const ratingTooEarly = await request(app)
      .post("/api/ratings")
      .set("Authorization", `Bearer ${customerToken}`)
      .send({ orderId: createdOrderId, rating: 5, review: "Great" });

    expect(ratingTooEarly.status).toBe(400);

    const markDelivered = await request(app)
      .patch(`/api/orders/admin/${createdOrderId}/status`)
      .set("Authorization", `Bearer ${adminToken}`)
      .send({ trackingStep: 5 });

    expect(markDelivered.status).toBe(200);

    const ratingSuccess = await request(app)
      .post("/api/ratings")
      .set("Authorization", `Bearer ${customerToken}`)
      .send({ orderId: createdOrderId, rating: 5, review: "Great service" });

    expect(ratingSuccess.status).toBe(201);

    const duplicateRating = await request(app)
      .post("/api/ratings")
      .set("Authorization", `Bearer ${customerToken}`)
      .send({ orderId: createdOrderId, rating: 4, review: "Second attempt" });

    expect(duplicateRating.status).toBe(409);
  });

  it("allows admin to update order details", async () => {
    const orderCreate = await request(app)
      .post("/api/orders")
      .set("Authorization", `Bearer ${customerToken}`)
      .send({
        items: [{ id: "M1002", name: "Men Pant", price: 40, qty: 2, unit: "Wash & Iron" }],
        subtotal: 80,
        deliveryCharge: 50,
        rushDelivery: false,
        rushDeliveryCharge: 0,
        total: 210,
        paymentMethod: "cod",
        paymentInfo: { method: "cod" },
        address: {
          fullName: "Shopper",
          phone: "9999999999",
          address: "Street 1",
          city: "Noida",
          pincode: "201301",
        },
      });

    expect(orderCreate.status).toBe(201);
    const orderId = orderCreate.body.data.order.id;

    const updated = await request(app)
      .patch(`/api/orders/admin/${orderId}`)
      .set("Authorization", `Bearer ${adminToken}`)
      .send({
        trackingStep: 2,
        paymentMethod: "upi",
        address: {
          city: "Delhi",
        },
      });

    expect(updated.status).toBe(200);
    expect(updated.body.data.order.trackingStep).toBe(2);
    expect(updated.body.data.order.status).toBe("Drying");
    expect(updated.body.data.order.paymentMethod).toBe("upi");
    expect(updated.body.data.order.address.city).toBe("Delhi");
  });

  it("includes registered customer in admin customers list", async () => {
    const customers = await request(app)
      .get("/api/customers")
      .set("Authorization", `Bearer ${adminToken}`);

    expect(customers.status).toBe(200);
    expect(Array.isArray(customers.body.data.customers)).toBe(true);
    expect(
      customers.body.data.customers.some((c) => c.email === "shopper@test.com")
    ).toBe(true);
  });
});

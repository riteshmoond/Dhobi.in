const { z } = require("zod");

const categoryEnum = z.enum(["men", "female", "kids"]);
const paymentMethodEnum = z.enum(["cod", "upi", "card", "netbanking"]);

const loginSchema = z.object({
  email: z.string().trim().email(),
  password: z.string().min(1),
});

const signupSchema = z.object({
  email: z.string().trim().email(),
  password: z.string().min(6),
  fullName: z.string().trim().min(1),
});

const refreshTokenSchema = z.object({
  refreshToken: z.string().min(20),
});

const createServiceSchema = z.object({
  name: z.string().trim().min(1),
  unit: z.string().trim().optional(),
  price: z.coerce.number().min(0),
  img: z.string().trim().optional(),
  popular: z.boolean().optional(),
  category: categoryEnum,
  active: z.boolean().optional(),
});

const replaceServicesSchema = z.object({
  services: z.array(
    z.object({
      id: z.string().trim().optional(),
      code: z.string().trim().optional(),
      name: z.string().trim().min(1),
      unit: z.string().trim().optional(),
      price: z.coerce.number().min(0),
      img: z.string().trim().optional(),
      popular: z.boolean().optional(),
      category: categoryEnum,
      active: z.boolean().optional(),
    })
  ),
});

const updateServiceSchema = z
  .object({
    name: z.string().trim().min(1).optional(),
    unit: z.string().trim().optional(),
    price: z.coerce.number().min(0).optional(),
    img: z.string().trim().optional(),
    popular: z.boolean().optional(),
    category: categoryEnum.optional(),
    active: z.boolean().optional(),
  })
  .refine((obj) => Object.keys(obj).length > 0, {
    message: "At least one field is required",
  });

const updateSettingsSchema = z.object({
  deliveryCharge: z.coerce.number().min(0).optional(),
  minOrderValue: z.coerce.number().min(0).optional(),
  businessHours: z.string().optional(),
  serviceArea: z.string().optional(),
  brandName: z.string().trim().min(1).optional(),
  logoUrl: z.string().trim().optional(),
  supportPhone: z.string().trim().optional(),
  supportEmail: z.string().trim().email().optional(),
  supportAddress: z.string().trim().optional(),
  rushDeliveryEnabled: z.boolean().optional(),
  rushDeliveryCharge: z.coerce.number().min(0).optional(),
  ordersEnabled: z.boolean().optional(),
  categoryVisibility: z
    .object({
      men: z.boolean().optional(),
      female: z.boolean().optional(),
      kids: z.boolean().optional(),
    })
    .optional(),
  paymentMethods: z
    .object({
      cod: z.boolean().optional(),
      upi: z.boolean().optional(),
      card: z.boolean().optional(),
      netbanking: z.boolean().optional(),
    })
    .optional(),
});

const orderItemSchema = z.object({
  id: z.union([z.string(), z.number()]).optional(),
  serviceCode: z.union([z.string(), z.number()]).optional(),
  name: z.string().trim().min(1),
  price: z.coerce.number().min(0),
  qty: z.coerce.number().int().min(1),
  unit: z.string().trim().optional(),
});

const createOrderSchema = z.object({
  items: z.array(orderItemSchema).min(1),
  subtotal: z.coerce.number().min(0),
  deliveryCharge: z.coerce.number().min(0),
  rushDelivery: z.boolean().optional(),
  rushDeliveryCharge: z.coerce.number().min(0),
  total: z.coerce.number().min(0),
  paymentMethod: paymentMethodEnum,
  paymentInfo: z.record(z.string(), z.any()).optional(),
  address: z.object({
    fullName: z.string().trim().min(1),
    phone: z.string().trim().min(10),
    address: z.string().trim().min(1),
    city: z.string().trim().min(1),
    pincode: z.string().trim().min(4),
  }),
});

const updateOrderStatusSchema = z.object({
  trackingStep: z.coerce.number().int().min(0).max(5),
});

const adminUpdateOrderSchema = z
  .object({
    paymentMethod: paymentMethodEnum.optional(),
    paymentInfo: z.record(z.string(), z.any()).optional(),
    address: z
      .object({
        fullName: z.string().trim().min(1).optional(),
        phone: z.string().trim().min(10).optional(),
        address: z.string().trim().min(1).optional(),
        city: z.string().trim().min(1).optional(),
        pincode: z.string().trim().min(4).optional(),
      })
      .optional(),
    trackingStep: z.coerce.number().int().min(0).max(5).optional(),
  })
  .refine((obj) => Object.keys(obj).length > 0, {
    message: "At least one field is required",
  });

const createRatingSchema = z.object({
  orderId: z.coerce.number().int().positive(),
  rating: z.coerce.number().int().min(1).max(5),
  review: z.string().max(2000).optional(),
});

const createContactSchema = z.object({
  name: z.string().trim().min(1),
  email: z.string().trim().email(),
  phone: z.string().trim().optional(),
  message: z.string().trim().min(1).max(5000),
});

const updateContactStatusSchema = z.object({
  status: z.enum(["new", "read", "resolved"]),
});

const replyContactSchema = z.object({
  replyMessage: z.string().trim().min(1).max(5000),
});

module.exports = {
  loginSchema,
  signupSchema,
  refreshTokenSchema,
  createServiceSchema,
  replaceServicesSchema,
  updateServiceSchema,
  updateSettingsSchema,
  createOrderSchema,
  updateOrderStatusSchema,
  adminUpdateOrderSchema,
  createRatingSchema,
  createContactSchema,
  updateContactStatusSchema,
  replyContactSchema,
};

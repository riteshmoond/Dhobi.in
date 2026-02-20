const Service = require("../models/service.model");
const { successResponse, errorResponse } = require("../utils/apiResponse");
const { DEFAULT_SERVICES } = require("../utils/defaults");

const mapService = (service) => ({
  id: service.code,
  name: service.name,
  unit: service.unit,
  price: service.price,
  img: service.img,
  popular: Boolean(service.popular),
  category: service.category,
  active: Boolean(service.active),
  createdAt: service.createdAt,
  updatedAt: service.updatedAt,
});

const ensureDefaultServices = async () => {
  const existing = await Service.find({}, { code: 1 }).lean();
  const existingCodes = new Set(existing.map((item) => String(item.code || "").trim()));
  const missingDefaults = DEFAULT_SERVICES.filter(
    (service) => !existingCodes.has(String(service.code || "").trim())
  );

  if (missingDefaults.length === 0) return;
  await Service.insertMany(missingDefaults, { ordered: false });
};

const getServices = async (req, res) => {
  await ensureDefaultServices();

  const category = String(req.query.category || "").trim();
  const filter = { active: true };
  if (["men", "female", "kids"].includes(category)) {
    filter.category = category;
  }

  const services = await Service.find(filter).sort({ createdAt: -1 });

  return res.status(200).json(
    successResponse({
      services: services.map(mapService),
    })
  );
};

const createService = async (req, res) => {
  const name = String(req.body?.name || "").trim();
  const category = String(req.body?.category || "").trim();

  if (!name) {
    return res.status(400).json(errorResponse("Service name is required"));
  }

  if (!["men", "female", "kids"].includes(category)) {
    return res.status(400).json(errorResponse("Invalid category"));
  }

  const prefix = category === "female" ? "F" : category === "kids" ? "K" : "M";
  const code = `${prefix}${Date.now()}`;

  const service = await Service.create({
    code,
    name,
    unit: String(req.body?.unit || "Wash & Iron").trim() || "Wash & Iron",
    price: Number(req.body?.price) || 0,
    img: String(req.body?.img || "").trim(),
    popular: Boolean(req.body?.popular),
    category,
    active: req.body?.active !== false,
  });

  return res.status(201).json(successResponse({ service: mapService(service) }));
};

const replaceServices = async (req, res) => {
  const incoming = Array.isArray(req.body?.services) ? req.body.services : null;
  if (!incoming) {
    return res.status(400).json(errorResponse("services array is required"));
  }

  const normalized = incoming
    .map((service, idx) => {
      const category = String(service?.category || "").trim();
      if (!["men", "female", "kids"].includes(category)) return null;

      const name = String(service?.name || "").trim();
      if (!name) return null;

      const code = String(service?.id || service?.code || "").trim();
      const prefix = category === "female" ? "F" : category === "kids" ? "K" : "M";

      return {
        code: code || `${prefix}${Date.now()}${idx}`,
        name,
        unit: String(service?.unit || "Wash & Iron").trim() || "Wash & Iron",
        price: Number(service?.price) || 0,
        img: String(service?.img || "").trim(),
        popular: Boolean(service?.popular),
        category,
        active: service?.active !== false,
      };
    })
    .filter(Boolean);

  await Service.deleteMany({});
  if (normalized.length > 0) {
    await Service.insertMany(normalized);
  }
  await ensureDefaultServices();

  const services = await Service.find().sort({ createdAt: -1 });
  return res.status(200).json(
    successResponse({
      services: services.map(mapService),
    })
  );
};

const updateService = async (req, res) => {
  const code = String(req.params.id || "").trim();
  const service = await Service.findOne({ code });

  if (!service) {
    return res.status(404).json(errorResponse("Service not found"));
  }

  if (req.body?.name !== undefined) service.name = String(req.body.name || "").trim();
  if (req.body?.unit !== undefined) service.unit = String(req.body.unit || "").trim();
  if (req.body?.price !== undefined) service.price = Number(req.body.price) || 0;
  if (req.body?.img !== undefined) service.img = String(req.body.img || "").trim();
  if (req.body?.popular !== undefined) service.popular = Boolean(req.body.popular);
  if (req.body?.active !== undefined) service.active = Boolean(req.body.active);

  if (req.body?.category !== undefined) {
    const nextCategory = String(req.body.category || "").trim();
    if (!["men", "female", "kids"].includes(nextCategory)) {
      return res.status(400).json(errorResponse("Invalid category"));
    }
    service.category = nextCategory;
  }

  await service.save();

  return res.status(200).json(successResponse({ service: mapService(service) }));
};

const deleteService = async (req, res) => {
  const code = String(req.params.id || "").trim();
  const deleted = await Service.findOneAndDelete({ code });

  if (!deleted) {
    return res.status(404).json(errorResponse("Service not found"));
  }

  return res.status(200).json(successResponse({ id: code }, "Service deleted"));
};

module.exports = {
  getServices,
  createService,
  replaceServices,
  updateService,
  deleteService,
};

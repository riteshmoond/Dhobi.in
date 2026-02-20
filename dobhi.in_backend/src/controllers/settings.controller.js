const Settings = require("../models/settings.model");
const { successResponse } = require("../utils/apiResponse");

const defaultSettingsPayload = {
  deliveryCharge: 50,
  minOrderValue: 200,
  businessHours: "9 AM - 9 PM",
  serviceArea: "All",
  brandName: "DobhiWala",
  logoUrl: "",
  supportPhone: "+91 98765 43210",
  supportEmail: "help@dobhiwala.in",
  supportAddress: "Jaipur, Rajasthan",
  rushDeliveryEnabled: false,
  rushDeliveryCharge: 80,
  ordersEnabled: true,
  categoryVisibility: { men: true, female: true, kids: true },
  paymentMethods: { cod: true, upi: true, card: true, netbanking: true },
};

const getOrCreateSettings = async () => {
  let settings = await Settings.findOne();
  if (!settings) {
    settings = await Settings.create(defaultSettingsPayload);
  }
  return settings;
};

const getSettings = async (req, res) => {
  const settings = await getOrCreateSettings();
  return res.status(200).json(successResponse({ settings }));
};

const updateSettings = async (req, res) => {
  const settings = await getOrCreateSettings();
  const payload = req.body || {};

  settings.deliveryCharge = Number(payload.deliveryCharge ?? settings.deliveryCharge);
  settings.minOrderValue = Number(payload.minOrderValue ?? settings.minOrderValue);
  settings.businessHours = String(
    payload.businessHours ?? settings.businessHours ?? defaultSettingsPayload.businessHours
  );
  settings.serviceArea = String(
    payload.serviceArea ?? settings.serviceArea ?? defaultSettingsPayload.serviceArea
  );
  settings.brandName = String(
    payload.brandName ?? settings.brandName ?? defaultSettingsPayload.brandName
  );
  settings.logoUrl = String(payload.logoUrl ?? settings.logoUrl ?? defaultSettingsPayload.logoUrl);
  settings.supportPhone = String(
    payload.supportPhone ?? settings.supportPhone ?? defaultSettingsPayload.supportPhone
  );
  settings.supportEmail = String(
    payload.supportEmail ?? settings.supportEmail ?? defaultSettingsPayload.supportEmail
  );
  settings.supportAddress = String(
    payload.supportAddress ?? settings.supportAddress ?? defaultSettingsPayload.supportAddress
  );
  settings.rushDeliveryEnabled = payload.rushDeliveryEnabled ?? settings.rushDeliveryEnabled;
  settings.rushDeliveryCharge = Number(
    payload.rushDeliveryCharge ?? settings.rushDeliveryCharge
  );
  settings.ordersEnabled = payload.ordersEnabled ?? settings.ordersEnabled;

  settings.categoryVisibility = {
    men: payload?.categoryVisibility?.men ?? settings.categoryVisibility.men,
    female: payload?.categoryVisibility?.female ?? settings.categoryVisibility.female,
    kids: payload?.categoryVisibility?.kids ?? settings.categoryVisibility.kids,
  };

  settings.paymentMethods = {
    cod: payload?.paymentMethods?.cod ?? settings.paymentMethods.cod,
    upi: payload?.paymentMethods?.upi ?? settings.paymentMethods.upi,
    card: payload?.paymentMethods?.card ?? settings.paymentMethods.card,
    netbanking:
      payload?.paymentMethods?.netbanking ?? settings.paymentMethods.netbanking,
  };

  await settings.save();

  return res.status(200).json(successResponse({ settings }));
};

module.exports = {
  getSettings,
  updateSettings,
};

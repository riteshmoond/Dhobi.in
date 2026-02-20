const express = require("express");

const asyncHandler = require("../middlewares/asyncHandler");
const authGuard = require("../middlewares/authGuard");
const validateRequest = require("../middlewares/validateRequest");
const {
  getServices,
  createService,
  replaceServices,
  updateService,
  deleteService,
} = require("../controllers/service.controller");
const {
  createServiceSchema,
  replaceServicesSchema,
  updateServiceSchema,
} = require("../validators/requestSchemas");

const router = express.Router();

router.get("/", asyncHandler(getServices));
router.post(
  "/",
  authGuard("admin"),
  validateRequest(createServiceSchema),
  asyncHandler(createService)
);
router.put(
  "/",
  authGuard("admin"),
  validateRequest(replaceServicesSchema),
  asyncHandler(replaceServices)
);
router.put(
  "/:id",
  authGuard("admin"),
  validateRequest(updateServiceSchema),
  asyncHandler(updateService)
);
router.delete("/:id", authGuard("admin"), asyncHandler(deleteService));

module.exports = router;

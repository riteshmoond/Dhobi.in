export const TRACKING_STEPS = [
  { label: "Order Received", key: "received" },
  { label: "Washing", key: "washing" },
  { label: "Drying", key: "drying" },
  { label: "Ironing", key: "ironing" },
  { label: "Out For Delivery", key: "delivery" },
  { label: "Delivered", key: "delivered" },
];

// Minute thresholds from order creation time for each step index.
const STEP_THRESHOLDS_MINUTES = [0, 30, 90, 180, 300, 420];

const clampStep = (step) => Math.max(0, Math.min(step, TRACKING_STEPS.length - 1));

export const getTrackingStepFromCreatedAt = (createdAt, nowMs = Date.now()) => {
  if (!createdAt) return 0;
  const createdMs = new Date(createdAt).getTime();
  if (Number.isNaN(createdMs)) return 0;

  const elapsedMinutes = Math.max(0, Math.floor((nowMs - createdMs) / 60000));
  let step = 0;
  for (let i = 0; i < STEP_THRESHOLDS_MINUTES.length; i += 1) {
    if (elapsedMinutes >= STEP_THRESHOLDS_MINUTES[i]) step = i;
  }
  return clampStep(step);
};

export const normalizeOrderTracking = (order, nowMs = Date.now()) => {
  const stepFromTime = getTrackingStepFromCreatedAt(order?.createdAt, nowMs);
  const manualStep = Number.isInteger(Number(order?.trackingStep))
    ? clampStep(Number(order.trackingStep))
    : 0;
  const finalStep = Math.max(stepFromTime, manualStep);

  return {
    ...order,
    trackingStep: finalStep,
    status: TRACKING_STEPS[finalStep].label,
  };
};

export const normalizeOrdersTracking = (orders, nowMs = Date.now()) =>
  orders.map((order) => normalizeOrderTracking(order, nowMs));

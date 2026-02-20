import React, { useEffect, useMemo, useState } from "react";
import { CheckCircle, Clock, Droplet, Wind, Zap, Truck, ArrowLeft } from "lucide-react";
import { useNavigate, useParams } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { TRACKING_STEPS, normalizeOrderTracking } from "../../lib/orderTracking";
import { createRatingApi, getOrderByIdApi } from "../../lib/backendApi";

const STEP_DETAILS = [
  "We have received your clothes.",
  "Your clothes are being washed.",
  "Drying is in progress.",
  "Ironing is almost done.",
  "Your clothes are on the way.",
  "Your order has been delivered.",
];

const STEP_ICONS = [Clock, Droplet, Wind, Zap, Truck, CheckCircle];

const OrderTracking = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [order, setOrder] = useState(null);
  const [ratingValue, setRatingValue] = useState(5);
  const [reviewText, setReviewText] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [ratingMessage, setRatingMessage] = useState("");

  useEffect(() => {
    const loadAndSyncOrder = async () => {
      const result = await getOrderByIdApi(id);
      if (result.success && result.data?.order) {
        setOrder(normalizeOrderTracking(result.data.order));
        return;
      }
      setOrder(null);
    };

    loadAndSyncOrder();
    const timer = setInterval(loadAndSyncOrder, 30000);
    return () => clearInterval(timer);
  }, [id]);

  const currentStep = useMemo(() => {
    const step = Number(order?.trackingStep);
    if (Number.isInteger(step) && step >= 0) return Math.min(step, TRACKING_STEPS.length - 1);
    return 0;
  }, [order]);
  const isDelivered = currentStep === TRACKING_STEPS.length - 1;

  const submitRating = async () => {
    if (!isDelivered) return;
    setSubmitting(true);
    setRatingMessage("");

    const result = await createRatingApi({
      orderId: order.id,
      rating: Number(ratingValue),
      review: reviewText,
    });

    if (!result.success) {
      setRatingMessage(result.message || "Failed to submit review");
      setSubmitting(false);
      return;
    }

    setRatingMessage("Thanks! Your review was submitted.");
    setSubmitting(false);
    setReviewText("");
  };

  if (!order) {
    return (
      <div className="min-h-screen flex flex-col justify-center items-center gap-4">
        <h2 className="text-center text-gray-700 text-xl">Order not found.</h2>
        <Button onClick={() => navigate("/orders")} variant="outline">
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back To Orders
        </Button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#e3f6ff] via-[#f6fbff] to-[#d3e9ff] p-6">
      <div className="max-w-3xl mx-auto bg-white border shadow-xl rounded-2xl p-6">
        <h2 className="text-3xl font-bold text-gray-800 mb-4">Laundry Order Tracking</h2>

        <p className="text-gray-600 mb-1">
          Order ID: <span className="font-semibold text-blue-600">{order.id}</span>
        </p>
        <p className="text-gray-600 mb-5">
          Current Status: <span className="font-semibold text-blue-600">{order.status}</span>
        </p>

        <div className="space-y-6">
          {TRACKING_STEPS.map((step, idx) => {
            const Icon = STEP_ICONS[idx];
            const active = idx <= currentStep;

            return (
              <div key={step.key} className="flex gap-4 items-start">
                <div className={`p-3 rounded-full ${active ? "bg-blue-100" : "bg-gray-200"}`}>
                  <Icon className={`w-6 h-6 ${active ? "text-blue-600" : "text-gray-400"}`} />
                </div>

                <div>
                  <p className={`text-lg font-semibold ${active ? "text-blue-600" : "text-gray-400"}`}>
                    {step.label}
                  </p>
                  <p className="text-gray-500 text-sm">{STEP_DETAILS[idx]}</p>
                </div>
              </div>
            );
          })}
        </div>

        <div className="mt-8">
          <Button onClick={() => navigate("/orders")} variant="outline">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back To Orders
          </Button>
        </div>

        {isDelivered ? (
          <div className="mt-8 border-t pt-6">
            <h3 className="text-xl font-semibold text-gray-800 mb-3">Rate Your Order</h3>

            <div className="flex items-center gap-2 mb-4">
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  key={star}
                  type="button"
                  onClick={() => setRatingValue(star)}
                  className={`text-2xl ${star <= ratingValue ? "text-yellow-500" : "text-gray-300"}`}
                >
                  ★
                </button>
              ))}
            </div>

            <textarea
              value={reviewText}
              onChange={(e) => setReviewText(e.target.value)}
              className="w-full border rounded-lg p-3 text-sm"
              rows={4}
              placeholder="Share your feedback (optional)"
            />

            <div className="mt-3 flex items-center gap-3">
              <Button onClick={submitRating} disabled={submitting}>
                {submitting ? "Submitting..." : "Submit Review"}
              </Button>
              {ratingMessage ? <p className="text-sm text-gray-600">{ratingMessage}</p> : null}
            </div>
          </div>
        ) : null}
      </div>
    </div>
  );
};

export default OrderTracking;

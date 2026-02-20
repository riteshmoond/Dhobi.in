import React, { useEffect, useMemo, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { CreditCard, User, ShoppingCart, ArrowLeft, ChevronRight } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import {
  defaultAdminSettings,
  loadAdminSettings,
  normalizeSettings,
} from "../../lib/adminSettings";
import { createOrderApi, getSettingsApi } from "../../lib/backendApi";

const CART_STORAGE_KEY = "dobhivala_cart_v2";

const Checkout = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const MotionDiv = motion.div;
  const MotionForm = motion.form;

  const items = useMemo(
    () => (Array.isArray(location.state?.items) ? location.state.items : []),
    [location.state]
  );

  const subtotalFromItems = useMemo(
    () =>
      items.reduce((sum, item) => {
        const qty = Number(item.qty) || 0;
        const price = Number(item.price) || 0;
        return sum + qty * price;
      }, 0),
    [items]
  );

  const subtotal = Number(location.state?.subtotal) || subtotalFromItems;
  const [adminSettings, setAdminSettings] = useState(defaultAdminSettings);
  const [isRushDelivery, setIsRushDelivery] = useState(false);
  const deliveryCharge = adminSettings.deliveryCharge;
  const rushDeliveryCharge =
    adminSettings.rushDeliveryEnabled && isRushDelivery ? adminSettings.rushDeliveryCharge : 0;
  const enabledPaymentMethods = adminSettings.paymentMethods || defaultAdminSettings.paymentMethods;
  const hasEnabledPaymentMethod = Object.values(enabledPaymentMethods).some(Boolean);
  const canPlaceOrder = subtotal >= adminSettings.minOrderValue;
  const isOrderingOpen = adminSettings.ordersEnabled !== false;
  const finalPayable = subtotal + deliveryCharge + rushDeliveryCharge;

  useEffect(() => {
    const syncSettings = async () => {
      const result = await getSettingsApi();
      if (result.success && result.data?.settings) {
        setAdminSettings(normalizeSettings(result.data.settings));
        return;
      }
      setAdminSettings(loadAdminSettings());
    };
    syncSettings();
    window.addEventListener("dobhivala:settings:updated", syncSettings);
    return () => window.removeEventListener("dobhivala:settings:updated", syncSettings);
  }, []);

  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    fullName: "",
    phone: "",
    address: "",
    city: "",
    pincode: "",
    paymentMethod: "cod",
  });
  const [paymentData, setPaymentData] = useState({
    upiId: "",
    cardNumber: "",
    cardExpiry: "",
    cardCvv: "",
    cardName: "",
    bankName: "",
  });

  useEffect(() => {
    if (!enabledPaymentMethods[formData.paymentMethod]) {
      const firstEnabledMethod = Object.entries(enabledPaymentMethods).find(([, enabled]) => enabled);
      if (firstEnabledMethod) {
        setFormData((prev) => ({ ...prev, paymentMethod: firstEnabledMethod[0] }));
      }
    }
  }, [enabledPaymentMethods, formData.paymentMethod]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handlePaymentDataChange = (e) => {
    const { name, value } = e.target;
    let nextValue = value;

    if (name === "cardNumber") {
      const digits = value.replace(/\D/g, "").slice(0, 19);
      nextValue = digits.replace(/(\d{4})(?=\d)/g, "$1 ").trim();
    } else if (name === "cardExpiry") {
      const digits = value.replace(/\D/g, "").slice(0, 4);
      if (digits.length <= 2) nextValue = digits;
      else nextValue = `${digits.slice(0, 2)}/${digits.slice(2)}`;
    } else if (name === "cardCvv") {
      nextValue = value.replace(/\D/g, "").slice(0, 4);
    }

    setPaymentData((prev) => ({ ...prev, [name]: nextValue }));
  };

  const validatePayment = () => {
    if (!enabledPaymentMethods[formData.paymentMethod]) return false;

    if (formData.paymentMethod === "upi") {
      return /^[a-zA-Z0-9._-]+@[a-zA-Z]{2,}$/.test(paymentData.upiId.trim());
    }

    if (formData.paymentMethod === "card") {
      const digits = paymentData.cardNumber.replace(/\D/g, "");
      const hasValidCard = digits.length >= 12 && digits.length <= 19;
      const hasValidExpiry = /^(0[1-9]|1[0-2])\/\d{2}$/.test(paymentData.cardExpiry);
      const hasValidCvv = /^\d{3,4}$/.test(paymentData.cardCvv);
      const hasName = paymentData.cardName.trim().length > 1;
      return hasValidCard && hasValidExpiry && hasValidCvv && hasName;
    }

    if (formData.paymentMethod === "netbanking") {
      return paymentData.bankName.trim().length > 0;
    }

    return true;
  };

  const getPaymentSummary = () => {
    if (formData.paymentMethod === "upi") {
      return { method: "upi", upiId: paymentData.upiId.trim() };
    }
    if (formData.paymentMethod === "card") {
      const digits = paymentData.cardNumber.replace(/\D/g, "");
      return { method: "card", cardLast4: digits.slice(-4) };
    }
    if (formData.paymentMethod === "netbanking") {
      return { method: "netbanking", bankName: paymentData.bankName.trim() };
    }
    return { method: "cod" };
  };

  async function createRazorpayOrder(amount, receipt) {
    const res = await fetch("/api/payment/razorpay/order", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${getToken()}`,
      },
      body: JSON.stringify({ amount, currency: "INR", receipt }),
    });
    return await res.json();
  }

  async function handleRazorpayPayment() {
    const orderRes = await createRazorpayOrder(finalPayable, `order_${Date.now()}`);
    if (!orderRes.success || !orderRes.order) {
      alert("Payment initialization failed");
      return;
    }
    const options = {
      key: "rzp_test_demo1234567890", // DEMO KEY: Replace with your real Razorpay Key ID for production
      amount: orderRes.order.amount,
      currency: orderRes.order.currency,
      name: "Dobhi.in Laundry",
      description: "Order Payment",
      order_id: orderRes.order.id,
      handler: function (response) {
        // On payment success, call handleOrder with payment info
        handleOrderWithPayment(response);
      },
      prefill: {
        name: formData.fullName,
        email: "", // Optionally add user email
        contact: formData.phone,
      },
      theme: { color: "#007acc" },
    };
    const rzp = new window.Razorpay(options);
    rzp.open();
  }

  async function handleOrderWithPayment(paymentResponse) {
    // Call handleOrder with payment info
    await handleOrder(null, paymentResponse);
  }

  const handleOrder = async (e) => {
    e.preventDefault();

    if (items.length === 0) {
      alert("Your cart is empty. Please add items first.");
      navigate("/addtocard");
      return;
    }
    if (!validatePayment()) {
      alert("Please enter valid payment details.");
      return;
    }
    if (!hasEnabledPaymentMethod) {
      alert("No payment method is currently available.");
      return;
    }
    if (!isOrderingOpen) {
      alert("Orders are temporarily paused by admin.");
      return;
    }
    if (!canPlaceOrder) {
      alert(`Minimum order value is Rs ${adminSettings.minOrderValue}.`);
      return;
    }

    const newOrder = {
      items,
      subtotal,
      deliveryCharge,
      rushDelivery: isRushDelivery,
      rushDeliveryCharge,
      total: finalPayable,
      trackingStep: 0,
      status: "Order Received",
      address: formData,
      paymentMethod: formData.paymentMethod,
      paymentInfo: getPaymentSummary(),
      createdAt: new Date().toISOString(),
    };

    const result = await createOrderApi(newOrder);
    if (!result.success) {
      alert(result.message || "Unable to place order. Please try again.");
      return;
    }

    const createdOrderId = result.data?.order?.id;
    if (!createdOrderId) {
      alert("Order created but ID missing. Please check my orders.");
      return;
    }

    localStorage.setItem(CART_STORAGE_KEY, JSON.stringify({}));
    window.dispatchEvent(new Event("dobhivala:cart:clear"));

    navigate("/order-success", { state: { orderId: createdOrderId } });
  };

  if (items.length === 0) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-[#e3f6ff] via-[#f7fbff] to-[#cfe9ff] pt-20 pb-10 text-gray-800">
        <main className="max-w-3xl mx-auto px-3 sm:px-4">
          <div className="bg-white border border-[#b9e5ff] rounded-3xl shadow-md p-6 sm:p-8 text-center">
            <h2 className="text-2xl sm:text-3xl font-bold text-[#007acc]">Checkout</h2>
            <p className="mt-3 text-gray-600">No items found in cart.</p>
            <Button
              onClick={() => navigate("/addtocard")}
              className="mt-6 bg-gradient-to-r from-[#009dff] to-[#007acc] text-white"
            >
              Go To Cart
            </Button>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#e3f6ff] via-[#f7fbff] to-[#cfe9ff] pt-20 pb-10 text-gray-800">
      <main className="max-w-4xl mx-auto px-3 sm:px-4">
        <div className="flex items-center justify-between mb-6 sm:mb-8 px-1">
          <div className="flex items-center gap-3">
            <CreditCard className="w-7 h-7 text-[#009dff]" />
            <h2 className="text-2xl sm:text-3xl font-bold text-[#007acc] drop-shadow-sm">
              Checkout
            </h2>
          </div>

          <Button
            variant="ghost"
            onClick={() => navigate(-1)}
            className="text-[#007acc] hover:opacity-70 text-sm sm:text-base"
          >
            <ArrowLeft className="mr-2 w-4 h-4" /> Back
          </Button>
        </div>

        <AnimatePresence mode="wait">
          {step === 1 && (
            <MotionDiv
              key="summary"
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -40 }}
              transition={{ duration: 0.4 }}
              className="bg-gradient-to-br from-[#ffffff] via-[#e8f7ff] to-[#dff3ff] shadow-lg border border-[#b9e5ff] rounded-3xl p-5 sm:p-6"
            >
              <h3 className="text-xl sm:text-2xl font-semibold text-[#007acc] mb-4 flex items-center gap-2">
                <ShoppingCart className="w-6 h-6" /> Order Summary
              </h3>

              <div className="space-y-3 mb-5">
                {items.map((item) => (
                  <div
                    key={item.id}
                    className="flex justify-between items-center text-gray-700 border-b pb-2 text-sm sm:text-base"
                  >
                    <span className="font-medium">
                      {item.name} x {item.qty}
                    </span>
                    <span className="font-semibold text-[#009dff]">
                      Rs {(Number(item.price) || 0) * (Number(item.qty) || 0)}
                    </span>
                  </div>
                ))}
              </div>

              <div className="flex justify-between text-lg font-semibold text-gray-800 border-t pt-3 mb-6">
                <span>Total Amount</span>
                <span className="text-[#007acc]">Rs {subtotal}</span>
              </div>

              <div className="text-right">
                <Button
                  onClick={() => setStep(2)}
                  className="bg-gradient-to-r from-[#009dff] to-[#007acc] text-white py-3 px-6 rounded-xl text-base sm:text-lg hover:opacity-90"
                >
                  Proceed to Details
                  <ChevronRight className="ml-2 w-4 h-4" />
                </Button>
              </div>
            </MotionDiv>
          )}

          {step === 2 && (
            <MotionForm
              key="details"
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -40 }}
              transition={{ duration: 0.4 }}
              onSubmit={handleOrder}
              className="grid grid-cols-1 lg:grid-cols-3 gap-6"
            >
              <div className="lg:col-span-2 space-y-6">
                <div className="bg-white shadow-md rounded-xl p-5 border">
                  <h3 className="text-xl font-semibold text-gray-800 flex items-center gap-2 mb-4">
                    <User className="w-6 h-6 text-blue-600" /> Delivery Details
                  </h3>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="text-sm text-gray-600 font-medium">Full Name</label>
                      <input
                        type="text"
                        name="fullName"
                        className="w-full border rounded-lg p-3 mt-1"
                        placeholder="Enter your name"
                        value={formData.fullName}
                        onChange={handleChange}
                        required
                      />
                    </div>

                    <div>
                      <label className="text-sm text-gray-600 font-medium">Phone Number</label>
                      <input
                        type="tel"
                        name="phone"
                        className="w-full border rounded-lg p-3 mt-1"
                        placeholder="10-digit number"
                        value={formData.phone}
                        onChange={handleChange}
                        pattern="[0-9]{10}"
                        required
                      />
                    </div>
                  </div>

                  <div className="mt-4">
                    <label className="text-sm text-gray-600 font-medium">Full Address</label>
                    <textarea
                      name="address"
                      rows="3"
                      className="w-full border rounded-lg p-3 mt-1"
                      placeholder="House no, area, landmark"
                      value={formData.address}
                      onChange={handleChange}
                      required
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4 mt-4">
                    <div>
                      <label className="text-sm text-gray-600 font-medium">City</label>
                      <input
                        type="text"
                        name="city"
                        className="w-full border rounded-lg p-3 mt-1"
                        placeholder="City"
                        value={formData.city}
                        onChange={handleChange}
                        required
                      />
                    </div>

                    <div>
                      <label className="text-sm text-gray-600 font-medium">Pincode</label>
                      <input
                        type="text"
                        name="pincode"
                        className="w-full border rounded-lg p-3 mt-1"
                        placeholder="Pincode"
                        value={formData.pincode}
                        onChange={handleChange}
                        pattern="[0-9]{6}"
                        required
                      />
                    </div>
                  </div>
                </div>

                <div className="bg-white shadow-md rounded-xl p-5 border">
                  <h3 className="text-xl font-semibold text-gray-800 flex items-center gap-2 mb-4">
                    <CreditCard className="w-6 h-6 text-blue-600" /> Payment Options
                  </h3>

                  <div className="space-y-3">
                    {enabledPaymentMethods.cod ? (
                      <label
                        className={`flex items-center gap-3 border rounded-lg p-3 cursor-pointer ${
                          formData.paymentMethod === "cod"
                            ? "border-blue-600 bg-blue-50"
                            : "border-gray-300"
                        }`}
                      >
                        <input
                          type="radio"
                          name="paymentMethod"
                          value="cod"
                          checked={formData.paymentMethod === "cod"}
                          onChange={handleChange}
                        />
                        Cash on Delivery (COD)
                      </label>
                    ) : null}

                    {enabledPaymentMethods.upi ? (
                      <label
                        className={`flex items-center gap-3 border rounded-lg p-3 cursor-pointer ${
                          formData.paymentMethod === "upi"
                            ? "border-blue-600 bg-blue-50"
                            : "border-gray-300"
                        }`}
                      >
                        <input
                          type="radio"
                          name="paymentMethod"
                          value="upi"
                          checked={formData.paymentMethod === "upi"}
                          onChange={handleChange}
                        />
                        UPI (Google Pay, PhonePe)
                      </label>
                    ) : null}

                    {enabledPaymentMethods.card ? (
                      <label
                        className={`flex items-center gap-3 border rounded-lg p-3 cursor-pointer ${
                          formData.paymentMethod === "card"
                            ? "border-blue-600 bg-blue-50"
                            : "border-gray-300"
                        }`}
                      >
                        <input
                          type="radio"
                          name="paymentMethod"
                          value="card"
                          checked={formData.paymentMethod === "card"}
                          onChange={handleChange}
                        />
                        Debit / Credit Card
                      </label>
                    ) : null}

                    {enabledPaymentMethods.netbanking ? (
                      <label
                        className={`flex items-center gap-3 border rounded-lg p-3 cursor-pointer ${
                          formData.paymentMethod === "netbanking"
                            ? "border-blue-600 bg-blue-50"
                            : "border-gray-300"
                        }`}
                      >
                        <input
                          type="radio"
                          name="paymentMethod"
                          value="netbanking"
                          checked={formData.paymentMethod === "netbanking"}
                          onChange={handleChange}
                        />
                        Net Banking
                      </label>
                    ) : null}

                    {!hasEnabledPaymentMethod ? (
                      <p className="text-sm text-red-600">All payment methods are disabled by admin.</p>
                    ) : null}
                  </div>

                  {formData.paymentMethod === "upi" ? (
                    <div className="mt-4">
                      <label className="text-sm text-gray-600 font-medium">UPI ID</label>
                      <input
                        type="text"
                        name="upiId"
                        value={paymentData.upiId}
                        onChange={handlePaymentDataChange}
                        placeholder="example@upi"
                        className="w-full border rounded-lg p-3 mt-1"
                        required
                      />
                    </div>
                  ) : null}

                  {formData.paymentMethod === "card" ? (
                    <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div className="sm:col-span-2">
                        <label className="text-sm text-gray-600 font-medium">Card Number</label>
                        <input
                          type="text"
                          name="cardNumber"
                          value={paymentData.cardNumber}
                          onChange={handlePaymentDataChange}
                          placeholder="1234 5678 9012 3456"
                          className="w-full border rounded-lg p-3 mt-1"
                          inputMode="numeric"
                          autoComplete="cc-number"
                          required
                        />
                      </div>
                      <div>
                        <label className="text-sm text-gray-600 font-medium">Expiry (MM/YY)</label>
                        <input
                          type="text"
                          name="cardExpiry"
                          value={paymentData.cardExpiry}
                          onChange={handlePaymentDataChange}
                          placeholder="MM/YY"
                          className="w-full border rounded-lg p-3 mt-1"
                          inputMode="numeric"
                          autoComplete="cc-exp"
                          required
                        />
                      </div>
                      <div>
                        <label className="text-sm text-gray-600 font-medium">CVV</label>
                        <input
                          type="password"
                          name="cardCvv"
                          value={paymentData.cardCvv}
                          onChange={handlePaymentDataChange}
                          placeholder="***"
                          className="w-full border rounded-lg p-3 mt-1"
                          inputMode="numeric"
                          autoComplete="cc-csc"
                          required
                        />
                      </div>
                      <div className="sm:col-span-2">
                        <label className="text-sm text-gray-600 font-medium">Name On Card</label>
                        <input
                          type="text"
                          name="cardName"
                          value={paymentData.cardName}
                          onChange={handlePaymentDataChange}
                          placeholder="Card holder name"
                          className="w-full border rounded-lg p-3 mt-1"
                          autoComplete="cc-name"
                          required
                        />
                      </div>
                    </div>
                  ) : null}

                  {formData.paymentMethod === "netbanking" ? (
                    <div className="mt-4">
                      <label className="text-sm text-gray-600 font-medium">Select Bank</label>
                      <select
                        name="bankName"
                        value={paymentData.bankName}
                        onChange={handlePaymentDataChange}
                        className="w-full border rounded-lg p-3 mt-1"
                        required
                      >
                        <option value="">Choose your bank</option>
                        <option value="State Bank of India">State Bank of India</option>
                        <option value="HDFC Bank">HDFC Bank</option>
                        <option value="ICICI Bank">ICICI Bank</option>
                        <option value="Axis Bank">Axis Bank</option>
                        <option value="Punjab National Bank">Punjab National Bank</option>
                      </select>
                    </div>
                  ) : null}
                </div>

                <div className="bg-sky-50 border border-sky-200 rounded-xl p-4 text-sm text-sky-900">
                  <p>
                    Service Area: <span className="font-semibold">{adminSettings.serviceArea}</span>
                  </p>
                  <p>
                    Business Hours: <span className="font-semibold">{adminSettings.businessHours}</span>
                  </p>
                  <p>
                    Minimum Order Value:{" "}
                    <span className="font-semibold">Rs {adminSettings.minOrderValue}</span>
                  </p>
                </div>

                {adminSettings.rushDeliveryEnabled ? (
                  <div className="bg-amber-50 border border-amber-200 rounded-xl p-4">
                    <label className="flex items-center gap-2 text-amber-900 font-medium">
                      <input
                        type="checkbox"
                        checked={isRushDelivery}
                        onChange={(e) => setIsRushDelivery(e.target.checked)}
                      />
                      Rush Delivery (Extra Rs {adminSettings.rushDeliveryCharge})
                    </label>
                  </div>
                ) : null}
              </div>

              <div className="bg-white shadow-lg rounded-xl p-6 border h-fit sticky top-28">
                <h3 className="text-xl font-semibold text-gray-800 border-b pb-3 mb-4">
                  Price Summary
                </h3>

                <div className="space-y-3 text-gray-700">
                  {items.map((item) => (
                    <div className="flex justify-between" key={item.id}>
                      <span>
                        {item.name} x {item.qty}
                      </span>
                      <span>Rs {(Number(item.price) || 0) * (Number(item.qty) || 0)}</span>
                    </div>
                  ))}
                </div>

                <div className="flex justify-between mt-4 text-lg font-semibold border-t pt-3">
                  <span>Subtotal</span>
                  <span className="text-blue-600">Rs {subtotal}</span>
                </div>

                <div className="flex justify-between mt-2 text-base">
                  <span>Delivery Charge</span>
                  <span>Rs {deliveryCharge}</span>
                </div>

                <div className="flex justify-between mt-2 text-base">
                  <span>Rush Delivery</span>
                  <span>{rushDeliveryCharge > 0 ? `Rs ${rushDeliveryCharge}` : "No"}</span>
                </div>

                <div className="flex justify-between mt-3 text-lg font-semibold border-t pt-3">
                  <span>Total Payable</span>
                  <span className="text-blue-600">Rs {finalPayable}</span>
                </div>

                {!canPlaceOrder ? (
                  <p className="text-xs text-red-600 mt-3">
                    Minimum order value should be Rs {adminSettings.minOrderValue}.
                  </p>
                ) : null}
                {!isOrderingOpen ? (
                  <p className="text-xs text-red-600 mt-2">
                    Orders are currently paused. Please try later.
                  </p>
                ) : null}

                <Button
                  type="submit"
                  className="w-full bg-blue-600 hover:bg-blue-700 text-white mt-5 py-3 rounded-lg text-lg"
                  disabled={!canPlaceOrder || !hasEnabledPaymentMethod || !isOrderingOpen}
                >
                  Place Order
                </Button>
              </div>
            </MotionForm>
          )}
        </AnimatePresence>
      </main>
    </div>
  );
};

export default Checkout;

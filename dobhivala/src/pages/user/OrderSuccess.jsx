import React from "react";
import { CheckCircle, ArrowRight, ListOrdered } from "lucide-react";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import { useLocation, useNavigate } from "react-router-dom";

const OrderSuccess = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const MotionDiv = motion.div;
  const orderId = location.state?.orderId;

  return (
    <div className="min-h-screen flex flex-col justify-center items-center bg-gradient-to-br from-[#e3f6ff] via-[#f7fbff] to-[#cfe9ff] p-6 text-center">
      <MotionDiv
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ type: "spring", stiffness: 200, damping: 10 }}
        className="mb-4"
      >
        <CheckCircle className="w-24 h-24 text-green-600 drop-shadow-lg" />
      </MotionDiv>

      <h1 className="text-3xl font-bold text-gray-800 mb-2">Order Placed Successfully!</h1>

      <p className="text-gray-600 text-lg max-w-md mx-auto">
        Thank you for your order. You can track progress anytime from your orders page.
      </p>

      <MotionDiv
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="mt-6 flex flex-col sm:flex-row items-center gap-3"
      >
        {orderId ? (
          <Button
            onClick={() => navigate(`/track-order/${orderId}`)}
            className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 text-lg flex items-center gap-2"
          >
            Track This Order <ArrowRight className="w-5 h-5" />
          </Button>
        ) : null}

        <Button
          onClick={() => navigate("/orders")}
          variant="outline"
          className="px-6 py-3 text-lg flex items-center gap-2"
        >
          My Orders <ListOrdered className="w-5 h-5" />
        </Button>
      </MotionDiv>
    </div>
  );
};

export default OrderSuccess;

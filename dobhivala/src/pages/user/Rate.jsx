import React from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { ArrowLeft, CheckCircle } from "lucide-react";

const RatePage = () => {
  const { state } = useLocation();
  const navigate = useNavigate();

  const plan = state;

  if (!plan) {
    return (
      <div className="min-h-screen flex items-center justify-center text-xl text-gray-600">
        No Rate Data Found
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#e3f6ff] via-[#f0faff] to-[#d8f1ff] py-10 px-4">
      <div className="max-w-3xl mx-auto">

        {/* HEADER */}
        <div className="flex items-center gap-4 mb-8">
          <button
            onClick={() => navigate(-1)}
            className="p-2 rounded-full bg-white shadow hover:bg-slate-100 transition"
          >
            <ArrowLeft className="w-5 h-5 text-[#0284c7]" />
          </button>

          <h1 className="text-3xl font-extrabold text-[#0369a1] tracking-wide drop-shadow-sm">
            {plan.title} Rates
          </h1>
        </div>

        {/* PLAN CARD */}
        <div className="bg-white rounded-3xl shadow-lg p-6 border border-[#bce8ff] mb-8">
          <div className="flex items-center gap-6">
            <img
              src={plan.img}
              alt={plan.title}
              className="w-24 h-24 rounded-2xl object-cover shadow-md border"
            />

            <div className="flex-1">
              <h2 className="text-2xl font-bold text-[#045f9a]">{plan.title}</h2>
              <p className="text-slate-600 mt-1 text-sm">{plan.description}</p>
            </div>

            <div className="text-right">
              <p className="text-3xl font-extrabold text-[#0284c7]">{plan.price}</p>
              <p className="text-xs text-slate-500">{plan.subtitle}</p>
            </div>
          </div>

          {/* FEATURES */}
          <ul className="mt-5 grid grid-cols-1 sm:grid-cols-2 gap-2">
            {(plan.features || []).map((feat, i) => (
              <li key={i} className="flex items-center gap-2 text-slate-700">
                <CheckCircle className="w-4 h-4 text-[#0ea5c9]" />
                {feat}
              </li>
            ))}
          </ul>
        </div>

        {/* RATE LIST */}
        <div className="bg-white rounded-3xl shadow-lg p-6 border border-[#bce8ff]">
          <h3 className="text-xl font-bold text-[#045f9a] mb-4">
            Detailed Rate List
          </h3>

          <div className="divide-y border rounded-xl overflow-hidden">
            {(plan.rateList || []).map((item, index) => (
              <div
                key={index}
                className="flex justify-between items-center px-4 py-3 bg-white hover:bg-[#f0fbff] transition"
              >
                <span className="text-slate-700 font-medium">{item.item}</span>
                <span className="text-[#0284c7] font-bold">{item.price}</span>
              </div>
            ))}
          </div>
        </div>

      </div>
    </div>
  );
};

export default RatePage;

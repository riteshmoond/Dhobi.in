"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Check, ChevronLeft, ChevronRight, Star, Plus, Minus } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { slides, cards, dryCleanPlans, washRates, } from "./Homeservices";

export default function Home({
    cart,
    addToCart,
    removeFromCart,
    categoryVisibility = { men: true, female: true, kids: true },
}) {
    const navigate = useNavigate();
    const MotionDiv = motion.div;
    const MotionArticle = motion.article;

    const [active, setActive] = useState(0);
    const [activeTab, setActiveTab] = useState("dryclean");

    const nextSlide = () => setActive((prev) => (prev + 1) % slides.length);
    const prevSlide = () => setActive((prev) => (prev - 1 + slides.length) % slides.length);

    useEffect(() => {
        const auto = setInterval(nextSlide, 4000);
        return () => clearInterval(auto);
    }, []);

    const maleCards = cards.slice(0, 4);
    const femaleCards = cards.slice(4, 8);
    const kidsCards = cards.slice(8, 12);

    const [openDropdown, setOpenDropdown] = useState(null);

    return (
        <div className="w-full flex flex-col items-center gap-20 py-4 bg-gradient-to-b from-[#e8f9ff] to-[#f7fbff]">

            {/* ========== SLIDER ========== */}
            <div className="relative w-full max-w-8xl mx-auto  overflow-hidden shadow-xl h-[260px] sm:h-[350px] md:h-[460px] lg:h-[620px]">

                {slides.map((slide, i) => {
                    const isActive = i === active;

                    return (
                        <MotionDiv
                            key={slide.id}
                            className="absolute inset-0 w-full h-full"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: isActive ? 1 : 0 }}
                            transition={{ duration: 0.8 }}
                        >
                            <img
                                src={slide.img}
                                alt={slide.title}
                                className="w-full h-full object-cover"
                            />

                            {/* Gradient Overlay */}
                            <div className="absolute inset-0 bg-gradient-to-b from-transparent via-white/10 to-white/80" />

                            {/* Text */}
                            <MotionDiv
                                className="absolute left-5 bottom-6 sm:left-10 sm:bottom-10 bg-white/80 backdrop-blur-sm px-4 py-3 rounded-xl shadow max-w-[80%]"
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: isActive ? 1 : 0, y: isActive ? 0 : 20 }}
                                transition={{ delay: 0.2 }}
                            >
                                <h2 className="text-lg sm:text-3xl font-bold text-[#035ea1]">{slide.title}</h2>

                                {slide.subtitle && (
                                    <p className="text-xs sm:text-sm text-slate-600 mt-1">{slide.subtitle}</p>
                                )}
                            </MotionDiv>
                        </MotionDiv>
                    );
                })}

                {/* Left Arrow */}
                <button
                    className="absolute top-1/2 left-4 -translate-y-1/2 bg-white/80 hover:bg-white shadow rounded-full p-2"
                    onClick={prevSlide}
                >
                    <ChevronLeft className="w-6 h-6 text-[#0369a1]" />
                </button>

                {/* Right Arrow */}
                <button
                    className="absolute top-1/2 right-4 -translate-y-1/2 bg-white/80 hover:bg-white shadow rounded-full p-2"
                    onClick={nextSlide}
                >
                    <ChevronRight className="w-6 h-6 text-[#0369a1]" />
                </button>

                {/* Dots */}
                <div className="absolute bottom-4 w-full flex justify-center gap-2">
                    {slides.map((_, i) => (
                        <button
                            key={i}
                            onClick={() => setActive(i)}
                            className={`w-3 h-3 rounded-full transition ${i === active ? "bg-[#0284c7] scale-125" : "bg-slate-300"
                                }`}
                        />
                    ))}
                </div>
            </div>
           

            {/* ========== RATES / TABS ========== */}
            <section className="w-full max-w-6xl mx-auto px-4">
                <div className="flex justify-center gap-8 mb-6 border-b border-slate-100 pb-4">
                    <TabButton label="Wash Rates" active={activeTab === "wash"} onClick={() => setActiveTab("wash")} />
                    <TabButton label="Dry Clean Rates" active={activeTab === "dryclean"} onClick={() => setActiveTab("dryclean")} />
                    {/* <TabButton label="Prepaid Plans" active={activeTab === "prepaid"} onClick={() => setActiveTab("prepaid")} /> */}
                </div>

                <div className="space-y-6">
                    {activeTab === "dryclean" && (
                        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-1 gap-6">
                            {dryCleanPlans.map((plan) => (
                                <article key={plan.id} className="bg-white rounded-2xl p-5 shadow-sm border hover:shadow-lg transition">
                                    <div className="flex items-start gap-4">
                                        <img src={plan.img} alt={plan.title} className="w-20 h-20 object-cover rounded-lg" />
                                        <div className="flex-1">
                                            <h3 className="text-lg font-bold text-[#045f9a]">{plan.title}</h3>
                                            <p className="text-sm text-slate-600 mt-1 hidden md:block">{plan.description}</p>
                                        </div>
                                        <div className="text-right">
                                            <p className="text-2xl font-extrabold text-[#0ea5c9]">{plan.price}</p>
                                            <p className="text-xs text-slate-500 mt-1">{plan.subtitle}</p>
                                        </div>
                                    </div>

                                    <ul className="mt-4 text-sm text-slate-700 space-y-2">
                                        {plan.features.map((f, idx) => (
                                            <li key={idx} className="flex items-start gap-3">
                                                <span className="w-2 h-2 rounded-full bg-[#0ea5c9] mt-2 inline-block" />
                                                <span>{f}</span>
                                            </li>
                                        ))}
                                    </ul>

                                    <div className="mt-4 flex items-center justify-between">
                                        <span className="text-xs text-slate-500">Gentle • Eco-friendly</span>
                                        <Button
                                            onClick={() => navigate("/rate", { state: plan })}
                                            className="bg-[#0369a1] text-white rounded-full px-4 py-2"
                                        >
                                            View Rates
                                        </Button>

                                    </div>
                                </article>
                            ))}
                        </div>
                    )}

                    {activeTab === "wash" && (
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                            {washRates.map((plan) => (
                                <div key={plan.id} className="bg-white rounded-2xl p-5 shadow-sm border hover:shadow-lg transition">
                                    <div className="flex gap-4 items-center">
                                        <img src={plan.image} alt={plan.title} className="w-20 h-20 rounded-xl object-cover" />
                                        <div className="flex-1">
                                            <h3 className="text-lg font-semibold text-[#034f7a]">{plan.title}</h3>
                                            <p className="text-sm text-slate-600">{plan.description}</p>
                                        </div>
                                        <div className="text-right">
                                            <p className="text-2xl font-extrabold text-[#0284c7]">{plan.price}</p>
                                            <p className="text-xs text-slate-400">quick turn</p>
                                        </div>
                                    </div>

                                    <ul className="mt-4 text-sm space-y-2 text-slate-700">
                                        {plan.features?.map((f, i) => (
                                            <li key={i} className="flex items-start gap-3">
                                                <span className="w-2 h-2 bg-[#0284c7] rounded-full inline-block mt-2" />
                                                <span>{f}</span>
                                            </li>
                                        ))}
                                    </ul>

                                    <div className="mt-4 flex items-center justify-between">
                                        <small className="text-xs text-slate-500">Turnaround: {plan.turnaround ?? "24-72 hrs"}</small>
                                        <Button variant="outline" className="rounded-full px-4 py-2">Select</Button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}

                    {/* {activeTab === "prepaid" && (
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                            {prepaidPlans.map((plan, idx) => (
                                <div key={idx} className="bg-gradient-to-b from-white to-[#e6f9ff] rounded-2xl p-6 border shadow hover:shadow-xl transition">
                                    <div className="h-1 w-full bg-gradient-to-r from-[#0284c7] to-[#06b6d4] rounded mb-4" />
                                    <img src={plan.image} alt={plan.title} className="w-20 h-20 rounded-full mx-auto mb-4 shadow-sm" />
                                    <h3 className="text-xl font-bold text-center text-[#045f9a]">{plan.title}</h3>
                                    <p className="text-sm text-center text-slate-600 mt-2">{plan.desc}</p>

                                    <div className="text-center mt-4">
                                        <p className="text-3xl font-extrabold text-[#0ea5c9]">{plan.benefit}</p>
                                        <p className="text-xs text-slate-500 mt-1">Instant credit applied</p>
                                    </div>

                                    <ul className="mt-4 text-sm text-slate-700 space-y-2">
                                        <li className="flex items-center justify-between"><span>Priority Pickup</span><span className="text-xs text-[#045f9a] font-semibold">Included</span></li>
                                        <li className="flex items-center justify-between"><span>Exclusive Offers</span><span className="text-xs text-[#045f9a] font-semibold">Yes</span></li>
                                        <li className="flex items-center justify-between"><span>Validity</span><span className="text-xs text-[#045f9a] font-semibold">3 months</span></li>
                                    </ul>

                                    <div className="mt-6 flex justify-center">
                                        <Button className="bg-[#0284c7] hover:bg-[#0369a1] text-white rounded-full px-6 py-2">Buy Plan</Button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )} */}
                </div>
            </section>

            {/* ========== CATEGORIES (Male / Female / Kids) ========== */}
            <section className="w-full max-w-6xl mx-auto px-4 mt-14">
                {[
                    { title: "Male", data: maleCards, route: "/male" },
                    { title: "Female", data: femaleCards, route: "/female" },
                    { title: "Kids", data: kidsCards, route: "/kids" },
                ]
                    .filter((section) => {
                        if (section.title === "Male") return categoryVisibility.men !== false;
                        if (section.title === "Female") return categoryVisibility.female !== false;
                        if (section.title === "Kids") return categoryVisibility.kids !== false;
                        return true;
                    })
                    .map((section, idx) => (
                    <div key={idx} className="mb-12">
                        <div className="flex items-center justify-between mb-6">
                            <h2 className="text-2xl md:text-3xl font-semibold text-[#034f7a]">
                                {section.title}
                            </h2>

                            <button
                                onClick={() => navigate(section.route)}
                                className="flex items-center gap-2 bg-gradient-to-r from-[#0284c7] to-[#0369a1] text-white px-5 py-1.5 rounded-full text-sm font-medium shadow hover:opacity-90 transition"
                            >
                                See All
                                <ChevronRight className="w-4 h-4" />
                            </button>

                        </div>

                        <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6 lg:gap-8">
                            {section.data.map((item) => {
                                const qty = cart?.[String(item.id)] || 0;
                                return (
                                    <MotionArticle
                                        key={item.id}
                                        whileHover={{ y: -6 }}
                                        className="relative bg-white rounded-2xl border p-6 shadow-sm hover:shadow-lg transition"
                                    >
                                        <div className="absolute -top-6 left-6">
                                            <img
                                                src={item.img}
                                                alt={item.name}
                                                className="w-28 h-28 object-cover rounded-full border-4 border-white shadow-md"
                                            />
                                        </div>

                                        <div className="mt-20 text-center">
                                            <h3 className="text-lg font-semibold text-[#045f9a]">
                                                {item.name}
                                            </h3>

                                            <div className="flex items-center justify-center gap-2 mt-2">
                                                <Star className="w-4 h-4 text-[#06b6d4]" />
                                                <span className="text-sm text-slate-600">
                                                    {item.rating || "4.8"}
                                                </span>
                                            </div>

                                            <p className="text-sm text-slate-500 mt-2">
                                                ₹{item.price} • {item.unit}
                                            </p>

                                            <div className="mt-4 flex items-center justify-center gap-3">
                                                <p className="text-xl font-bold text-[#0ea5c9]">
                                                    ₹{item.price}
                                                </p>
                                                <p className="text-xs text-slate-400 line-through">
                                                    ₹{item.price + 30}
                                                </p>
                                            </div>

                                            {/* qty controls */}
                                            <div className="flex items-center justify-center gap-3 mt-4">
                                                <Button
                                                    variant="outline"
                                                    size="icon"
                                                    className="h-8 w-8 rounded-full bg-slate-50"
                                                    disabled={qty === 0}
                                                    onClick={() => removeFromCart(item.id)}
                                                >
                                                    <Minus className="w-4 h-4 text-[#045f9a]" />
                                                </Button>

                                                <span className="w-8 text-center font-semibold text-[#045f9a]">
                                                    {qty}
                                                </span>

                                                <Button
                                                    size="icon"
                                                    className="h-8 w-8 rounded-full bg-[#0284c7] text-white shadow"
                                                    onClick={() => addToCart(item.id)}
                                                >
                                                    <Plus className="w-4 h-4" />
                                                </Button>
                                            </div>

                                            <div className="mt-5 flex flex-col gap-3">
                                                <div className="relative">
  {/* Buy Now Button */}
  <button
    onClick={() =>
      setOpenDropdown(openDropdown === item.id ? null : item.id)
    }
    className="w-full px-4 py-2 bg-gradient-to-r from-[#0284c7] to-[#0369a1] text-white rounded-full text-sm shadow"
  >
    Wash Options ▼
  </button>

  {/* Dropdown */}
  {openDropdown === item.id &&  (
    <div className="absolute z-20 mt-2 w-full bg-white border rounded-xl shadow-lg overflow-hidden">
      
      {/* Iron */}
      <button
        onClick={() => {
          addToCart(item.id, "iron");
          navigate("/addtocard");
          setOpenDropdown(null);
        }}
        className="w-full px-4 py-2 text-sm text-left hover:bg-[#0284c7] hover:text-white transition"
      >
        🔥 Iron
      </button>

      {/* Dry Cleaning */}
      <button
        onClick={() => {
          addToCart(item.id, "dry-cleaning");
          navigate("/addtocard");
          setOpenDropdown(null);
        }}
        className="w-full px-4 py-2 text-sm text-left hover:bg-[#0284c7] hover:text-white transition"
      >
        🧼 Dry Cleaning
      </button>

      {/* Wash & Iron */}
      <button
        onClick={() => {
          addToCart(item.id, "wash-iron");
          navigate("/addtocard");
          setOpenDropdown(null);
        }}
        className="w-full px-4 py-2 text-sm text-left hover:bg-[#0284c7] hover:text-white transition"
      >
        👕 Wash & Iron
      </button>

    </div>
  )}
</div>


                                                <button
                                                    onClick={() => addToCart(item.id)}
                                                    className="px-4 py-2 border border-[#0284c7] text-[#0284c7] rounded-full text-sm hover:bg-[#0284c7] hover:text-white transition"
                                                >
                                                    Add to Cart
                                                </button>
                                            </div>
                                        </div>
                                    </MotionArticle>
                                );
                            })}
                        </div>
                    </div>
                    ))}
            </section>

             {/* ========== ABOUT US SECTION ========== */}
            <section className="w-full max-w-6xl mx-auto px-4 py-16">
                <p className="text-5xl font-bold text-[#034f7a] text-center ">WE ARE CHOOSE DOBHIWALA</p>
                <br />
                <br />
                <div className="grid grid-cols-1 md:grid-cols-2  items-center ">

                    {/* LEFT IMAGE WITH ANIMATION */}
                    <MotionDiv
                        initial={{ opacity: 0, x: -60 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.7 }}
                        viewport={{ once: true }}
                        className="relative"
                    >
                        <img
                            src="https://images.pexels.com/photos/5591590/pexels-photo-5591590.jpeg"
                            className="w-120 rounded-3xl shadow-xl object-cover"
                            alt="Laundry"
                        />

                        {/* EXPERIENCE BADGE */}
                        <MotionDiv
                            initial={{ scale: 0 }}
                            animate={{ scale: 1 }}
                            transition={{ duration: 0.6, type: "spring" }}
                            className="absolute bottom-2 right-5 bg-[#0284c7] text-white w-28 h-28 rounded-full flex flex-col items-center justify-center shadow-2xl"
                        >
                            <span className="text-2xl font-bold">25</span>
                            <span className="text-sm text-white/90 text-center leading-tight">
                                years of <br /> experience
                            </span>
                        </MotionDiv>
                    </MotionDiv>

                    {/* RIGHT TEXT BLOCK */}
                    <MotionDiv
                        initial={{ opacity: 0, y: 40 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.7 }}
                        viewport={{ once: true }}
                    >
                        <p className="text-[#0ea5e9] font-semibold text-sm mb-2">
                            [ More than 25 Years of Experience ]
                        </p>

                        <h2 className="text-3xl sm:text-4xl font-bold text-[#034f7a] leading-snug">
                            We are Passionate About <br /> Laundry
                        </h2>

                        <p className="text-slate-600 mt-4 leading-relaxed text-sm sm:text-base">
                            Hum laundry aur dry cleaning ke professionals hain.
                            Latest machines, eco-friendly detergents aur advance cleaning methods ka use karte hain.
                            Ek baat yaad rakhna—**kapde humse zyada koi samajh hi nahi sakta!**
                            (Aur haan… hum kapde dhote hain, *relationship* nahi 😄)
                        </p>

                        {/* FEATURE LIST */}
                        <ul className="mt-6 space-y-3 text-sm sm:text-base">
                            {[
                                "100% Customer Satisfaction",
                                "Free Pickup & Delivery",
                                "Affordable Prices",
                                "Best Quality Service",
                            ].map((item, idx) => (
                                <li key={idx} className="flex items-center gap-3 text-slate-700">
                                    <span className="text-[#0284c7] font-bold text-xl">✔</span>
                                    {item}
                                </li>
                            ))}
                        </ul>

                        {/* CALL BOX WITH HOVER EFFECT */}
                        <MotionDiv
                            whileHover={{ scale: 1.03 }}
                            className="mt-10 flex items-center gap-4 p-4 rounded-2xl bg-white shadow-lg border border-blue-100 transition"
                        >
                            <div className="w-12 h-12 flex items-center justify-center rounded-full bg-blue-50 shadow">
                                <svg
                                    className="w-6 h-6 text-[#0284c7]"
                                    fill="none"
                                    stroke="currentColor"
                                    strokeWidth="2"
                                    viewBox="0 0 24 24"
                                >
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        d="M2 4.5v15a1.5 1.5 0 001.5 1.5h17A1.5 1.5 0 0022 19.5v-15A1.5 1.5 0 0020.5 3h-17A1.5 1.5 0 002 4.5z"
                                    />
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        d="M16 15l-4-4-4 4"
                                    />
                                </svg>
                            </div>

                            <div>
                                <p className="text-slate-600 text-sm">Call for Quality Services</p>
                                <p className="text-xl font-bold text-[#034f7a]">
                                    +91 98765 43210
                                </p>
                            </div>
                        </MotionDiv>
                    </MotionDiv>
                </div>
            </section>

            {/* ========== 8-STEP CLEANING FORMULA ========== */}
            <section className="w-full max-w-6xl mx-auto px-4 mb-20">
                <h2 className="text-2xl md:text-3xl text-center font-bold text-[#034f7a] mb-8">8-Step DhobiWala Cleaning Formula</h2>

                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
                    {[
                        "Dirty Clothes",
                        "Easy Scheduling",
                        "Pickup",
                        "Sorting & Inspection",
                        "Washing & Drying",
                        "Ironing & Finishing",
                        "Quality Check",
                        "Delivery",
                    ].map((label, i) => (
                        <div key={i} className="bg-white rounded-xl p-6 text-center border shadow-sm hover:shadow-md transition">
                            <div className="w-12 h-12 mx-auto flex items-center justify-center rounded-full bg-[#e6f9ff] text-[#0284c7] font-bold text-lg mb-4">
                                {i + 1}
                            </div>
                            <h3 className="text-lg font-semibold text-[#045f9a]">{label}</h3>
                        </div>
                    ))}
                </div>
            </section>
        </div>
    );
}

/* ---------- Small UI subcomponents ---------- */

function TabButton({ label, active, onClick }) {
    return (
        <button
            onClick={onClick}
            className={`px-4 py-2 rounded-full font-medium text-sm transition ${active ? "bg-[#0284c7] text-white shadow" : "text-slate-600 bg-white/60 border border-slate-100 hover:text-[#0284c7]"
                }`}
        >
            {label}
        </button>
    );
}

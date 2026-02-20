import React, { useState } from "react";
import {
  Phone,
  Mail,
  MapPin,
  MessageCircle,
  Clock,
  Send,
} from "lucide-react";
import { createContactApi } from "../../lib/backendApi";

const Contact = () => {
  const [form, setForm] = useState({ name: "", email: "", phone: "", message: "" });
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState("");
  const [error, setError] = useState("");

  const handleChange = (e) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
    setError("");
    setSuccess("");
  };

  const validate = () => {
    if (!form.name.trim() || !form.email.trim() || !form.message.trim()) return false;
    // Simple email regex
    if (!/^\S+@\S+\.\S+$/.test(form.email)) return false;
    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");
    if (!validate()) {
      setError("Please fill all required fields with valid info.");
      return;
    }
    setLoading(true);
    try {
      const result = await createContactApi(form);
      if (result.success) {
        setSuccess("Thank you! We have received your message.");
        setForm({ name: "", email: "", phone: "", message: "" });
      } else {
        setError(result.message || "Something went wrong.");
      }
    } catch {
      setError("Network error. Please try again.");
    }
    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#e3f6ff] via-[#f7fbff] to-[#d2eaff] py-16 px-6 text-gray-800">
      <div className="max-w-6xl mx-auto bg-white shadow-xl rounded-3xl p-10 border border-blue-100">
        {/* HEADER */}
        <h1 className="text-4xl font-bold text-center text-blue-700 mb-3">
          Contact <span className="text-blue-500">DhobiWala</span>
        </h1>
        <p className="text-gray-600 text-lg text-center mb-10">
          Kapde saaf karna humara kaam,
          <span className="font-semibold">aapka din easy banana hamara iraada.</span>
        </p>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* LEFT: CONTACT DETAILS */}
          <div className="space-y-8">
            <div className="flex items-start gap-4 p-5 bg-blue-50 border rounded-2xl shadow">
              <Phone className="w-10 h-10 text-blue-600" />
              <div>
                <h3 className="text-xl font-semibold text-blue-700">Call Us</h3>
                <p className="text-gray-700">+91 98765 43210</p>
                <p className="text-gray-500 text-sm">7 AM - 10 PM (Everyday)</p>
              </div>
            </div>

            <div className="flex items-start gap-4 p-5 bg-green-50 border rounded-2xl shadow">
              <Mail className="w-10 h-10 text-green-600" />
              <div>
                <h3 className="text-xl font-semibold text-green-700">Email</h3>
                <p className="text-gray-700">support@dhobiwala.com</p>
                <p className="text-gray-500 text-sm">Response within 2 hours</p>
              </div>
            </div>

            <div className="flex items-start gap-4 p-5 bg-purple-50 border rounded-2xl shadow">
              <MapPin className="w-10 h-10 text-purple-600" />
              <div>
                <h3 className="text-xl font-semibold text-purple-700">Our Location</h3>
                <p className="text-gray-700">
                  45, Laundry Street,<br />
                  Near City Market,<br />
                  Jaipur, Rajasthan
                </p>
              </div>
            </div>

            <div className="flex items-start gap-4 p-5 bg-yellow-50 border rounded-2xl shadow">
              <Clock className="w-10 h-10 text-yellow-600" />
              <div>
                <h3 className="text-xl font-semibold text-yellow-700">Working Hours</h3>
                <p className="text-gray-700">Pickup: 7AM - 1PM</p>
                <p className="text-gray-700">Delivery: 4PM - 10PM</p>
              </div>
            </div>

            <a
              href="https://wa.me/919876543210"
              target="_blank"
              rel="noreferrer"
              className="flex items-center gap-3 bg-green-600 hover:bg-green-700 text-white px-5 py-3 rounded-xl text-lg shadow-lg w-fit"
            >
              <MessageCircle className="w-6 h-6" /> WhatsApp Support
            </a>
          </div>

          {/* RIGHT: CONTACT FORM */}
          <div className="bg-[#f7fbff] border border-blue-200 rounded-2xl shadow-xl p-8">
            <h2 className="text-2xl font-bold text-gray-800 mb-5">Send Us a Message</h2>

            <form className="space-y-5" onSubmit={handleSubmit}>
              <div>
                <label className="text-gray-700 font-medium">Full Name <span className="text-red-500">*</span></label>
                <input
                  type="text"
                  name="name"
                  value={form.name}
                  onChange={handleChange}
                  className="w-full mt-1 border border-gray-300 rounded-lg p-3 bg-white outline-none focus:ring-2 focus:ring-blue-400"
                  placeholder="Enter your name"
                  required
                />
              </div>
              <div>
                <label className="text-gray-700 font-medium">Email <span className="text-red-500">*</span></label>
                <input
                  type="email"
                  name="email"
                  value={form.email}
                  onChange={handleChange}
                  className="w-full mt-1 border border-gray-300 rounded-lg p-3 bg-white outline-none focus:ring-2 focus:ring-blue-400"
                  placeholder="Enter your email"
                  required
                />
              </div>
              <div>
                <label className="text-gray-700 font-medium">Phone Number</label>
                <input
                  type="tel"
                  name="phone"
                  value={form.phone}
                  onChange={handleChange}
                  className="w-full mt-1 border border-gray-300 rounded-lg p-3 bg-white outline-none focus:ring-2 focus:ring-blue-400"
                  placeholder="Enter your mobile number (optional)"
                />
              </div>
              <div>
                <label className="text-gray-700 font-medium">Message <span className="text-red-500">*</span></label>
                <textarea
                  rows="4"
                  name="message"
                  value={form.message}
                  onChange={handleChange}
                  className="w-full mt-1 border border-gray-300 rounded-lg p-3 bg-white outline-none focus:ring-2 focus:ring-blue-400"
                  placeholder="How can we help you?"
                  required
                ></textarea>
              </div>
              {error && <div className="text-red-600 text-sm font-semibold">{error}</div>}
              {success && <div className="text-green-600 text-sm font-semibold">{success}</div>}
              <button
                type="submit"
                className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-lg text-lg flex justify-center items-center gap-2 shadow-lg disabled:opacity-60"
                disabled={loading}
              >
                {loading ? (
                  <span className="animate-spin mr-2"><Send className="w-5 h-5" /></span>
                ) : (
                  <Send className="w-5 h-5" />
                )}
                {loading ? "Sending..." : "Send Message"}
              </button>
            </form>
          </div>
        </div>

        {/* MAP SECTION */}
        <div className="mt-16">
          <h2 className="text-3xl font-bold text-gray-800 text-center mb-5">Find Us on Map</h2>

          <iframe
            title="DhobiWala Location"
            src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3559.522169715477!2d75.818525!3d26.862154!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x396db66ea3b453a1%3A0xf0ece4f0a3b8573e!2sJaipur%2C%20Rajasthan"
            className="w-full h-72 rounded-2xl border shadow"
            allowFullScreen=""
            loading="lazy"
          ></iframe>
        </div>
      </div>
    </div>
  );
};

export default Contact;

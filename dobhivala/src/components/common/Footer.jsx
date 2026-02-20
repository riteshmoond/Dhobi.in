import React from "react";
import { useLocation } from "react-router-dom";
import {
  Facebook,
  Instagram,
  Twitter,
  Mail,
  Phone,
  MapPin,
} from "lucide-react";
import { Button } from "@/components/ui/button";

const Footer = ({
  branding = { brandName: "DobhiWala" },
  contact = {
    supportPhone: "+91 98765 43210",
    supportEmail: "help@dobhiwala.in",
    supportAddress: "Jaipur, Rajasthan",
  },
}) => {
  const location = useLocation();

  const hiddenPaths = ["/addtocard", "/checkout", "/admin", "/order-success", "/track-order"];
  if (hiddenPaths.some((path) => location.pathname.startsWith(path))) {
    return null;
  }

  return (
    <footer className="bg-gradient-to-br from-[#dff3ff] via-[#eaf8ff] to-[#cfeaff] pt-14 pb-6 text-[#034f7a] relative overflow-hidden">
      <div className="absolute -top-10 -right-10 w-40 h-40 bg-sky-300/20 rounded-full blur-3xl"></div>
      <div className="absolute bottom-0 left-0 w-60 h-60 bg-sky-200/20 rounded-full blur-3xl"></div>

      <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-10 relative z-10">
        <div>
          <h2 className="text-3xl font-bold text-[#007acc] mb-4 tracking-wide">
            {branding.brandName || "DobhiWala"}
          </h2>
          <p className="text-sm leading-relaxed text-slate-700">
            Fast, affordable and reliable laundry and dry-cleaning service.
            Fresh clothes, fresh life every single time.
          </p>
        </div>

        <div>
          <h3 className="text-lg font-semibold text-[#0369a1] mb-3">Quick Links</h3>
          <ul className="space-y-2 text-sm">
            {[
              "Home",
              "Services",
              "Pricing",
              "Contact",
              "Book Now",
              "FAQ",
              "Privacy Policy",
              "Terms & Conditions",
            ].map((link, i) => (
              <li key={i}>
                <a
                  href="#"
                  className="relative inline-block text-slate-700 hover:text-[#0284c7] transition"
                >
                  {link}
                </a>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <h3 className="text-lg font-semibold text-[#0369a1] mb-3">Contact Us</h3>
          <ul className="space-y-2 text-sm text-slate-700">
            <li className="flex items-center gap-2">
              <Phone className="w-4 h-4 text-[#0284c7]" /> {contact.supportPhone}
            </li>
            <li className="flex items-center gap-2">
              <Mail className="w-4 h-4 text-[#0284c7]" /> {contact.supportEmail}
            </li>
            <li className="flex items-center gap-2">
              <MapPin className="w-4 h-4 text-[#0284c7]" /> {contact.supportAddress}
            </li>
          </ul>
        </div>

        <div>
          <h3 className="text-lg font-semibold text-[#0369a1] mb-3">Subscribe to Updates</h3>
          <p className="text-sm text-slate-700 mb-3">
            Get offers, discounts and service alerts delivered to your inbox.
          </p>

          <div className="flex flex-col sm:flex-row gap-2">
            <input
              type="email"
              placeholder="Enter your email"
              className="flex-1 px-4 py-2 text-sm rounded-full bg-white shadow-inner border border-sky-200 focus:outline-none focus:ring-2 focus:ring-[#0284c7]"
            />
            <Button className="bg-[#0284c7] hover:bg-[#0369a1] text-white rounded-full px-5">
              Subscribe
            </Button>
          </div>
        </div>
      </div>

      <div className="border-t border-sky-300 mt-10 pt-4 max-w-7xl mx-auto px-6 flex flex-col md:flex-row justify-between items-center gap-4 text-sm text-slate-700 relative z-10">
        <p>© {new Date().getFullYear()} {branding.brandName || "DobhiWala"}. All Rights Reserved.</p>

        <div className="flex items-center gap-5">
          {[Facebook, Instagram, Twitter].map((Icon, i) => (
            <a
              key={i}
              href="#"
              className="p-2 rounded-full hover:bg-white shadow hover:shadow-md transition text-[#0369a1]"
            >
              <Icon className="w-5 h-5" />
            </a>
          ))}
        </div>
      </div>
    </footer>
  );
};

export default Footer;

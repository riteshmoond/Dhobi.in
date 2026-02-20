import React, { useEffect, useState } from "react";
import { ShoppingCart, Menu, ClipboardList, LogOut } from "lucide-react";
import { Button } from "@/components/ui/button";
import logo from "@/assets/logo.png";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { NavLink, useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../../context/useAuth";

const Header = ({
  totalItems = 0,
  subtotal = 0,
  categoryVisibility = { men: true, female: true, kids: true },
  branding = { brandName: "DobhiWala", logoUrl: "" },
}) => {
  const [open, setOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const { user, admin, logoutCustomer, logoutAdmin } = useAuth();

  const allLinks = [
    { name: "Home", path: "/" },
    { name: "Male", path: "/male" },
    { name: "Female", path: "/female" },
    { name: "Kids", path: "/kids" },
    { name: "About", path: "/about" },
    { name: "Contact", path: "/contact" },
  ];
  const links = allLinks.filter((link) => {
    if (link.path === "/male") return categoryVisibility.men !== false;
    if (link.path === "/female") return categoryVisibility.female !== false;
    if (link.path === "/kids") return categoryVisibility.kids !== false;
    return true;
  });

  useEffect(() => {
    const onResize = () => {
      if (window.innerWidth >= 1024) setOpen(false);
    };
    window.addEventListener("resize", onResize);
    return () => {
      window.removeEventListener("resize", onResize);
    };
  }, []);

  useEffect(() => {
    setOpen(false);
  }, [location.pathname]);

  const hiddenPaths = [
    "/auth",
    "/login",
    "/addtocard",
    "/checkout",
    "/order-success",
    "/track-order",
    "/admin",
  ];

  if (hiddenPaths.some((path) => location.pathname.startsWith(path))) {
    return null;
  }

  const handleLogout = () => {
    if (admin) {
      logoutAdmin();
    } else if (user) {
      logoutCustomer();
    } else {
      logoutCustomer();
      logoutAdmin();
    }
    navigate("/auth", { replace: true });
  };

  return (
    <nav className="fixed top-0 left-0 z-50 w-full bg-sky-100/80 backdrop-blur-md shadow-sm">
      <div className="max-w-6xl mx-auto flex items-center justify-between px-4 md:px-6 h-24">
        <img
          src={branding.logoUrl || logo}
          alt={`${branding.brandName || "DobhiWala"} Logo`}
          className="h-24 w-32 cursor-pointer rounded-full object-contain"
          onClick={() => navigate("/")}
          onError={(e) => {
            e.currentTarget.src = logo;
          }}
        />

        <ul className="hidden lg:flex items-center space-x-8 text-gray-800 font-medium">
          {links.map((link) => (
            <li key={link.path}>
              <NavLink
                to={link.path}
                className={({ isActive }) =>
                  `transition-colors duration-300 ${
                    isActive ? "text-sky-600 font-semibold" : "hover:text-sky-600"
                  }`
                }
              >
                {link.name}
              </NavLink>
            </li>
          ))}
        </ul>

        <div className="hidden lg:flex items-center gap-3">
          <Button
            className="relative h-11 w-11 rounded-full bg-sky-600 text-white shadow-md transition-all hover:bg-sky-700 hover:shadow-lg focus-visible:ring-2 focus-visible:ring-sky-400"
            size="icon"
            onClick={() => navigate("/addtocard")}
            title="Open Cart"
          >
            <ShoppingCart className="h-5 w-5" />
            {totalItems > 0 ? (
              <span className="absolute -right-1.5 -top-1.5 flex min-w-[20px] items-center justify-center rounded-full bg-red-500 px-1.5 py-0.5 text-[10px] font-bold leading-none text-white ring-2 ring-sky-100">
                {totalItems > 99 ? "99+" : totalItems}
              </span>
            ) : null}
            <span className="sr-only">Cart</span>
          </Button>

          <div className="text-right leading-tight min-w-16">
            <div className="text-sm font-semibold text-sky-800">Rs {subtotal}</div>
            <div className="text-xs text-sky-600">Estimated</div>
          </div>

          <Button variant="outline" onClick={() => navigate("/orders")}>
            <ClipboardList className="w-4 h-4 mr-1" />
            My Orders
          </Button>

          <Button
            variant="destructive"
            size="icon"
            onClick={handleLogout}
            title="Logout"
          >
            <LogOut className="w-4 h-4" />
          </Button>

         
        </div>

        <div className="lg:hidden">
          <Sheet open={open} onOpenChange={setOpen}>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon" className="text-sky-600">
                <Menu className="h-6 w-6" />
              </Button>
            </SheetTrigger>
            <SheetContent
              side="right"
              className="bg-sky-50/95 border-l border-sky-200 backdrop-blur-md rounded-l-2xl p-6"
            >
              <SheetHeader>
                <SheetTitle className="text-xl font-bold text-sky-600">
                  {branding.brandName || "DobhiWala"}
                </SheetTitle>
                <SheetDescription className="text-slate-600">
                  Navigate pages, open cart, and check your orders.
                </SheetDescription>
              </SheetHeader>
              <ul className="flex flex-col space-y-4 text-gray-800 font-medium mt-6">
                {links.map((link) => (
                  <li key={link.path}>
                    <NavLink
                      to={link.path}
                      onClick={() => setOpen(false)}
                      className={({ isActive }) =>
                        `block px-3 py-2 rounded-md transition-all ${
                          isActive
                            ? "bg-sky-100 text-sky-600 font-semibold"
                            : "hover:bg-sky-100 hover:text-sky-600"
                        }`
                      }
                    >
                      {link.name}
                    </NavLink>
                  </li>
                ))}
              </ul>

              <div className="mt-6 space-y-3">
                <Button
                  onClick={() => {
                    setOpen(false);
                    navigate("/addtocard");
                  }}
                  className="w-full rounded-full bg-sky-600 hover:bg-sky-700 gap-2"
                >
                  <ShoppingCart className="w-5 h-5 text-white" />
                  View Cart ({totalItems})
                </Button>
                <Button
                  variant="outline"
                  className="w-full rounded-full"
                  onClick={() => {
                    setOpen(false);
                    navigate("/orders");
                  }}
                >
                  <ClipboardList className="w-4 h-4 mr-2" />
                  My Orders
                </Button>
                <Button
                  variant="destructive"
                  className="w-full rounded-full gap-2"
                  onClick={handleLogout}
                >
                  <LogOut className="w-4 h-4" />
                  Logout
                </Button>
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </nav>
  );
};

export default Header;

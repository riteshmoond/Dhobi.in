# 🧺 Dhobi.in - Online Laundry Service Platform

A modern, full-featured laundry service management platform built with React and Vite, featuring both customer-facing services and a comprehensive admin panel.

## 🌟 Features

### Customer Features
- 👕 **Service Categories**: Men, Female, and Kids laundry services
- 🛒 **Shopping Cart**: Add/remove services with real-time pricing
- 💳 **Secure Checkout**: Complete order placement with address details
- 📦 **Order Tracking**: Real-time tracking of laundry orders with 6-step status
- ⭐ **Ratings & Reviews**: Leave feedback on completed services
- 👤 **Order History**: View past orders and track details

### Admin Features
Complete business management system with:
- 📊 **Comprehensive Dashboard**: Business metrics and quick insights
- 📋 **Order Management**: Search, filter, and update order statuses
- 👥 **Customer Management**: View all customers and their purchase history
- 🛍️ **Service Management**: Edit pricing, names, and service offerings
- ⭐ **Review Management**: Manage customer ratings and feedback
- ⚙️ **Settings Panel**: Configure delivery charges, business hours, and more
- 📥 **Data Export**: Download data as CSV for analytics

---

## 🚀 Quick Start

### Installation
```bash
npm install
```

### Development
```bash
npm run dev
```

### Build
```bash
npm run build
```

### Preview
```bash
npm run preview
```

---

## 📱 User Access

### Customer Portal
- Access the main website at `/`
- Browse services by category
- Add items to cart and checkout
- Track orders and leave reviews

### Admin Panel
- **URL**: `/admin`
- **Login Page**: `/admin/login`
- **Default Credentials**: 
  - Email: `admin@dhobi.in`
  - Password: `admin123`

**⚠️ Change default credentials in production!**

---

## 📁 Project Structure

```
dobhivala/
├── src/
│   ├── pages/           # Page components
│   │   ├── AdminPanel.jsx      # Admin dashboard
│   │   ├── AdminLogin.jsx      # Admin login
│   │   ├── Home.jsx
│   │   ├── Male.jsx
│   │   ├── Female.jsx
│   │   ├── Kids.jsx
│   │   ├── Checkout.jsx
│   │   ├── MyOrders.jsx
│   │   ├── OrderTracking.jsx
│   │   └── ...
│   ├── component/       # Reusable components
│   │   ├── Header.jsx
│   │   ├── Footer.jsx
│   │   ├── CartContext.jsx
│   │   ├── AdminRoute.jsx
│   │   └── ...
│   ├── components/      # UI components (shadcn)
│   ├── lib/            # Utilities & helpers
│   │   ├── adminAuth.js
│   │   ├── orderTracking.js
│   │   ├── servicesStore.js
│   │   └── utils.ts
│   ├── App.jsx
│   └── main.jsx
├── public/             # Static assets
├── ADMIN_PANEL_GUIDE.md # Admin documentation
└── package.json
```

---

## 🔐 Authentication

### Admin Authentication
- Simple email/password based auth
- Session stored in localStorage
- Protected routes using `AdminRoute` wrapper
- Demo credentials for testing

---

## 💾 Data Management

### Local Storage Keys
- `dobhivala_cart_v2` - Shopping cart data
- `orders` - Customer orders
- `customer_ratings` - Reviews and ratings
- `dobhivala_admin_session` - Admin session token
- `admin_settings` - Admin configuration

---

## 📚 Documentation

For detailed admin panel documentation, see [Admin Panel Guide](ADMIN_PANEL_GUIDE.md)

### Key Admin Sections:
1. **Dashboard** - Business overview and analytics
2. **Orders** - Order management with search/filter
3. **Customers** - Customer list and insights
4. **Services** - Service catalog management
5. **Reviews** - Customer feedback management
6. **Settings** - System configuration

---

## 🛠️ Tech Stack

- **Frontend**: React 18 + Vite
- **Styling**: Tailwind CSS
- **UI Components**: shadcn/ui
- **Icons**: Lucide React
- **Routing**: React Router v6
- **State**: React Context API + localStorage

---

## 📊 Order Tracking System

Orders progress through 6 stages:
1. **Order Received** - Order placed
2. **Washing** - Items being washed
3. **Drying** - Items being dried
4. **Ironing** - Items being ironed
5. **Out For Delivery** - On the way to customer
6. **Delivered** - Order completed

---

## 🎨 Design Features

- Modern gradient UI with sky blue theme
- Fully responsive design (mobile-first)
- Smooth animations and transitions
- Accessible interface
- Clean and intuitive layouts

---

## 🔄 Features Workflow

### Customer Order Flow
1. Browse services by category
2. Add items to cart
3. Review cart
4. Proceed to checkout
5. Enter address and payment details
6. Place order
7. Receive order confirmation
8. Track order status
9. Rate service after completion

### Admin Workflow
1. Login to admin panel
2. View dashboard metrics
3. Manage orders and statuses
4. Monitor customer data
5. Update service pricing
6. Handle customer reviews
7. Configure system settings
8. Export data for analytics

---

## 🐛 Common Issues & Solutions

See [Admin Panel Guide](ADMIN_PANEL_GUIDE.md#troubleshooting) for troubleshooting section.

---

## 📄 License

This project is part of the Dhobi.in ecosystem.

---

## 📞 Support

For admin panel support, visit the [Admin Panel Guide](ADMIN_PANEL_GUIDE.md).

---

**Made with ❤️ for a cleaner laundry experience**

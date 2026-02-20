# dobhiWala - Folder Structure Guide

## Recommended Folder Structure

```
dobhivala/
├── src/
│   ├── assets/                    # Images, logos, icons
│   │   └── logo.png
│   │
│   ├── components/               
│   │   ├── admin/                # Admin-specific components
│   │   │   ├── AdminRoute.jsx
│   │   │   └── ...
│   │   │
│   │   ├── common/               # Shared components
│   │   │   ├── Header.jsx
│   │   │   ├── Footer.jsx
│   │   │   └── ...
│   │   │
│   │   └── ui/                   # UI Library components
│   │       ├── button.tsx
│   │       ├── card.tsx
│   │       ├── input.tsx
│   │       └── ...
│   │
│   ├── context/                  # React Context (State Management)
│   │   └── AuthContext.jsx
│   │
│   ├── data/                     # Static data, constants
│   │   └── ...
│   │
│   ├── layouts/                  # Layout wrappers
│   │   ├── MainLayout.jsx
│   │   └── AdminLayout.jsx
│   │
│   ├── lib/                      # Utilities & Libraries
│   │   ├── adminAuth.js
│   │   ├── adminSettings.js
│   │   ├── orderTracking.js
│   │   ├── servicesStore.js
│   │   └── utils.ts
│   │
│   ├── pages/
│   │   ├── admin/               # Admin pages
│   │   │   ├── AdminPanel.jsx
│   │   │   ├── AdminDashboard.jsx
│   │   │   ├── AdminCustomers.jsx
│   │   │   ├── AdminOrders.jsx
│   │   │   ├── AdminServices.jsx
│   │   │   ├── AdminSettings.jsx
│   │   │   └── AdminRatings.jsx
│   │   │
│   │   ├── auth/                # Authentication pages
│   │   │   ├── UnifiedAuth.jsx
│   │   │   └── AdminLogin.jsx
│   │   │
│   │   └── user/                # User pages
│   │       ├── Home.jsx
│   │       ├── Male.jsx
│   │       ├── Female.jsx
│   │       ├── Kids.jsx
│   │       ├── About.jsx
│   │       ├── Contact.jsx
│   │       ├── Checkout.jsx
│   │       ├── OrderSuccess.jsx
│   │       ├── MyOrders.jsx
│   │       ├── OrderTracking.jsx
│   │       ├── Rate.jsx
│   │       └── ...
│   │
│   ├── App.jsx
│   ├── App.css
│   ├── main.jsx
│   └── index.css
│
├── public/
├── data/
├── node_modules/
├── components.json
├── eslint.config.js
├── index.html
├── package.json
├── vite.config.js
├── tsconfig.json
└── ...
```

## Why This Structure?

1. **components/** - Contains **reusable components**
   - `admin/` - Admin-specific components
   - `common/` - Shared components (Header, Footer, etc.)
   - `ui/` - UI library components (Button, Card, etc.)

2. **pages/** - **Full page components** organized by role
   - `admin/` - Admin dashboard pages
   - `auth/` - Authentication pages
   - `user/` - Customer/user pages

3. **context/** - React Context for state management (Auth)

4. **lib/** - Utility functions and libraries

5. **layouts/** - Layout wrapper components

6. **assets/** - Static files (images, icons, etc.)

## Files to Move

### Headers & Footers → components/common/
- [ ] Header.jsx
- [ ] Footer.jsx

### Admin Route → components/admin/
- [ ] AdminRoute.jsx

### Auth Pages → pages/auth/
- [ ] UnifiedAuth.jsx
- [ ] AdminLogin.jsx

### Admin Pages → pages/admin/
- [ ] AdminPanel.jsx
- [ ] AdminDashboard.jsx
- [ ] AdminCustomers.jsx
- [ ] AdminOrders.jsx
- [ ] AdminServices.jsx
- [ ] AdminSettings.jsx
- [ ] AdminRatings.jsx

### User Pages → pages/user/
- [ ] Home.jsx
- [ ] Male.jsx
- [ ] Female.jsx
- [ ] Kids.jsx
- [ ] About.jsx
- [ ] Contact.jsx
- [ ] Checkout.jsx
- [ ] OrderSuccess.jsx
- [ ] MyOrders.jsx
- [ ] OrderTracking.jsx
- [ ] Rate.jsx
- [ ] Menservices.jsx
- [ ] Femaleservices.jsx
- [ ] Kidsservices.jsx
- [ ] Homeservices.jsx
- [ ] Addtocard.jsx (or CartPage.jsx)

### Utilities → lib/ or utils/
- [ ] CartContext.jsx (move to context/ or lib/)
- [ ] ProtectedRoute.jsx (move to components/)

## Updated Imports

After moving, update imports in `App.jsx`:

```jsx
// Old:
import Header from "./component/Header";
import AdminLogin from "./pages/AdminLogin";

// New:
import Header from "./components/common/Header";
import AdminLogin from "./pages/auth/AdminLogin";
```

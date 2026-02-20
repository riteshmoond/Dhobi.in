# Admin Panel Quick Reference

## 🔐 Login Credentials
```
Email:    admin@dhobi.in
Password: admin123
```

## 📍 Admin URLs
```
Login:    /admin/login
Panel:    /admin
```

---

## 📊 Dashboard Metrics
| Metric | Meaning |
|--------|---------|
| Total Orders | Complete count of all orders |
| Active | Orders not yet delivered |
| Delivered | Successfully completed orders |
| Revenue | Total income from all orders |
| Customers | Unique customer count |
| Avg Rating | Average customer satisfaction |

---

## 🏷️ Order Status Levels
```
0: Order Received
1: Washing
2: Drying
3: Ironing
4: Out For Delivery
5: Delivered
```

---

## ⚡ Quick Actions

### Orders Tab
- **Search**: Find by Order ID, Customer Name, or Phone
- **Filter**: View All, Active Only, or Delivered Only
- **Update**: Change order status via dropdown
- **Delete**: Remove order permanently
- **Export**: Download as CSV

### Customers Tab
- **View**: See all customer details
- **Track**: Monitor purchase history
- **Export**: Download customer list

### Services Tab
- **Edit**: Change name, unit, price, category
- **Popular**: Mark service as featured
- **Save**: Apply all changes
- **Reset**: Restore default services

### Ratings Tab
- **View**: See all customer reviews
- **Delete**: Remove inappropriate reviews
- **Export**: Download review data

### Settings Tab
- **Delivery Charge**: Set delivery fee per order
- **Min Order Value**: Set minimum order amount
- **Business Hours**: Set operating hours
- **Service Area**: Define delivery zones

---

## 💾 What Gets Stored

| Data | Storage Key | Type |
|------|-------------|------|
| Orders | `orders` | JSON Array |
| Ratings | `customer_ratings` | JSON Array |
| Settings | `admin_settings` | JSON Object |
| Session | `dobhivala_admin_session` | String ("1") |

---

## 🔧 Modification Guide

### Change Admin Password
Edit `/src/lib/adminAuth.js`:
```javascript
export const ADMIN_DEFAULT_PASSWORD = "new_password_here";
```

### Add New Settings Field
1. Add to initial state in `AdminPanel.jsx`
2. Add input field in Settings tab
3. Update `saveSettings()` function
4. Update this reference guide

### Modify Tracking Steps
Edit `/src/lib/orderTracking.js` to change order statuses

### Customize Colors
Search for color codes in `AdminPanel.jsx` (e.g., `sky-600`, `sky-700`)

---

## 📋 Daily Checklist

- [ ] Check dashboard for new orders
- [ ] Update order statuses
- [ ] Review customer feedback
- [ ] Monitor revenue
- [ ] Verify service pricing
- [ ] Check for issues/complaints

---

## 🎯 Weekly Tasks

- [ ] Export orders for backup
- [ ] Export customer list for CRM
- [ ] Review top rated services
- [ ] Check customer satisfaction trends
- [ ] Update service pricing if needed
- [ ] Clear old completed orders
- [ ] Verify delivery charges

---

## 📈 Key Features

✅ **6-Tab Navigation**
- Dashboard
- Orders
- Customers
- Services
- Reviews
- Settings

✅ **Search & Filter**
- Real-time order search
- Status-based filtering
- Category filtering

✅ **Export Functionality**
- CSV export for all data
- Easy data sharing
- Backup capability

✅ **Customer Insights**
- Total spending per customer
- Order count tracking
- Contact information

✅ **Service Control**
- Full pricing management
- Popular service marking
- Category organization

✅ **Configuration**
- Delivery charges
- Minimum order value
- Business hours
- Service areas

---

## 🔒 Security Reminders

⚠️ **IMPORTANT**

1. ✅ Change default password immediately
2. ✅ Don't share admin credentials
3. ✅ Logout when done
4. ✅ Regular data backups
5. ✅ Clear cache on public computers
6. ✅ Use strong password in production

---

## 🆘 Emergency Actions

### Lost Admin Access
- Clear browser cookies/localStorage
- Try incognito/private mode
- Reset browser cache

### Need to Delete Order
1. Go to Orders tab
2. Search for order
3. Click Delete button
4. Confirm action

### Emergency Logout
- Click Logout button
- Browser back button
- Manual URL navigation

---

## 📞 Support Reference

### All Data Backed Up?
- Go to Orders → Export
- Go to Customers → Export
- Go to Ratings → Export (if available)

### Settings Lost?
- Check `/admin-settings` in localStorage
- Restore from backup if available

### Orders Not Updating?
- Click Refresh button
- Check browser console
- Clear browser cache

---

## 🎓 Learning Path

**New Admin?** Follow this order:
1. Read ADMIN_PANEL_GUIDE.md
2. Review this Quick Reference
3. Login to admin panel
4. Explore Dashboard first
5. Practice with test orders
6. Master Services management
7. Learn Customer tracking
8. Configure Settings

---

**Last Updated:** February 2026
**Admin Panel Version:** 2.0 Enhanced

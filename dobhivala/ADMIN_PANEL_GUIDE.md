# Dhobi Admin Panel - Complete User Guide

## Overview
The Dhobi Admin Panel is a comprehensive business management system designed for managing laundry orders, customers, services, ratings, and system settings.

---

## Login
**Access Path:** `/admin/login`

### Default Credentials:
- **Email:** `admin@dhobi.in`
- **Password:** `admin123`

⚠️ **Important:** Change these credentials in production!

---

## Features & Tabs

### 1. **Dashboard** (Home View)
The dashboard provides a quick overview of your business metrics.

#### Key Metrics:
- **Total Orders** - Complete count of all orders
- **Active Orders** - Orders still in progress (not delivered)
- **Delivered** - Successfully completed orders
- **Revenue** - Total income from all orders
- **Customers** - Unique customer count
- **Avg Rating** - Average customer rating across all reviews

#### Quick Views:
- **Recent Orders** - Last 5 orders placed
- **Top Services** - Services marked as popular

---

### 2. **Orders Management**
Complete order tracking and management system.

#### Features:
- 🔍 **Search** - Find orders by:
  - Order ID
  - Customer name
  - Phone number
- 🏷️ **Filter by Status**:
  - All Status
  - Active Orders (in progress)
  - Delivered
- 📊 **Order Details**:
  - Order ID and item count
  - Customer name and phone
  - Delivery address
  - Total amount
  - Current status
- ⚙️ **Actions**:
  - Update order tracking step
  - Delete orders
  - Refresh data
- 📥 **Export as CSV** - Download all filtered orders

#### Tracking Steps:
1. Order Received
2. Washing
3. Drying
4. Ironing
5. Out For Delivery
6. Delivered

---

### 3. **Customer Management**
View and manage all customers.

#### Customer Information:
- Customer name
- Email address
- Phone number
- City
- Number of orders placed
- Total amount spent

#### Tracking:
- Identify loyal customers
- Monitor purchase history
- View contact information

#### Export:
- Download customer list as CSV
- Track customer growth
- Customer analytics

---

### 4. **Service Management**
Manage service offerings, pricing, and categories.

#### Editable Fields:
- **Service Name** - Name of the service
- **Unit** - Measurement unit (e.g., Kg, Shirt, Pair)
- **Price** - Cost in rupees
- **Category** - Men / Female / Kids
- **Popular** - Checkbox to mark as featured service

#### Category View:
- View services by category
- See count of services per category:
  - Men services
  - Female services
  - Kids services

#### Actions:
- ✏️ **Edit Services** - Modify any service details
- 💾 **Save Changes** - Apply modifications to database
- 🔄 **Reset Default** - Restore original service list

---

### 5. **Reviews & Ratings**
Manage customer feedback and ratings.

#### Review Information:
- Customer name
- Star rating (1-5 stars)
- Review text/comment
- Review date

#### Actions:
- View all customer reviews
- Delete negative/spam reviews
- Monitor customer satisfaction
- Track rating trends

#### Star Display:
- Visual star representation (⭐⭐⭐⭐⭐)
- Easy identification of feedback quality

---

### 6. **Settings**
System-wide configuration and business parameters.

#### Configurable Settings:
1. **Delivery Charge**
   - Amount charged per delivery
   - In rupees
   - Applied to all orders

2. **Minimum Order Value**
   - Minimum order amount required
   - Prevents very small orders
   - In rupees

3. **Business Hours**
   - Operating hours
   - Format: "9 AM - 9 PM"
   - Displayed to customers

4. **Service Area**
   - Geographic coverage
   - Can specify zones/areas
   - Example: "All", "Zone-A", "Zone-B"

#### Action:
- 💾 **Save Settings** - Apply changes (confirmed by alert)

---

## Data Storage

### Local Storage Keys:
- `orders` - All customer orders
- `customer_ratings` - Customer reviews
- `admin_settings` - System configuration
- `dobhivala_admin_session` - Admin login session

### Export Functionality:
All data can be exported as CSV for:
- Backup purposes
- External analysis
- Record keeping
- Business intelligence

---

## Key Features Explained

### 1. Search & Filter System
- **Real-time search** across multiple fields
- **Status-based filtering** for quick navigation
- **Display count** of filtered results

### 2. Order Tracking
- **6-step tracking system** from order to delivery
- **Manual status updates** for admin control
- **Automatic status calculation** based on order timestamp

### 3. Customer Insights
- **Automatic customer grouping** by phone number
- **Spending analytics** per customer
- **Order history** for each customer

### 4. Service Management
- **Category-based organization**
- **Popular flag** for featured services
- **Real-time pricing control**

### 5. Export & Analytics
- **CSV export** for all data types
- **Custom date preservation**
- **Easy data sharing**

---

## Best Practices

### Order Management:
1. Regularly update order statuses
2. Use search feature for quick lookups
3. Filter by status to see pending work
4. Delete completed orders after reconciliation

### Service Management:
1. Keep popular services updated
2. Review and adjust pricing regularly
3. Use categories effectively
4. Maintain service unit consistency

### Customer Management:
1. Monitor customer spending patterns
2. Identify repeat customers
3. Handle customer queries using contact info
4. Use export for CRM integration

### Settings:
1. Update delivery charges seasonally
2. Adjust minimum order value as per business rules
3. Maintain accurate business hours
4. Clearly define service areas

### Reviews:
1. Monitor customer satisfaction
2. Remove negative/inappropriate reviews
3. Track quality improvements
4. Use feedback for service enhancement

---

## Logout
- Click the **"Logout"** button in the header
- Clears admin session
- Redirects to login page

---

## Troubleshooting

### Can't login?
- Verify email: `admin@dhobi.in`
- Check password: `admin123`
- Clear browser cache and try again

### Data not updating?
- Click "Refresh" button in Orders section
- Check browser console for errors
- Ensure JavaScript is enabled

### Export not working?
- Check browser pop-up permissions
- Ensure popup blocker is disabled
- Try different browser

### Lost data?
- Check browser's localStorage
- Clear cache carefully
- Backup data regularly using export

---

## Security Notes

⚠️ **Important Security Measures:**

1. **Change default credentials immediately**
2. **Use strong password in production**
3. **Don't share login credentials**
4. **Logout when not in use**
5. **Clear browser history on shared devices**
6. **Regular data backups using export**

---

## Support & Maintenance

### Regular Tasks:
- Export and backup data weekly
- Review and delete expired orders
- Update service pricing as needed
- Monitor customer satisfaction ratings
- Check and update settings regularly

### Performance Tips:
- Clear old orders periodically
- Keep service list updated
- Archive old data
- Monitor system performance

---

## Version Information
- **Admin Panel Version:** 2.0 (Enhanced)
- **Last Updated:** February 2026
- **Features:** Complete business management

---

**Thank you for using Dhobi Admin Panel!**

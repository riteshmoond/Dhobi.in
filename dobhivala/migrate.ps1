#!/usr/bin/env pwsh
# dobhiWala Folder Structure Migration Script

Write-Host "`n=== dobhiWala Folder Structure Migration ===" -ForegroundColor Cyan
Write-Host "Organizing files into proper structure...`n" -ForegroundColor Gray

$src = ".\src"

# Move Components to components/common/
Write-Host "Moving Components..." -ForegroundColor Yellow
if (Test-Path "$src\component\Header.jsx") { Move-Item "$src\component\Header.jsx" "$src\components\common\" -Force }
if (Test-Path "$src\component\Footer.jsx") { Move-Item "$src\component\Footer.jsx" "$src\components\common\" -Force }
if (Test-Path "$src\component\CartContext.jsx") { Move-Item "$src\component\CartContext.jsx" "$src\components\common\" -Force }
if (Test-Path "$src\component\ProtectedRoute.jsx") { Move-Item "$src\component\ProtectedRoute.jsx" "$src\components\common\" -Force }

# Move Admin Components
Write-Host "Moving Admin Components..." -ForegroundColor Yellow
if (Test-Path "$src\component\AdminRoute.jsx") { Move-Item "$src\component\AdminRoute.jsx" "$src\components\admin\" -Force }

# Move Auth Pages
Write-Host "Moving Auth Pages..." -ForegroundColor Yellow
if (Test-Path "$src\pages\UnifiedAuth.jsx") { Move-Item "$src\pages\UnifiedAuth.jsx" "$src\pages\auth\" -Force }
if (Test-Path "$src\pages\AdminLogin.jsx") { Move-Item "$src\pages\AdminLogin.jsx" "$src\pages\auth\" -Force }

# Move Admin Pages
Write-Host "Moving Admin Pages..." -ForegroundColor Yellow
if (Test-Path "$src\pages\AdminPanel.jsx") { Move-Item "$src\pages\AdminPanel.jsx" "$src\pages\admin\" -Force }
if (Test-Path "$src\admin\AdminDashboard.jsx") { Move-Item "$src\admin\AdminDashboard.jsx" "$src\pages\admin\" -Force }
if (Test-Path "$src\admin\AdminCustomers.jsx") { Move-Item "$src\admin\AdminCustomers.jsx" "$src\pages\admin\" -Force }
if (Test-Path "$src\admin\AdminOrders.jsx") { Move-Item "$src\admin\AdminOrders.jsx" "$src\pages\admin\" -Force }
if (Test-Path "$src\admin\AdminServices.jsx") { Move-Item "$src\admin\AdminServices.jsx" "$src\pages\admin\" -Force }
if (Test-Path "$src\admin\AdminSettings.jsx") { Move-Item "$src\admin\AdminSettings.jsx" "$src\pages\admin\" -Force }
if (Test-Path "$src\admin\AdminRatings.jsx") { Move-Item "$src\admin\AdminRatings.jsx" "$src\pages\admin\" -Force }
if (Test-Path "$src\admin\AdminSidebar.jsx") { Move-Item "$src\admin\AdminSidebar.jsx" "$src\pages\admin\" -Force }

# Move User Pages
Write-Host "Moving User Pages..." -ForegroundColor Yellow
if (Test-Path "$src\pages\Home.jsx") { Move-Item "$src\pages\Home.jsx" "$src\pages\user\" -Force }
if (Test-Path "$src\pages\Male.jsx") { Move-Item "$src\pages\Male.jsx" "$src\pages\user\" -Force }
if (Test-Path "$src\pages\Female.jsx") { Move-Item "$src\pages\Female.jsx" "$src\pages\user\" -Force }
if (Test-Path "$src\pages\Kids.jsx") { Move-Item "$src\pages\Kids.jsx" "$src\pages\user\" -Force }
if (Test-Path "$src\pages\About.jsx") { Move-Item "$src\pages\About.jsx" "$src\pages\user\" -Force }
if (Test-Path "$src\pages\Contact.jsx") { Move-Item "$src\pages\Contact.jsx" "$src\pages\user\" -Force }
if (Test-Path "$src\component\Addtocard.jsx") { Move-Item "$src\component\Addtocard.jsx" "$src\pages\user\" -Force }
if (Test-Path "$src\pages\Checkout.jsx") { Move-Item "$src\pages\Checkout.jsx" "$src\pages\user\" -Force }
if (Test-Path "$src\pages\OrderSuccess.jsx") { Move-Item "$src\pages\OrderSuccess.jsx" "$src\pages\user\" -Force }
if (Test-Path "$src\pages\MyOrders.jsx") { Move-Item "$src\pages\MyOrders.jsx" "$src\pages\user\" -Force }
if (Test-Path "$src\pages\OrderTracking.jsx") { Move-Item "$src\pages\OrderTracking.jsx" "$src\pages\user\" -Force }
if (Test-Path "$src\pages\Rate.jsx") { Move-Item "$src\pages\Rate.jsx" "$src\pages\user\" -Force }
if (Test-Path "$src\pages\Menservices.jsx") { Move-Item "$src\pages\Menservices.jsx" "$src\pages\user\" -Force }
if (Test-Path "$src\pages\Femaleservices.jsx") { Move-Item "$src\pages\Femaleservices.jsx" "$src\pages\user\" -Force }
if (Test-Path "$src\pages\Kidsservices.jsx") { Move-Item "$src\pages\Kidsservices.jsx" "$src\pages\user\" -Force }
if (Test-Path "$src\pages\Homeservices.jsx") { Move-Item "$src\pages\Homeservices.jsx" "$src\pages\user\" -Force }
if (Test-Path "$src\pages\Signup.jsx") { Move-Item "$src\pages\Signup.jsx" "$src\pages\user\" -Force }
if (Test-Path "$src\pages\Login.jsx") { Move-Item "$src\pages\Login.jsx" "$src\pages\user\" -Force }

Write-Host "`n[SUCCESS] Migration completed!" -ForegroundColor Green
Write-Host "`nNext Steps:" -ForegroundColor Cyan
Write-Host "1. Run: npm run dev" -ForegroundColor Gray
Write-Host "2. Delete old empty folders (component and admin)" -ForegroundColor Gray

#!/usr/bin/env pwsh
# dobhiWala Folder Structure Migration Script
# This script organizes all files into the proper folder structure

Write-Host "`n========== dobhiWala Folder Structure Migration ==========" -ForegroundColor Cyan
Write-Host "This script will organize your files into a clean structure`n" -ForegroundColor Gray

# Base path
$src = ".\src"
$errors = @()
$success = @()

function MoveFile {
    param(
        [string]$from,
        [string]$to,
        [string]$description
    )
    
    $fullFrom = Join-Path $src $from
    $fullTo = Join-Path $src $to
    
    if (Test-Path $fullFrom) {
        try {
            Move-Item $fullFrom $fullTo -Force -ErrorAction Stop
            $success += "✓ $description"
            Write-Host "✓ Moved: $from → $to" -ForegroundColor Green
        }
        catch {
            $errors += "✗ Failed to move: $from"
            Write-Host "✗ Failed to move: $from" -ForegroundColor Red
        }
    }
    else {
        Write-Host "⊘ Not found: $from" -ForegroundColor Yellow
    }
}

Write-Host "Moving Components to components/common/..." -ForegroundColor Yellow
MoveFile "component\Header.jsx" "components\common\Header.jsx" "Header"
MoveFile "component\Footer.jsx" "components\common\Footer.jsx" "Footer"
MoveFile "component\CartContext.jsx" "components\common\CartContext.jsx" "CartContext"
MoveFile "component\ProtectedRoute.jsx" "components\common\ProtectedRoute.jsx" "ProtectedRoute"

Write-Host "`nMoving Admin Components..." -ForegroundColor Yellow
MoveFile "component\AdminRoute.jsx" "components\admin\AdminRoute.jsx" "AdminRoute"

Write-Host "`nMoving Auth Pages..." -ForegroundColor Yellow
MoveFile "pages\UnifiedAuth.jsx" "pages\auth\UnifiedAuth.jsx" "UnifiedAuth"
MoveFile "pages\AdminLogin.jsx" "pages\auth\AdminLogin.jsx" "AdminLogin"

Write-Host "`nMoving Admin Pages..." -ForegroundColor Yellow
MoveFile "pages\AdminPanel.jsx" "pages\admin\AdminPanel.jsx" "AdminPanel"
MoveFile "admin\AdminDashboard.jsx" "pages\admin\AdminDashboard.jsx" "AdminDashboard"
MoveFile "admin\AdminCustomers.jsx" "pages\admin\AdminCustomers.jsx" "AdminCustomers"
MoveFile "admin\AdminOrders.jsx" "pages\admin\AdminOrders.jsx" "AdminOrders"
MoveFile "admin\AdminServices.jsx" "pages\admin\AdminServices.jsx" "AdminServices"
MoveFile "admin\AdminSettings.jsx" "pages\admin\AdminSettings.jsx" "AdminSettings"
MoveFile "admin\AdminRatings.jsx" "pages\admin\AdminRatings.jsx" "AdminRatings"
MoveFile "admin\AdminSidebar.jsx" "pages\admin\AdminSidebar.jsx" "AdminSidebar"

Write-Host "`nMoving User Pages..." -ForegroundColor Yellow
MoveFile "pages\Home.jsx" "pages\user\Home.jsx" "Home"
MoveFile "pages\Male.jsx" "pages\user\Male.jsx" "Male"
MoveFile "pages\Female.jsx" "pages\user\Female.jsx" "Female"
MoveFile "pages\Kids.jsx" "pages\user\Kids.jsx" "Kids"
MoveFile "pages\About.jsx" "pages\user\About.jsx" "About"
MoveFile "pages\Contact.jsx" "pages\user\Contact.jsx" "Contact"
MoveFile "component\Addtocard.jsx" "pages\user\Addtocard.jsx" "Addtocard (Cart)"
MoveFile "pages\Checkout.jsx" "pages\user\Checkout.jsx" "Checkout"
MoveFile "pages\OrderSuccess.jsx" "pages\user\OrderSuccess.jsx" "OrderSuccess"
MoveFile "pages\MyOrders.jsx" "pages\user\MyOrders.jsx" "MyOrders"
MoveFile "pages\OrderTracking.jsx" "pages\user\OrderTracking.jsx" "OrderTracking"
MoveFile "pages\Rate.jsx" "pages\user\Rate.jsx" "Rate"
MoveFile "pages\Menservices.jsx" "pages\user\Menservices.jsx" "Menservices"
MoveFile "pages\Femaleservices.jsx" "pages\user\Femaleservices.jsx" "Femaleservices"
MoveFile "pages\Kidsservices.jsx" "pages\user\Kidsservices.jsx" "Kidsservices"
MoveFile "pages\Homeservices.jsx" "pages\user\Homeservices.jsx" "Homeservices"
MoveFile "pages\Signup.jsx" "pages\user\Signup.jsx" "Signup"
MoveFile "pages\Login.jsx" "pages\user\Login.jsx" "Login (Legacy)"

Write-Host "`n========== Migration Summary ==========" -ForegroundColor Cyan
Write-Host "Successfully moved: $($success.Count) files" -ForegroundColor Green
Write-Host "Failed: $($errors.Count) files" -ForegroundColor Red

if ($errors.Count -gt 0) {
    Write-Host "`nFailed migrations:" -ForegroundColor Red
    $errors | ForEach-Object { Write-Host "  $_" -ForegroundColor Red }
}

Write-Host "`n✓ Migration script completed!" -ForegroundColor Cyan
Write-Host "`nNext Steps:" -ForegroundColor Yellow
Write-Host "1. Delete empty old folders (if empty):" -ForegroundColor Gray
Write-Host "   - src\component\ (after moving all files)" -ForegroundColor Gray
Write-Host "   - src\admin\" -ForegroundColor Gray
Write-Host "2. Test the application: npm run dev" -ForegroundColor Gray
Write-Host "3. Check imports in case of any errors" -ForegroundColor Gray

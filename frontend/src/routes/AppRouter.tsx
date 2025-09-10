import { BrowserRouter, Route, Routes, Navigate } from "react-router-dom";
import { AppLayout } from "../layouts/AppLayout";
import { DashboardPage } from "../pages/DashboardPage";
import { CategoryPage } from "../pages/CategoryPage";
import { SubCategoryPage } from "../pages/SubCategoryPage";
import { ProductPage } from "../pages/ProductPage";
import { CalculoComplejo } from "../pages/CalculoComplejo";
import { LoginPage } from "../pages/LoginPage";
import { VendorPage } from "../pages/VendorPage";
import { ClientPage } from "../pages/ClientPage";
import { SupplierPage } from "../pages/SupplierPage";
import { SupplierContactPage } from "../pages/SupplierContactPage";
import { UnitPage } from "../pages/UnitPage";
import { QuotePage } from "../pages/QuotePage";
import { BuyOrderPage } from "../pages/BuyOrderPage";
import { AuthGuard } from "../guard/auth/Auth.guard";
import { useAuthStore } from "../store/Auth.service";

export const AppRouter = () => {
  const { isLogged } = useAuthStore();

  return (
    <BrowserRouter>
      <Routes>
        {/* Public routes */}
        <Route 
          path="/login" 
          element={
            isLogged ? <Navigate to="/" replace /> : <LoginPage />
          } 
        />

        {/* Protected routes */}
        <Route element={<AuthGuard><AppLayout /></AuthGuard>}>
          <Route index element={<DashboardPage />} />
          <Route path="/" element={<DashboardPage />} />
          <Route path="/categories" element={<CategoryPage />} />
          <Route path="/subcategories" element={<SubCategoryPage />} />
          <Route path="/products" element={<ProductPage />} />
          <Route path="/vendors" element={<VendorPage />} />
          <Route path="/clients" element={<ClientPage />} />
          <Route path="/suppliers" element={<SupplierPage />} />
          <Route path="/supplier-contacts" element={<SupplierContactPage />} />
          <Route path="/units" element={<UnitPage />} />
          <Route path="/quotes" element={<QuotePage />} />
          <Route path="/buy-orders" element={<BuyOrderPage />} />
          <Route path="/calculate" element={<CalculoComplejo />} />
        </Route>

        {/* Catch all route */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
};

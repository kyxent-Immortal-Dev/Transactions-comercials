import { BrowserRouter, Route, Routes } from "react-router-dom";
import { AppLayout } from "../layouts/AppLayout";
import { DashboardPage } from "../pages/DashboardPage";
import { CategoryPage } from "../pages/CategoryPage";
import { SubCategoryPage } from "../pages/SubCategoryPage";
import { ProductPage } from "../pages/ProductPage";

export const AppRouter = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<AppLayout />}>
          <Route index element={<DashboardPage />} />
          <Route path="/" element={<DashboardPage />} />
          <Route path="/categories" element={<CategoryPage />} />
          <Route path="/subcategories" element={<SubCategoryPage />} />
          <Route path="/products" element={<ProductPage />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
};

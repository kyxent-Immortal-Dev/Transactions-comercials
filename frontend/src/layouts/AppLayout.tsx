import { Header } from "../components/home/Header";
import { Footer } from "../components/home/Footer";
import { Outlet } from "react-router-dom";

export const AppLayout = () => {
  return (
    <>
      <Header />

      <Outlet />

      <Footer />
    </>
  );
};

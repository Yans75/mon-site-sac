import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { HelmetProvider } from "react-helmet-async";
import { Toaster } from "sonner";
import { CartProvider } from "./context/CartContext";
import Layout from "./components/Layout";
import Home from "./pages/Home";
import Shop from "./pages/Shop";
import ProductDetail from "./pages/ProductDetail";
import About from "./pages/About";
import Craftsmanship from "./pages/Craftsmanship";
import Contact from "./pages/Contact";
import Cart from "./pages/Cart";
import Page from "./pages/Page";
import NotFound from "./pages/NotFound";

function App() {
  return (
    <HelmetProvider>
      <BrowserRouter>
        <CartProvider>
          <div className="grain-overlay" />
          <Toaster
            position="top-right"
            toastOptions={{
              style: {
                background: '#F9F8F6',
                border: '1px solid #E5E0D8',
                color: '#2D2D2D',
                fontFamily: 'Outfit, sans-serif',
              },
            }}
          />
          <Routes>
            <Route path="/" element={<Layout />}>
              <Route index element={<Home />} />
              <Route path="shop" element={<Shop />} />
              <Route path="product/:handle" element={<ProductDetail />} />
              <Route path="about" element={<About />} />
              <Route path="craftsmanship" element={<Craftsmanship />} />
              <Route path="contact" element={<Contact />} />
              <Route path="cart" element={<Cart />} />

              {/* Dynamic Shopify pages: /pages/:handle */}
              <Route path="pages/:handle" element={<Page />} />

              {/* Legacy redirects for old hardcoded legal URLs */}
              <Route path="mentions-legales" element={<Navigate to="/pages/mentions-legales" replace />} />
              <Route path="politique-de-confidentialite" element={<Navigate to="/pages/politique-de-confidentialite" replace />} />
              <Route path="confidentialite" element={<Navigate to="/pages/politique-de-confidentialite" replace />} />
              <Route path="cgv" element={<Navigate to="/pages/cgv" replace />} />

              <Route path="*" element={<NotFound />} />
            </Route>
          </Routes>
        </CartProvider>
      </BrowserRouter>
    </HelmetProvider>
  );
}

export default App;

import { BrowserRouter, Routes, Route, useLocation } from "react-router-dom";
import { HelmetProvider } from "react-helmet-async";
import { Toaster } from "sonner";
import { CartProvider } from "./context/CartContext";
import { AuthProvider } from "./context/AuthContext";
import { AdminProvider } from "./context/AdminContext";
import Layout from "./components/Layout";
import Home from "./pages/Home";
import Shop from "./pages/Shop";
import ProductDetail from "./pages/ProductDetail";
import About from "./pages/About";
import Craftsmanship from "./pages/Craftsmanship";
import Contact from "./pages/Contact";
import Cart from "./pages/Cart";
import Checkout from "./pages/Checkout";
import CheckoutSuccess from "./pages/CheckoutSuccess";
import Login from "./pages/Login";
import Register from "./pages/Register";
import AuthCallback from "./pages/AuthCallback";
import NotFound from "./pages/NotFound";
import MentionsLegales from "./pages/MentionsLegales";
import PolitiqueConfidentialite from "./pages/PolitiqueConfidentialite";
import AdminLogin from "./pages/admin/AdminLogin";
import AdminDashboard from "./pages/admin/AdminDashboard";
import AdminProducts from "./pages/admin/AdminProducts";
import AdminProductForm from "./pages/admin/AdminProductForm";
import AdminOrders from "./pages/admin/AdminOrders";
import AdminMessages from "./pages/admin/AdminMessages";

function AppRouter() {
  const location = useLocation();
  
  if (location.hash?.includes('session_id=')) {
    return <AuthCallback />;
  }
  
  return (
    <Routes>
      {/* Admin Routes */}
      <Route path="/admin" element={<AdminLogin />} />
      <Route path="/admin/dashboard" element={<AdminDashboard />} />
      <Route path="/admin/products" element={<AdminProducts />} />
      <Route path="/admin/products/new" element={<AdminProductForm />} />
      <Route path="/admin/products/edit/:productId" element={<AdminProductForm />} />
      <Route path="/admin/orders" element={<AdminOrders />} />
      <Route path="/admin/messages" element={<AdminMessages />} />
      
      {/* Public Routes */}
      <Route path="/" element={<Layout />}>
        <Route index element={<Home />} />
        <Route path="shop" element={<Shop />} />
        <Route path="product/:productId" element={<ProductDetail />} />
        <Route path="about" element={<About />} />
        <Route path="craftsmanship" element={<Craftsmanship />} />
        <Route path="contact" element={<Contact />} />
        <Route path="cart" element={<Cart />} />
        <Route path="checkout" element={<Checkout />} />
        <Route path="checkout/success" element={<CheckoutSuccess />} />
        <Route path="login" element={<Login />} />
        <Route path="register" element={<Register />} />
        <Route path="mentions-legales" element={<MentionsLegales />} />
        <Route path="politique-de-confidentialite" element={<PolitiqueConfidentialite />} />
        <Route path="*" element={<NotFound />} />
      </Route>
    </Routes>
  );
}

function App() {
  return (
    <HelmetProvider>
      <BrowserRouter>
        <AuthProvider>
          <AdminProvider>
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
              <AppRouter />
            </CartProvider>
          </AdminProvider>
        </AuthProvider>
      </BrowserRouter>
    </HelmetProvider>
  );
}

export default App;

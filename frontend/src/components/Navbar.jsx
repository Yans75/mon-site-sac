import { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { ShoppingBag, User, Menu, X } from 'lucide-react';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';

const Navbar = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const location = useLocation();
  const { cartCount } = useCart();
  const { user } = useAuth();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    setMobileMenuOpen(false);
  }, [location]);

  const leftLinks = [
    { to: '/shop', label: 'Shop' },
    { to: '/craftsmanship', label: 'Craftsmanship' },
  ];

  const rightLinks = [
    { to: '/about', label: 'About' },
    { to: '/contact', label: 'Contact' },
  ];

  return (
    <>
      <header
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
          isScrolled 
            ? 'bg-stone-white/90 backdrop-blur-md border-b border-muted' 
            : 'bg-transparent'
        }`}
      >
        <nav className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="flex items-center justify-between h-20">
            {/* Left Links - Desktop */}
            <div className="hidden lg:flex items-center gap-10 flex-1">
              {leftLinks.map((link) => (
                <Link
                  key={link.to}
                  to={link.to}
                  data-testid={`nav-${link.label.toLowerCase()}`}
                  className={`font-body text-sm tracking-wide transition-colors duration-300 ${
                    location.pathname === link.to 
                      ? 'text-charcoal' 
                      : 'text-charcoal/70 hover:text-charcoal'
                  }`}
                >
                  {link.label}
                </Link>
              ))}
            </div>

            {/* Logo */}
            <Link 
              to="/" 
              data-testid="nav-logo"
              className="flex-shrink-0"
            >
              <h1 className="font-heading text-2xl md:text-3xl font-light tracking-tight text-charcoal">
                ArtemCreations
              </h1>
            </Link>

            {/* Right Links - Desktop */}
            <div className="hidden lg:flex items-center gap-10 flex-1 justify-end">
              {rightLinks.map((link) => (
                <Link
                  key={link.to}
                  to={link.to}
                  data-testid={`nav-${link.label.toLowerCase()}`}
                  className={`font-body text-sm tracking-wide transition-colors duration-300 ${
                    location.pathname === link.to 
                      ? 'text-charcoal' 
                      : 'text-charcoal/70 hover:text-charcoal'
                  }`}
                >
                  {link.label}
                </Link>
              ))}
              
              {/* User Icon */}
              <Link 
                to={user ? '/account' : '/login'}
                data-testid="nav-user"
                className="text-charcoal/70 hover:text-charcoal transition-colors duration-300"
              >
                <User size={20} strokeWidth={1.5} />
              </Link>

              {/* Cart Icon */}
              <Link 
                to="/cart" 
                data-testid="nav-cart"
                className="relative text-charcoal/70 hover:text-charcoal transition-colors duration-300"
              >
                <ShoppingBag size={20} strokeWidth={1.5} />
                {cartCount > 0 && (
                  <motion.span
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    className="absolute -top-2 -right-2 w-5 h-5 bg-terracotta text-stone-white text-xs flex items-center justify-center rounded-full"
                  >
                    {cartCount}
                  </motion.span>
                )}
              </Link>
            </div>

            {/* Mobile Menu Button */}
            <div className="flex lg:hidden items-center gap-4">
              <Link 
                to="/cart" 
                data-testid="nav-cart-mobile"
                className="relative text-charcoal/70"
              >
                <ShoppingBag size={20} strokeWidth={1.5} />
                {cartCount > 0 && (
                  <span className="absolute -top-2 -right-2 w-5 h-5 bg-terracotta text-stone-white text-xs flex items-center justify-center rounded-full">
                    {cartCount}
                  </span>
                )}
              </Link>
              <button
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                data-testid="mobile-menu-toggle"
                className="text-charcoal"
              >
                {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
              </button>
            </div>
          </div>
        </nav>
      </header>

      {/* Mobile Menu */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="fixed inset-0 z-40 lg:hidden"
          >
            <div className="absolute inset-0 bg-stone-white pt-24 px-6">
              <nav className="flex flex-col gap-6">
                {[...leftLinks, ...rightLinks].map((link) => (
                  <Link
                    key={link.to}
                    to={link.to}
                    data-testid={`mobile-nav-${link.label.toLowerCase()}`}
                    className="font-heading text-3xl text-charcoal"
                  >
                    {link.label}
                  </Link>
                ))}
                <div className="border-t border-muted pt-6 mt-4">
                  <Link
                    to={user ? '/account' : '/login'}
                    data-testid="mobile-nav-account"
                    className="font-body text-sm text-charcoal/70"
                  >
                    {user ? 'My Account' : 'Sign In'}
                  </Link>
                </div>
              </nav>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default Navbar;

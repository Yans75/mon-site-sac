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
  const isHome = location.pathname === '/';

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
    { to: '/shop', label: 'Boutique' },
    { to: '/craftsmanship', label: 'Savoir-Faire' },
  ];

  const rightLinks = [
    { to: '/about', label: 'Notre Histoire' },
    { to: '/contact', label: 'Contact' },
  ];

  const textColor = isHome && !isScrolled ? 'text-stone-white' : 'text-charcoal';
  const textMuted = isHome && !isScrolled ? 'text-stone-white/70' : 'text-charcoal/50';
  const textHover = isHome && !isScrolled ? 'hover:text-stone-white' : 'hover:text-charcoal';

  return (
    <>
      <header
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-700 ${
          isScrolled 
            ? 'bg-stone-white/80 backdrop-blur-xl border-b border-charcoal/5 shadow-[0_1px_20px_rgba(0,0,0,0.03)]' 
            : 'bg-transparent'
        }`}
      >
        <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-20 lg:h-24">
            {/* Left Links - Desktop */}
            <div className="hidden lg:flex items-center gap-12 flex-1">
              {leftLinks.map((link) => (
                <Link
                  key={link.to}
                  to={link.to}
                  data-testid={`nav-${link.label.toLowerCase().replace(/\s+/g, '-')}`}
                  className={`font-body text-xs tracking-[0.15em] uppercase transition-all duration-500 ${
                    location.pathname === link.to 
                      ? textColor
                      : `${textMuted} ${textHover}`
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
              <h1 className={`font-heading text-2xl md:text-3xl font-light tracking-tight transition-colors duration-500 ${textColor}`}>
                ArtemCreations
              </h1>
            </Link>

            {/* Right Links - Desktop */}
            <div className="hidden lg:flex items-center gap-12 flex-1 justify-end">
              {rightLinks.map((link) => (
                <Link
                  key={link.to}
                  to={link.to}
                  data-testid={`nav-${link.label.toLowerCase().replace(/\s+/g, '-')}`}
                  className={`font-body text-xs tracking-[0.15em] uppercase transition-all duration-500 ${
                    location.pathname === link.to 
                      ? textColor
                      : `${textMuted} ${textHover}`
                  }`}
                >
                  {link.label}
                </Link>
              ))}
              
              {/* User Icon */}
              <Link 
                to={user ? '/account' : '/login'}
                data-testid="nav-user"
                className={`${textMuted} ${textHover} transition-colors duration-500`}
              >
                <User size={18} strokeWidth={1.5} />
              </Link>

              {/* Cart Icon */}
              <Link 
                to="/cart" 
                data-testid="nav-cart"
                className={`relative ${textMuted} ${textHover} transition-colors duration-500`}
              >
                <ShoppingBag size={18} strokeWidth={1.5} />
                {cartCount > 0 && (
                  <motion.span
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    className="absolute -top-2 -right-2.5 w-4 h-4 bg-terracotta text-stone-white text-[10px] flex items-center justify-center"
                  >
                    {cartCount}
                  </motion.span>
                )}
              </Link>
            </div>

            {/* Mobile Menu Button */}
            <div className="flex lg:hidden items-center gap-5">
              <Link 
                to="/cart" 
                data-testid="nav-cart-mobile"
                className={`relative ${textMuted}`}
              >
                <ShoppingBag size={18} strokeWidth={1.5} />
                {cartCount > 0 && (
                  <span className="absolute -top-2 -right-2.5 w-4 h-4 bg-terracotta text-stone-white text-[10px] flex items-center justify-center">
                    {cartCount}
                  </span>
                )}
              </Link>
              <button
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                data-testid="mobile-menu-toggle"
                className={textColor}
              >
                {mobileMenuOpen ? <X size={22} strokeWidth={1.5} /> : <Menu size={22} strokeWidth={1.5} />}
              </button>
            </div>
          </div>
        </nav>
      </header>

      {/* Mobile Menu */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="fixed inset-0 z-40 lg:hidden"
          >
            <div className="absolute inset-0 bg-stone-white flex flex-col justify-center px-8">
              <nav className="flex flex-col gap-8">
                {[...leftLinks, ...rightLinks].map((link, i) => (
                  <motion.div
                    key={link.to}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: i * 0.08 }}
                  >
                    <Link
                      to={link.to}
                      data-testid={`mobile-nav-${link.label.toLowerCase().replace(/\s+/g, '-')}`}
                      className="font-heading text-4xl text-charcoal tracking-tight"
                    >
                      {link.label}
                    </Link>
                  </motion.div>
                ))}
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.4 }}
                  className="border-t border-charcoal/10 pt-8 mt-4"
                >
                  <Link
                    to={user ? '/account' : '/login'}
                    data-testid="mobile-nav-account"
                    className="font-body text-xs uppercase tracking-[0.2em] text-charcoal/50"
                  >
                    {user ? 'Mon Compte' : 'Connexion'}
                  </Link>
                </motion.div>
              </nav>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default Navbar;

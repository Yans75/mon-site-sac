import { Link } from 'react-router-dom';
import { Instagram, Facebook, Mail, ArrowUpRight } from 'lucide-react';

const Footer = () => {
  return (
    <footer className="bg-charcoal text-stone-white mt-0">
      {/* Main Footer */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 md:py-28">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-16 lg:gap-8">
          {/* Brand */}
          <div className="lg:col-span-5">
            <h2 className="font-heading text-4xl text-stone-white mb-6 tracking-tight">
              ArtemCreations
            </h2>
            <p className="font-body text-sm font-light text-stone-white/50 max-w-sm leading-relaxed mb-8">
              Confectionné avec amour et dévouement. Chaque pièce raconte une histoire de patience, 
              de savoir-faire et de beauté intemporelle.
            </p>
            <p className="font-accent text-xl text-terracotta">
              "Fait main, porté avec le coeur"
            </p>
          </div>

          {/* Navigation */}
          <div className="lg:col-span-3">
            <h3 className="font-body text-xs uppercase tracking-[0.2em] text-stone-white/30 mb-8">
              Explorer
            </h3>
            <nav className="flex flex-col gap-4">
              {[
                { to: '/shop', label: 'La Collection' },
                { to: '/about', label: 'Notre Histoire' },
                { to: '/craftsmanship', label: 'Savoir-Faire' },
                { to: '/contact', label: 'Nous Contacter' },
              ].map((link) => (
                <Link 
                  key={link.to}
                  to={link.to} 
                  data-testid={`footer-${link.to.replace('/', '')}`}
                  className="font-body text-sm font-light text-stone-white/50 hover:text-stone-white transition-colors duration-500 inline-flex items-center gap-1 group"
                >
                  {link.label}
                  <ArrowUpRight size={12} className="opacity-0 -translate-x-1 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-300" />
                </Link>
              ))}
            </nav>
          </div>

          {/* Contact & Social */}
          <div className="lg:col-span-4">
            <h3 className="font-body text-xs uppercase tracking-[0.2em] text-stone-white/30 mb-8">
              Restons en contact
            </h3>
            <p className="font-body text-sm font-light text-stone-white/50 mb-6">
              hello@artemcreations.com
            </p>
            <div className="flex gap-3">
              {[
                { href: 'https://instagram.com', icon: Instagram, testId: 'footer-instagram' },
                { href: 'https://facebook.com', icon: Facebook, testId: 'footer-facebook' },
                { href: 'mailto:hello@artemcreations.com', icon: Mail, testId: 'footer-email' },
              ].map(({ href, icon: Icon, testId }) => (
                <a 
                  key={testId}
                  href={href} 
                  target={href.startsWith('http') ? '_blank' : undefined}
                  rel={href.startsWith('http') ? 'noopener noreferrer' : undefined}
                  data-testid={testId}
                  className="w-10 h-10 border border-stone-white/10 flex items-center justify-center text-stone-white/40 hover:text-stone-white hover:border-stone-white/30 transition-all duration-500"
                >
                  <Icon size={16} strokeWidth={1.5} />
                </a>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="border-t border-stone-white/5">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="font-body text-[11px] text-stone-white/25 tracking-wider">
            © {new Date().getFullYear()} ArtemCreations. Tous droits réservés.
          </p>
          <div className="flex gap-8">
            <Link 
              to="/privacy" 
              className="font-body text-[11px] text-stone-white/25 hover:text-stone-white/50 transition-colors tracking-wider"
            >
              Confidentialité
            </Link>
            <Link 
              to="/terms" 
              className="font-body text-[11px] text-stone-white/25 hover:text-stone-white/50 transition-colors tracking-wider"
            >
              CGV
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;

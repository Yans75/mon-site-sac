import { Link } from 'react-router-dom';
import { Instagram, Facebook, Mail } from 'lucide-react';

const Footer = () => {
  return (
    <footer className="bg-pale-sand mt-20">
      <div className="max-w-7xl mx-auto px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12">
          {/* Brand */}
          <div className="md:col-span-2">
            <h2 className="font-heading text-3xl text-charcoal mb-4">ArtemCreations</h2>
            <p className="font-body text-sm text-charcoal/70 max-w-sm leading-relaxed">
              Confectionné avec amour et dévouement. Chaque pièce raconte une histoire de patience, 
              de savoir-faire et de la beauté intemporelle du travail artisanal.
            </p>
            <p className="font-accent text-xl text-terracotta mt-6">
              "Fait main, porté avec le cœur"
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="font-body text-sm uppercase tracking-widest text-charcoal mb-6">
              Explorer
            </h3>
            <nav className="flex flex-col gap-3">
              <Link 
                to="/shop" 
                data-testid="footer-shop"
                className="font-body text-sm text-charcoal/70 hover:text-charcoal transition-colors"
              >
                La Collection
              </Link>
              <Link 
                to="/about" 
                data-testid="footer-about"
                className="font-body text-sm text-charcoal/70 hover:text-charcoal transition-colors"
              >
                Notre Histoire
              </Link>
              <Link 
                to="/craftsmanship" 
                data-testid="footer-craftsmanship"
                className="font-body text-sm text-charcoal/70 hover:text-charcoal transition-colors"
              >
                Savoir-Faire
              </Link>
              <Link 
                to="/contact" 
                data-testid="footer-contact"
                className="font-body text-sm text-charcoal/70 hover:text-charcoal transition-colors"
              >
                Nous Contacter
              </Link>
            </nav>
          </div>

          {/* Connect */}
          <div>
            <h3 className="font-body text-sm uppercase tracking-widest text-charcoal mb-6">
              Suivez-nous
            </h3>
            <div className="flex gap-4 mb-6">
              <a 
                href="https://instagram.com" 
                target="_blank" 
                rel="noopener noreferrer"
                data-testid="footer-instagram"
                className="w-10 h-10 rounded-full bg-charcoal/5 flex items-center justify-center hover:bg-charcoal hover:text-stone-white transition-colors duration-300"
              >
                <Instagram size={18} />
              </a>
              <a 
                href="https://facebook.com" 
                target="_blank" 
                rel="noopener noreferrer"
                data-testid="footer-facebook"
                className="w-10 h-10 rounded-full bg-charcoal/5 flex items-center justify-center hover:bg-charcoal hover:text-stone-white transition-colors duration-300"
              >
                <Facebook size={18} />
              </a>
              <a 
                href="mailto:hello@artemcreations.com"
                data-testid="footer-email"
                className="w-10 h-10 rounded-full bg-charcoal/5 flex items-center justify-center hover:bg-charcoal hover:text-stone-white transition-colors duration-300"
              >
                <Mail size={18} />
              </a>
            </div>
            <p className="font-body text-sm text-charcoal/70">
              hello@artemcreations.com
            </p>
          </div>
        </div>

        {/* Bottom */}
        <div className="border-t border-charcoal/10 mt-12 pt-8 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="font-body text-xs text-charcoal/50">
            © {new Date().getFullYear()} ArtemCreations. Tous droits réservés.
          </p>
          <div className="flex gap-6">
            <Link 
              to="/privacy" 
              className="font-body text-xs text-charcoal/50 hover:text-charcoal transition-colors"
            >
              Politique de confidentialité
            </Link>
            <Link 
              to="/terms" 
              className="font-body text-xs text-charcoal/50 hover:text-charcoal transition-colors"
            >
              Conditions générales
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;

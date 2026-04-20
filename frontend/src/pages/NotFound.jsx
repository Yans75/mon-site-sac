import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowRight } from 'lucide-react';
import SEO from '../components/SEO';

const NotFound = () => (
  <div className="pt-28 pb-16 min-h-screen flex items-center justify-center">
    <SEO
      title="Page introuvable"
      description="Cette page n'existe pas. Retournez à la boutique Artem Creations pour découvrir nos sacs faits main."
      noindex
    />
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      className="text-center max-w-lg px-6"
    >
      <p className="font-heading text-[8rem] leading-none text-pale-sand mb-4">404</p>
      <h1 className="font-heading text-4xl text-charcoal mb-4 -mt-12 relative z-10 tracking-tight">
        Page introuvable
      </h1>
      <p className="font-body text-sm font-light text-charcoal/40 mb-10">
        La page que vous recherchez n'existe pas ou a été déplacée.
      </p>
      <Link to="/shop" data-testid="404-shop-btn" className="btn-primary inline-flex items-center gap-3">
        Voir la Collection
        <ArrowRight size={14} />
      </Link>
    </motion.div>
  </div>
);

export default NotFound;

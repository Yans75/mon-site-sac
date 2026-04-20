import { motion } from 'framer-motion';
import SEO from '../components/SEO';

const MentionsLegales = () => (
  <div className="pt-28 pb-16">
    <SEO
      title="Mentions Légales"
      description="Mentions légales du site Artem Creations. Informations sur l'éditeur, l'hébergement et les droits de propriété intellectuelle."
    />
    <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
        <p className="font-body text-xs uppercase tracking-[0.25em] text-charcoal/30 mb-4">Juridique</p>
        <h1 className="font-heading text-4xl md:text-5xl text-charcoal tracking-tight mb-12">Mentions Légales</h1>

        <div className="space-y-10 font-body text-sm font-light text-charcoal/60 leading-relaxed">
          <section>
            <h2 className="font-heading text-2xl text-charcoal mb-4">Éditeur du site</h2>
            <p>Artem Creations<br/>123 Rue des Artisans, 75011 Paris, France<br/>Email : bonjour@artemcreations.com</p>
          </section>

          <section>
            <h2 className="font-heading text-2xl text-charcoal mb-4">Hébergement</h2>
            <p>Le site artemcreations.com est hébergé par Vercel Inc., 340 S Lemon Ave #4133, Walnut, CA 91789, États-Unis.</p>
          </section>

          <section>
            <h2 className="font-heading text-2xl text-charcoal mb-4">Propriété intellectuelle</h2>
            <p>L'ensemble du contenu de ce site (textes, images, vidéos, logos, graphismes) est la propriété exclusive d'Artem Creations, sauf mention contraire. Toute reproduction, représentation ou diffusion, en tout ou partie, du contenu de ce site est interdite sans autorisation préalable.</p>
          </section>

          <section>
            <h2 className="font-heading text-2xl text-charcoal mb-4">Données personnelles</h2>
            <p>Les données personnelles collectées sur ce site sont traitées conformément au Règlement Général sur la Protection des Données (RGPD). Pour en savoir plus, consultez notre <a href="/politique-de-confidentialite" className="text-terracotta hover:underline">politique de confidentialité</a>.</p>
          </section>

          <section>
            <h2 className="font-heading text-2xl text-charcoal mb-4">Cookies</h2>
            <p>Ce site utilise des cookies essentiels au fonctionnement du service. Aucun cookie publicitaire n'est utilisé sans votre consentement explicite.</p>
          </section>
        </div>
      </motion.div>
    </div>
  </div>
);

export default MentionsLegales;

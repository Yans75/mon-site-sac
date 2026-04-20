import { motion } from 'framer-motion';
import SEO from '../components/SEO';

const PolitiqueConfidentialite = () => (
  <div className="pt-28 pb-16">
    <SEO
      title="Politique de Confidentialité"
      description="Politique de confidentialité d'Artem Creations. Découvrez comment nous collectons, utilisons et protégeons vos données personnelles."
    />
    <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
        <p className="font-body text-xs uppercase tracking-[0.25em] text-charcoal/30 mb-4">Confidentialité</p>
        <h1 className="font-heading text-4xl md:text-5xl text-charcoal tracking-tight mb-12">Politique de Confidentialité</h1>

        <div className="space-y-10 font-body text-sm font-light text-charcoal/60 leading-relaxed">
          <section>
            <h2 className="font-heading text-2xl text-charcoal mb-4">Collecte des données</h2>
            <p>Nous collectons uniquement les données nécessaires au traitement de vos commandes : nom, adresse email, adresse de livraison et informations de paiement. Les données de paiement sont traitées directement par Stripe et ne sont jamais stockées sur nos serveurs.</p>
          </section>

          <section>
            <h2 className="font-heading text-2xl text-charcoal mb-4">Utilisation des données</h2>
            <p>Vos données sont utilisées exclusivement pour :</p>
            <ul className="list-disc pl-5 mt-3 space-y-1">
              <li>Traiter et expédier vos commandes</li>
              <li>Répondre à vos demandes via le formulaire de contact</li>
              <li>Améliorer votre expérience sur le site</li>
            </ul>
          </section>

          <section>
            <h2 className="font-heading text-2xl text-charcoal mb-4">Protection des données</h2>
            <p>Nous mettons en oeuvre toutes les mesures techniques et organisationnelles pour protéger vos données personnelles contre tout accès non autorisé, perte ou altération.</p>
          </section>

          <section>
            <h2 className="font-heading text-2xl text-charcoal mb-4">Vos droits</h2>
            <p>Conformément au RGPD, vous disposez d'un droit d'accès, de rectification, de suppression et de portabilité de vos données. Pour exercer ces droits, contactez-nous à : bonjour@artemcreations.com</p>
          </section>

          <section>
            <h2 className="font-heading text-2xl text-charcoal mb-4">Durée de conservation</h2>
            <p>Les données liées à vos commandes sont conservées pendant 5 ans à des fins comptables. Les données du formulaire de contact sont conservées pendant 1 an.</p>
          </section>

          <section>
            <h2 className="font-heading text-2xl text-charcoal mb-4">Cookies</h2>
            <p>Ce site utilise uniquement des cookies techniques nécessaires au fonctionnement du panier et de votre session. Aucun cookie de suivi publicitaire n'est déposé sans votre consentement.</p>
          </section>
        </div>
      </motion.div>
    </div>
  </div>
);

export default PolitiqueConfidentialite;

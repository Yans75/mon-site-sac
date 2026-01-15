import { useState, useEffect } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Check, Package, ArrowRight } from 'lucide-react';
import axios from 'axios';
import { useCart } from '../context/CartContext';

const API = `${process.env.REACT_APP_BACKEND_URL}/api`;

const CheckoutSuccess = () => {
  const [searchParams] = useSearchParams();
  const sessionId = searchParams.get('session_id');
  const [status, setStatus] = useState('checking');
  const [attempts, setAttempts] = useState(0);
  const { clearCart } = useCart();

  useEffect(() => {
    if (!sessionId) {
      setStatus('error');
      return;
    }

    const pollStatus = async () => {
      if (attempts >= 5) {
        setStatus('timeout');
        return;
      }

      try {
        const response = await axios.get(`${API}/checkout/status/${sessionId}`);
        
        if (response.data.payment_status === 'paid') {
          setStatus('success');
          clearCart();
        } else if (response.data.status === 'expired') {
          setStatus('error');
        } else {
          // Continue polling
          setAttempts(prev => prev + 1);
          setTimeout(pollStatus, 2000);
        }
      } catch (error) {
        console.error('Status check error:', error);
        setAttempts(prev => prev + 1);
        setTimeout(pollStatus, 2000);
      }
    };

    pollStatus();
  }, [sessionId, attempts, clearCart]);

  if (status === 'checking') {
    return (
      <div className="pt-24 pb-16 min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-2 border-charcoal/20 border-t-charcoal rounded-full animate-spin mx-auto mb-6" />
          <p className="font-body text-charcoal/60">Confirmation de votre commande...</p>
        </div>
      </div>
    );
  }

  if (status === 'error' || status === 'timeout') {
    return (
      <div className="pt-24 pb-16 min-h-screen">
        <div className="max-w-2xl mx-auto px-6 lg:px-8 text-center py-20">
          <h1 className="font-heading text-4xl text-charcoal mb-4">
            Une erreur s'est produite
          </h1>
          <p className="font-body text-charcoal/60 mb-8">
            Nous n'avons pas pu confirmer votre paiement. Veuillez vérifier vos emails 
            pour la confirmation ou contactez-nous si vous avez des questions.
          </p>
          <Link to="/contact" className="btn-primary">
            Nous Contacter
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="pt-24 pb-16 min-h-screen">
      <div className="max-w-2xl mx-auto px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center py-12"
        >
          {/* Success Icon */}
          <div className="w-20 h-20 bg-terracotta/10 rounded-full flex items-center justify-center mx-auto mb-8">
            <Check size={40} className="text-terracotta" />
          </div>

          <h1 className="font-heading text-4xl md:text-5xl text-charcoal mb-4">
            Merci !
          </h1>
          <p className="font-body text-lg text-charcoal/60 mb-8">
            Votre commande a été passée avec succès. Un email de confirmation vous sera envoyé sous peu.
          </p>

          {/* Order Info */}
          <div className="bg-pale-sand p-8 mb-8 text-left">
            <div className="flex items-center gap-4 mb-6">
              <Package size={24} className="text-terracotta" />
              <div>
                <h2 className="font-heading text-xl text-charcoal">Et Maintenant ?</h2>
                <p className="font-body text-sm text-charcoal/60">
                  Voici ce qui vous attend
                </p>
              </div>
            </div>

            <div className="space-y-4">
              <div className="flex gap-4">
                <div className="w-8 h-8 bg-charcoal text-stone-white rounded-full flex items-center justify-center flex-shrink-0">
                  <span className="font-body text-xs">1</span>
                </div>
                <div>
                  <h3 className="font-body font-medium text-charcoal">Confirmation de Commande</h3>
                  <p className="font-body text-sm text-charcoal/60">
                    Vous recevrez un email avec les détails de votre commande sous peu.
                  </p>
                </div>
              </div>

              <div className="flex gap-4">
                <div className="w-8 h-8 bg-charcoal text-stone-white rounded-full flex items-center justify-center flex-shrink-0">
                  <span className="font-body text-xs">2</span>
                </div>
                <div>
                  <h3 className="font-body font-medium text-charcoal">Confection de Votre Sac</h3>
                  <p className="font-body text-sm text-charcoal/60">
                    Notre artisane commencera à confectionner votre pièce avec le plus grand soin.
                  </p>
                </div>
              </div>

              <div className="flex gap-4">
                <div className="w-8 h-8 bg-charcoal text-stone-white rounded-full flex items-center justify-center flex-shrink-0">
                  <span className="font-body text-xs">3</span>
                </div>
                <div>
                  <h3 className="font-body font-medium text-charcoal">Expédition</h3>
                  <p className="font-body text-sm text-charcoal/60">
                    Votre commande sera expédiée sous 3 à 5 jours ouvrés.
                  </p>
                </div>
              </div>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to="/shop" data-testid="continue-shopping-btn" className="btn-primary inline-flex items-center gap-2">
              Continuer mes Achats
              <ArrowRight size={16} />
            </Link>
            <Link to="/" className="btn-secondary">
              Retour à l'Accueil
            </Link>
          </div>
        </motion.div>

        {/* Note */}
        <div className="text-center mt-12 p-6 bg-charcoal text-stone-white">
          <p className="font-accent text-xl mb-2">Un mot de notre part</p>
          <p className="font-body text-sm text-stone-white/70">
            Merci d'avoir choisi le fait main. Votre soutien aide à préserver 
            l'artisanat traditionnel et soutient les artisans indépendants.
          </p>
        </div>
      </div>
    </div>
  );
};

export default CheckoutSuccess;

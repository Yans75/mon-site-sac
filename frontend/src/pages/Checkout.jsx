import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Lock } from 'lucide-react';
import { toast } from 'sonner';
import axios from 'axios';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';

const API = `${process.env.REACT_APP_BACKEND_URL}/api`;

const Checkout = () => {
  const navigate = useNavigate();
  const { cartItems, cartTotal, sessionId } = useCart();
  const { user } = useAuth();
  const [processing, setProcessing] = useState(false);
  const [email, setEmail] = useState(user?.email || '');

  const shipping = cartTotal >= 200 ? 0 : 15;
  const total = cartTotal + shipping;

  const handleCheckout = async (e) => {
    e.preventDefault();
    
    if (!email) {
      toast.error('Veuillez entrer votre email');
      return;
    }

    if (cartItems.length === 0) {
      toast.error('Votre panier est vide');
      return;
    }

    setProcessing(true);

    try {
      const response = await axios.post(`${API}/checkout/create-session`, {
        email,
        cart_session_id: sessionId,
        shipping_address: null
      }, {
        headers: {
          'Origin': window.location.origin
        }
      });

      if (response.data.url) {
        // Redirect to Stripe Checkout
        window.location.href = response.data.url;
      }
    } catch (error) {
      console.error('Checkout error:', error);
      toast.error('Impossible de procéder au paiement', {
        description: error.response?.data?.detail || 'Veuillez réessayer'
      });
      setProcessing(false);
    }
  };

  if (cartItems.length === 0) {
    navigate('/cart');
    return null;
  }

  return (
    <div className="pt-24 pb-16">
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="font-heading text-4xl md:text-5xl text-charcoal mb-12"
        >
          Paiement
        </motion.h1>

        <div className="grid lg:grid-cols-2 gap-12 lg:gap-20">
          {/* Checkout Form */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
          >
            <form onSubmit={handleCheckout} className="space-y-8">
              {/* Contact */}
              <div>
                <h2 className="font-heading text-2xl text-charcoal mb-6">
                  Coordonnées
                </h2>
                <div>
                  <Label htmlFor="email" className="font-body text-sm text-charcoal/70 mb-2 block">
                    Adresse Email
                  </Label>
                  <Input
                    id="email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    data-testid="checkout-email"
                    className="w-full bg-stone-white border-muted focus:border-charcoal rounded-none py-3"
                    placeholder="votre@email.com"
                  />
                  <p className="font-body text-xs text-charcoal/50 mt-2">
                    La confirmation de commande sera envoyée à cette adresse
                  </p>
                </div>
              </div>

              {/* Payment Info */}
              <div className="bg-pale-sand p-6">
                <div className="flex items-center gap-3 mb-4">
                  <Lock size={16} className="text-charcoal/60" />
                  <p className="font-body text-sm text-charcoal/60">
                    Paiement sécurisé via Stripe
                  </p>
                </div>
                <p className="font-body text-xs text-charcoal/50">
                  Vous serez redirigé vers la page de paiement sécurisée de Stripe pour finaliser votre commande.
                </p>
              </div>

              <button
                type="submit"
                disabled={processing}
                data-testid="checkout-submit"
                className="btn-primary w-full py-4"
              >
                {processing ? 'Traitement en cours...' : `Payer ${total.toFixed(2)} €`}
              </button>
            </form>
          </motion.div>

          {/* Order Summary */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
          >
            <div className="bg-pale-sand p-8">
              <h2 className="font-heading text-2xl text-charcoal mb-6">
                Récapitulatif de Commande
              </h2>

              {/* Items */}
              <div className="space-y-4 mb-6">
                {cartItems.map((item) => (
                  <div key={item.product_id} className="flex gap-4">
                    <div className="w-16 h-20 bg-stone-white overflow-hidden flex-shrink-0">
                      <img
                        src={item.image || 'https://images.unsplash.com/photo-1722510825571-8cdd1fe98ba4?crop=entropy&cs=srgb&fm=jpg&q=85'}
                        alt={item.name}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div className="flex-1">
                      <h3 className="font-body text-sm text-charcoal">{item.name}</h3>
                      <p className="font-body text-xs text-charcoal/60">Qté : {item.quantity}</p>
                    </div>
                    <p className="font-body text-sm text-charcoal">{item.total?.toFixed(2)} €</p>
                  </div>
                ))}
              </div>

              <div className="border-t border-charcoal/10 pt-4 space-y-3">
                <div className="flex justify-between">
                  <span className="font-body text-charcoal/60">Sous-total</span>
                  <span className="font-body text-charcoal">{cartTotal.toFixed(2)} €</span>
                </div>
                <div className="flex justify-between">
                  <span className="font-body text-charcoal/60">Livraison</span>
                  <span className="font-body text-charcoal">
                    {shipping === 0 ? 'Gratuite' : `${shipping.toFixed(2)} €`}
                  </span>
                </div>
                <div className="flex justify-between pt-3 border-t border-charcoal/10">
                  <span className="font-heading text-xl text-charcoal">Total</span>
                  <span className="font-heading text-xl text-charcoal">{total.toFixed(2)} €</span>
                </div>
              </div>
            </div>

            {/* Trust Badges */}
            <div className="mt-8 grid grid-cols-3 gap-4 text-center">
              <div>
                <p className="font-body text-xs text-charcoal/50 uppercase tracking-wider">
                  Paiement Sécurisé
                </p>
              </div>
              <div>
                <p className="font-body text-xs text-charcoal/50 uppercase tracking-wider">
                  Retours Gratuits
                </p>
              </div>
              <div>
                <p className="font-body text-xs text-charcoal/50 uppercase tracking-wider">
                  Authenticité
                </p>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default Checkout;

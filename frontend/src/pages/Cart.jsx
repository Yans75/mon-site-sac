import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Minus, Plus, Trash2, ArrowRight, ShoppingBag, Lock } from 'lucide-react';
import { useCart } from '../context/CartContext';
import SEO from '../components/SEO';
import { formatMoney } from '../lib/shopify';

const Cart = () => {
  const {
    items,
    subtotal,
    total,
    taxes,
    loading,
    initializing,
    updateItem,
    removeItem,
    checkout,
    checkoutUrl,
  } = useCart();

  if (initializing) {
    return (
      <div className="pt-28 pb-16 min-h-screen flex items-center justify-center">
        <div className="font-body text-sm text-charcoal/30">Chargement du panier...</div>
      </div>
    );
  }

  if (!items || items.length === 0) {
    return (
      <div className="pt-28 pb-16 min-h-screen">
        <SEO title="Votre Panier" description="Votre panier est vide. Découvrez nos sacs artisanaux faits main." noindex />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center py-24"
          >
            <ShoppingBag size={48} className="mx-auto text-charcoal/10 mb-8" strokeWidth={1} />
            <h1 className="font-heading text-4xl md:text-5xl text-charcoal mb-4 tracking-tight">
              Votre panier est vide
            </h1>
            <p className="font-body text-sm font-light text-charcoal/40 mb-10">
              Découvrez notre collection de sacs artisanaux
            </p>
            <Link to="/shop" data-testid="empty-cart-shop-btn" className="btn-primary inline-flex items-center gap-3">
              Parcourir la Collection
              <ArrowRight size={14} />
            </Link>
          </motion.div>
        </div>
      </div>
    );
  }

  return (
    <div className="pt-28 pb-16">
      <SEO title="Votre Panier" description="Finalisez votre commande de sacs artisanaux. Livraison gratuite dès 200€." noindex />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-16"
        >
          <p className="font-body text-xs uppercase tracking-[0.25em] text-charcoal/30 mb-4">Panier</p>
          <h1 className="font-heading text-4xl md:text-5xl text-charcoal tracking-tight">
            Votre Panier
          </h1>
          <div className="w-12 h-px bg-terracotta mt-6" />
        </motion.div>

        <div className="grid lg:grid-cols-3 gap-12 lg:gap-16">
          <div className="lg:col-span-2">
            <div className="space-y-0">
              {items.map((item, index) => (
                <motion.div
                  key={item.lineId}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="flex gap-6 py-8 border-b border-charcoal/5"
                  data-testid={`cart-item-${item.lineId}`}
                >
                  <Link
                    to={item.productHandle ? `/product/${item.productHandle}` : '/shop'}
                    className="w-24 h-32 bg-pale-sand flex-shrink-0 overflow-hidden"
                  >
                    <img
                      src={item.image?.url || 'https://images.unsplash.com/photo-1722510825571-8cdd1fe98ba4?crop=entropy&cs=srgb&fm=jpg&q=85'}
                      alt={item.image?.altText || item.productTitle}
                      className="w-full h-full object-cover"
                    />
                  </Link>

                  <div className="flex-1">
                    <Link to={item.productHandle ? `/product/${item.productHandle}` : '/shop'}>
                      <h3 className="font-heading text-xl text-charcoal hover:text-terracotta transition-colors duration-500">
                        {item.productTitle}
                      </h3>
                    </Link>
                    {item.variantTitle && item.variantTitle !== 'Default Title' && (
                      <p className="font-body text-xs uppercase tracking-[0.15em] text-charcoal/40 mt-1">
                        {item.variantTitle}
                      </p>
                    )}
                    <p className="font-body text-xs text-charcoal/30 mt-1">
                      {formatMoney(item.unitPrice)}
                    </p>

                    <div className="flex items-center gap-5 mt-5">
                      <div className="flex items-center border border-charcoal/10">
                        <button
                          onClick={() => updateItem(item.lineId, item.quantity - 1)}
                          disabled={loading}
                          data-testid={`decrease-${item.lineId}`}
                          className="p-2.5 hover:bg-pale-sand transition-colors duration-300 disabled:opacity-30"
                        >
                          <Minus size={12} />
                        </button>
                        <span className="px-5 font-body text-xs text-charcoal">{item.quantity}</span>
                        <button
                          onClick={() => updateItem(item.lineId, item.quantity + 1)}
                          disabled={loading}
                          data-testid={`increase-${item.lineId}`}
                          className="p-2.5 hover:bg-pale-sand transition-colors duration-300 disabled:opacity-30"
                        >
                          <Plus size={12} />
                        </button>
                      </div>

                      <button
                        onClick={() => removeItem(item.lineId)}
                        disabled={loading}
                        data-testid={`remove-${item.lineId}`}
                        className="text-charcoal/20 hover:text-terracotta transition-colors duration-500 disabled:opacity-30"
                      >
                        <Trash2 size={16} strokeWidth={1.5} />
                      </button>
                    </div>
                  </div>

                  <div className="text-right">
                    <p className="font-heading text-lg text-charcoal">
                      {formatMoney(item.lineTotal)}
                    </p>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>

          <div className="lg:col-span-1">
            <motion.div
              initial={{ opacity: 0, x: 30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2 }}
              className="bg-pale-sand p-10 sticky top-28"
            >
              <p className="font-body text-xs uppercase tracking-[0.2em] text-charcoal/30 mb-6">Récapitulatif</p>

              <div className="space-y-4 mb-6">
                <div className="flex justify-between">
                  <span className="font-body text-sm font-light text-charcoal/40">Sous-total</span>
                  <span className="font-body text-sm text-charcoal">{formatMoney(subtotal)}</span>
                </div>
                {taxes && parseFloat(taxes.amount) > 0 && (
                  <div className="flex justify-between">
                    <span className="font-body text-sm font-light text-charcoal/40">TVA incluse</span>
                    <span className="font-body text-sm text-charcoal">{formatMoney(taxes)}</span>
                  </div>
                )}
                <p className="font-body text-[10px] text-charcoal/40 uppercase tracking-wider">
                  Livraison calculée à l'étape suivante
                </p>
              </div>

              <div className="border-t border-charcoal/5 pt-6 mb-8">
                <div className="flex justify-between">
                  <span className="font-heading text-xl text-charcoal">Total</span>
                  <span className="font-heading text-xl text-charcoal">{formatMoney(total)}</span>
                </div>
              </div>

              <button
                onClick={checkout}
                disabled={!checkoutUrl || loading}
                data-testid="proceed-to-checkout"
                className="btn-primary w-full flex items-center justify-center gap-3 disabled:opacity-50"
              >
                <Lock size={14} />
                Passer commande
                <ArrowRight size={14} />
              </button>

              <p className="text-center mt-4 font-body text-[10px] uppercase tracking-[0.15em] text-charcoal/30">
                Paiement sécurisé via Shopify
              </p>

              <Link
                to="/shop"
                className="block text-center mt-6 font-body text-xs uppercase tracking-[0.15em] text-charcoal/30 hover:text-charcoal transition-colors duration-500"
              >
                Continuer mes Achats
              </Link>
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Cart;

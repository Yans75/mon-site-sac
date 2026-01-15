import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Minus, Plus, Trash2, ArrowRight, ShoppingBag } from 'lucide-react';
import { useCart } from '../context/CartContext';

const Cart = () => {
  const { cartItems, cartTotal, loading, updateQuantity, removeFromCart } = useCart();

  const shipping = cartTotal >= 200 ? 0 : 15;
  const total = cartTotal + shipping;

  if (cartItems.length === 0) {
    return (
      <div className="pt-24 pb-16 min-h-screen">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center py-20"
          >
            <ShoppingBag size={64} className="mx-auto text-charcoal/20 mb-6" />
            <h1 className="font-heading text-4xl text-charcoal mb-4">
              Votre panier est vide
            </h1>
            <p className="font-body text-charcoal/60 mb-8">
              Découvrez notre collection de sacs artisanaux
            </p>
            <Link to="/shop" data-testid="empty-cart-shop-btn" className="btn-primary inline-flex items-center gap-2">
              Parcourir la Collection
              <ArrowRight size={16} />
            </Link>
          </motion.div>
        </div>
      </div>
    );
  }

  return (
    <div className="pt-24 pb-16">
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="font-heading text-4xl md:text-5xl text-charcoal mb-12"
        >
          Votre Panier
        </motion.h1>

        <div className="grid lg:grid-cols-3 gap-12">
          {/* Cart Items */}
          <div className="lg:col-span-2">
            <div className="space-y-6">
              {cartItems.map((item, index) => (
                <motion.div
                  key={item.product_id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="flex gap-6 pb-6 border-b border-muted"
                  data-testid={`cart-item-${item.product_id}`}
                >
                  {/* Image */}
                  <Link to={`/product/${item.product_id}`} className="w-24 h-32 bg-pale-sand flex-shrink-0 overflow-hidden">
                    <img
                      src={item.image || 'https://images.unsplash.com/photo-1722510825571-8cdd1fe98ba4?crop=entropy&cs=srgb&fm=jpg&q=85'}
                      alt={item.name}
                      className="w-full h-full object-cover"
                    />
                  </Link>

                  {/* Details */}
                  <div className="flex-1">
                    <Link to={`/product/${item.product_id}`}>
                      <h3 className="font-heading text-xl text-charcoal hover:text-terracotta transition-colors">
                        {item.name}
                      </h3>
                    </Link>
                    <p className="font-body text-sm text-charcoal/60 mt-1">
                      {item.price?.toFixed(2)} €
                    </p>

                    {/* Quantity */}
                    <div className="flex items-center gap-4 mt-4">
                      <div className="flex items-center border border-muted">
                        <button
                          onClick={() => updateQuantity(item.product_id, item.quantity - 1)}
                          disabled={loading}
                          data-testid={`decrease-${item.product_id}`}
                          className="p-2 hover:bg-pale-sand transition-colors disabled:opacity-50"
                        >
                          <Minus size={14} />
                        </button>
                        <span className="px-4 font-body text-sm">{item.quantity}</span>
                        <button
                          onClick={() => updateQuantity(item.product_id, item.quantity + 1)}
                          disabled={loading}
                          data-testid={`increase-${item.product_id}`}
                          className="p-2 hover:bg-pale-sand transition-colors disabled:opacity-50"
                        >
                          <Plus size={14} />
                        </button>
                      </div>

                      <button
                        onClick={() => removeFromCart(item.product_id)}
                        disabled={loading}
                        data-testid={`remove-${item.product_id}`}
                        className="text-charcoal/40 hover:text-terracotta transition-colors disabled:opacity-50"
                      >
                        <Trash2 size={18} />
                      </button>
                    </div>
                  </div>

                  {/* Item Total */}
                  <div className="text-right">
                    <p className="font-heading text-lg text-charcoal">
                      {item.total?.toFixed(2)} €
                    </p>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>

          {/* Order Summary */}
          <div className="lg:col-span-1">
            <motion.div
              initial={{ opacity: 0, x: 30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2 }}
              className="bg-pale-sand p-8 sticky top-24"
            >
              <h2 className="font-heading text-2xl text-charcoal mb-6">
                Récapitulatif
              </h2>

              <div className="space-y-4 mb-6">
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
                {shipping > 0 && (
                  <p className="font-body text-xs text-terracotta">
                    Livraison gratuite dès 200€ d'achat
                  </p>
                )}
              </div>

              <div className="border-t border-charcoal/10 pt-4 mb-6">
                <div className="flex justify-between">
                  <span className="font-heading text-xl text-charcoal">Total</span>
                  <span className="font-heading text-xl text-charcoal">{total.toFixed(2)} €</span>
                </div>
              </div>

              <Link
                to="/checkout"
                data-testid="proceed-to-checkout"
                className="btn-primary w-full flex items-center justify-center gap-2"
              >
                Passer à la Caisse
                <ArrowRight size={16} />
              </Link>

              <Link
                to="/shop"
                className="block text-center mt-4 font-body text-sm text-charcoal/60 hover:text-charcoal transition-colors"
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

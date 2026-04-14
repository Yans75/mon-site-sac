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
      <div className="pt-28 pb-16 min-h-screen">
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
          {/* Cart Items */}
          <div className="lg:col-span-2">
            <div className="space-y-0">
              {cartItems.map((item, index) => (
                <motion.div
                  key={item.product_id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="flex gap-6 py-8 border-b border-charcoal/5"
                  data-testid={`cart-item-${item.product_id}`}
                >
                  <Link to={`/product/${item.product_id}`} className="w-24 h-32 bg-pale-sand flex-shrink-0 overflow-hidden">
                    <img
                      src={item.image || 'https://images.unsplash.com/photo-1722510825571-8cdd1fe98ba4?crop=entropy&cs=srgb&fm=jpg&q=85'}
                      alt={item.name}
                      className="w-full h-full object-cover"
                    />
                  </Link>

                  <div className="flex-1">
                    <Link to={`/product/${item.product_id}`}>
                      <h3 className="font-heading text-xl text-charcoal hover:text-terracotta transition-colors duration-500">
                        {item.name}
                      </h3>
                    </Link>
                    <p className="font-body text-xs text-charcoal/30 mt-1">
                      {item.price?.toFixed(2)} €
                    </p>

                    <div className="flex items-center gap-5 mt-5">
                      <div className="flex items-center border border-charcoal/10">
                        <button
                          onClick={() => updateQuantity(item.product_id, item.quantity - 1)}
                          disabled={loading}
                          data-testid={`decrease-${item.product_id}`}
                          className="p-2.5 hover:bg-pale-sand transition-colors duration-300 disabled:opacity-30"
                        >
                          <Minus size={12} />
                        </button>
                        <span className="px-5 font-body text-xs text-charcoal">{item.quantity}</span>
                        <button
                          onClick={() => updateQuantity(item.product_id, item.quantity + 1)}
                          disabled={loading}
                          data-testid={`increase-${item.product_id}`}
                          className="p-2.5 hover:bg-pale-sand transition-colors duration-300 disabled:opacity-30"
                        >
                          <Plus size={12} />
                        </button>
                      </div>

                      <button
                        onClick={() => removeFromCart(item.product_id)}
                        disabled={loading}
                        data-testid={`remove-${item.product_id}`}
                        className="text-charcoal/20 hover:text-terracotta transition-colors duration-500 disabled:opacity-30"
                      >
                        <Trash2 size={16} strokeWidth={1.5} />
                      </button>
                    </div>
                  </div>

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
              className="bg-pale-sand p-10 sticky top-28"
            >
              <p className="font-body text-xs uppercase tracking-[0.2em] text-charcoal/30 mb-6">Récapitulatif</p>

              <div className="space-y-4 mb-6">
                <div className="flex justify-between">
                  <span className="font-body text-sm font-light text-charcoal/40">Sous-total</span>
                  <span className="font-body text-sm text-charcoal">{cartTotal.toFixed(2)} €</span>
                </div>
                <div className="flex justify-between">
                  <span className="font-body text-sm font-light text-charcoal/40">Livraison</span>
                  <span className="font-body text-sm text-charcoal">
                    {shipping === 0 ? 'Gratuite' : `${shipping.toFixed(2)} €`}
                  </span>
                </div>
                {shipping > 0 && (
                  <p className="font-body text-[10px] text-terracotta uppercase tracking-wider">
                    Livraison gratuite dès 200€
                  </p>
                )}
              </div>

              <div className="border-t border-charcoal/5 pt-6 mb-8">
                <div className="flex justify-between">
                  <span className="font-heading text-xl text-charcoal">Total</span>
                  <span className="font-heading text-xl text-charcoal">{total.toFixed(2)} €</span>
                </div>
              </div>

              <Link
                to="/checkout"
                data-testid="proceed-to-checkout"
                className="btn-primary w-full flex items-center justify-center gap-3"
              >
                Passer à la Caisse
                <ArrowRight size={14} />
              </Link>

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

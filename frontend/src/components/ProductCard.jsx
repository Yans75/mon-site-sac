import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ShoppingBag } from 'lucide-react';
import { toast } from 'sonner';
import { useCart } from '../context/CartContext';

const ProductCard = ({ product, index = 0 }) => {
  const { product_id, name, price, images, stock } = product;
  const { addToCart } = useCart();

  const handleQuickAdd = async (e) => {
    e.preventDefault();
    e.stopPropagation();
    const success = await addToCart(product_id, 1);
    if (success) {
      toast.success('Ajouté au panier', { description: name });
    }
  };
  
  return (
    <motion.article
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, delay: index * 0.1 }}
      className="group"
    >
      <Link 
        to={`/product/${product_id}`}
        data-testid={`product-card-${product_id}`}
        className="block"
      >
        {/* Image - 3:4 ratio */}
        <div className="aspect-[3/4] overflow-hidden bg-pale-sand relative">
          <img
            src={images?.[0] || 'https://images.unsplash.com/photo-1722510825571-8cdd1fe98ba4?crop=entropy&cs=srgb&fm=jpg&q=85'}
            alt={name}
            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-[1.04]"
          />
          
          {/* Quick Add - appears on hover */}
          <div className="absolute inset-x-0 bottom-0 p-5 opacity-0 translate-y-2 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-500">
            <button
              onClick={handleQuickAdd}
              data-testid={`quick-add-${product_id}`}
              className="w-full bg-charcoal/90 backdrop-blur-sm text-stone-white py-3 text-xs uppercase tracking-[0.15em] font-medium hover:bg-terracotta transition-colors duration-300 flex items-center justify-center gap-2"
            >
              <ShoppingBag size={14} strokeWidth={1.5} />
              Ajouter au panier
            </button>
          </div>

          {/* Badges */}
          {stock === 1 && (
            <span className="absolute top-4 left-4 bg-terracotta text-stone-white text-[10px] px-3 py-1.5 uppercase tracking-[0.2em] font-medium">
              Pièce unique
            </span>
          )}
          {stock === 0 && (
            <span className="absolute top-4 left-4 bg-charcoal/80 text-stone-white text-[10px] px-3 py-1.5 uppercase tracking-[0.2em] font-medium">
              Épuisé
            </span>
          )}
        </div>

        {/* Info */}
        <div className="pt-5 space-y-1.5">
          <h3 className="font-heading text-xl text-charcoal group-hover:text-terracotta transition-colors duration-500">
            {name}
          </h3>
          <p className="font-body text-sm font-light text-charcoal/60 tracking-wide">
            {price?.toFixed(2)} €
          </p>
        </div>
      </Link>
    </motion.article>
  );
};

export default ProductCard;

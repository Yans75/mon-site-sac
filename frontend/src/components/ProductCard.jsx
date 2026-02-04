import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ShoppingBag } from 'lucide-react';
import { toast } from 'sonner';
import { useCart } from '../context/CartContext';

const ProductCard = ({ product, index = 0 }) => {
  const { product_id, name, price, images, limited_pieces, stock } = product;
  const { addToCart } = useCart();

  const handleQuickAdd = async (e) => {
    e.preventDefault();
    e.stopPropagation();
    const success = await addToCart(product_id, 1);
    if (success) {
      toast.success('Ajouté au panier', {
        description: name,
      });
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
        {/* Image */}
        <div className="aspect-square overflow-hidden bg-pale-sand mb-4 rounded-lg relative">
          <motion.img
            src={images?.[0] || 'https://images.unsplash.com/photo-1722510825571-8cdd1fe98ba4?crop=entropy&cs=srgb&fm=jpg&q=85'}
            alt={name}
            className="w-full h-full object-cover transition-all duration-700 group-hover:scale-105"
          />
          
          {/* Quick Add Button */}
          <button
            onClick={handleQuickAdd}
            className="absolute bottom-4 right-4 bg-charcoal text-stone-white p-3 rounded-full opacity-0 group-hover:opacity-100 transition-all duration-300 hover:bg-terracotta transform translate-y-2 group-hover:translate-y-0"
            data-testid={`quick-add-${product_id}`}
          >
            <ShoppingBag size={18} />
          </button>

          {/* Badge Stock */}
          {stock === 1 && (
            <span className="absolute top-4 left-4 bg-terracotta text-stone-white text-xs px-3 py-1 rounded-full uppercase tracking-wider">
              Pièce unique
            </span>
          )}
          {stock === 0 && (
            <span className="absolute top-4 left-4 bg-charcoal/80 text-stone-white text-xs px-3 py-1 rounded-full uppercase tracking-wider">
              Épuisé
            </span>
          )}
        </div>

        {/* Info */}
        <div className="space-y-2">
          <h3 className="font-heading text-xl text-charcoal group-hover:text-terracotta transition-colors duration-300">
            {name}
          </h3>
          <div className="flex items-center justify-between">
            <p className="font-body text-lg font-medium text-charcoal">
              {price?.toFixed(2)} €
            </p>
            {limited_pieces === 1 && (
              <span className="font-body text-xs text-terracotta uppercase tracking-wider">
                Unique
              </span>
            )}
          </div>
        </div>
      </Link>
    </motion.article>
  );
};

export default ProductCard;

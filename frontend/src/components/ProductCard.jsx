import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';

const ProductCard = ({ product, index = 0 }) => {
  const { product_id, name, price, images, limited_pieces, stock } = product;
  
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
        <div className="aspect-[3/4] overflow-hidden bg-pale-sand mb-4">
          <motion.img
            src={images?.[0] || 'https://images.unsplash.com/photo-1722510825571-8cdd1fe98ba4?crop=entropy&cs=srgb&fm=jpg&q=85'}
            alt={name}
            className="w-full h-full object-cover transition-all duration-700 filter grayscale-[15%] group-hover:grayscale-0 group-hover:scale-[1.03]"
          />
        </div>

        {/* Info */}
        <div className="space-y-2">
          <h3 className="font-heading text-xl text-charcoal group-hover:text-terracotta transition-colors duration-300">
            {name}
          </h3>
          <div className="flex items-center justify-between">
            <p className="font-body text-sm text-charcoal/70">
              ${price?.toFixed(2)}
            </p>
            {stock <= 3 && stock > 0 && (
              <span className="font-body text-xs text-terracotta uppercase tracking-wider">
                Only {stock} left
              </span>
            )}
            {limited_pieces && (
              <span className="font-body text-xs text-charcoal/50 uppercase tracking-wider">
                Limited to {limited_pieces} pieces
              </span>
            )}
          </div>
        </div>
      </Link>
    </motion.article>
  );
};

export default ProductCard;

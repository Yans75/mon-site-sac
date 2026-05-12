import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ShoppingBag } from 'lucide-react';
import { useCart } from '../context/CartContext';
import { formatMoney, getFirstAvailableVariantId } from '../lib/shopify';

const ProductCard = ({ product, index = 0 }) => {
  const { addItem } = useCart();

  if (!product) return null;

  const { handle, title, featuredImage, priceRange, availableForSale, tags } = product;
  const variantId = getFirstAvailableVariantId(product);
  const price = priceRange?.minVariantPrice;
  const imageUrl = featuredImage?.url
    || product.images?.edges?.[0]?.node?.url
    || 'https://images.unsplash.com/photo-1722510825571-8cdd1fe98ba4?crop=entropy&cs=srgb&fm=jpg&q=85';

  const handleQuickAdd = async (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (!variantId) return;
    await addItem(variantId, 1);
  };

  const isUnique = Array.isArray(tags) && tags.includes('unique');
  const isSoldOut = !availableForSale;

  return (
    <motion.article
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, delay: index * 0.1 }}
      className="group"
    >
      <Link
        to={`/product/${handle}`}
        data-testid={`product-card-${handle}`}
        className="block"
      >
        <div className="aspect-[3/4] overflow-hidden bg-pale-sand relative">
          <img
            src={imageUrl}
            alt={`${title} — Sac artisanal fait main, Artem Creations`}
            loading="lazy"
            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-[1.04]"
          />

          {!isSoldOut && variantId && (
            <div className="absolute inset-x-0 bottom-0 p-5 opacity-0 translate-y-2 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-500">
              <button
                onClick={handleQuickAdd}
                data-testid={`quick-add-${handle}`}
                className="w-full bg-charcoal/90 backdrop-blur-sm text-stone-white py-3 text-xs uppercase tracking-[0.15em] font-medium hover:bg-terracotta transition-colors duration-300 flex items-center justify-center gap-2"
              >
                <ShoppingBag size={14} strokeWidth={1.5} />
                Ajouter au panier
              </button>
            </div>
          )}

          {isUnique && !isSoldOut && (
            <span className="absolute top-4 left-4 bg-terracotta text-stone-white text-[10px] px-3 py-1.5 uppercase tracking-[0.2em] font-medium">
              Pièce unique
            </span>
          )}
          {isSoldOut && (
            <span className="absolute top-4 left-4 bg-charcoal/80 text-stone-white text-[10px] px-3 py-1.5 uppercase tracking-[0.2em] font-medium">
              Épuisé
            </span>
          )}
        </div>

        <div className="pt-5 space-y-1.5">
          <h3 className="font-heading text-xl text-charcoal group-hover:text-terracotta transition-colors duration-500">
            {title}
          </h3>
          <p className="font-body text-sm font-light text-charcoal/60 tracking-wide">
            {formatMoney(price)}
          </p>
        </div>
      </Link>
    </motion.article>
  );
};

export default ProductCard;

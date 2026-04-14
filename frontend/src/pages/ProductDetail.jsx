import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowLeft, Minus, Plus, Check } from 'lucide-react';
import { toast } from 'sonner';
import axios from 'axios';
import { useCart } from '../context/CartContext';

const API = `${process.env.REACT_APP_BACKEND_URL}/api`;

const ProductDetail = () => {
  const { productId } = useParams();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [quantity, setQuantity] = useState(1);
  const [selectedImage, setSelectedImage] = useState(0);
  const [adding, setAdding] = useState(false);
  const { addToCart } = useCart();

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const response = await axios.get(`${API}/products/${productId}`);
        setProduct(response.data);
      } catch (error) {
        console.error('Error fetching product:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchProduct();
  }, [productId]);

  const handleAddToCart = async () => {
    setAdding(true);
    const success = await addToCart(productId, quantity);
    if (success) {
      toast.success('Ajouté au panier', {
        description: `${product.name} × ${quantity}`,
      });
    } else {
      toast.error("Impossible d'ajouter au panier");
    }
    setAdding(false);
  };

  if (loading) {
    return (
      <div className="pt-28 pb-16 min-h-screen">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-12 lg:gap-24">
            <div className="aspect-[3/4] bg-pale-sand animate-pulse" />
            <div className="space-y-6 lg:py-12">
              <div className="h-8 bg-pale-sand w-3/4 animate-pulse" />
              <div className="h-6 bg-pale-sand w-1/4 animate-pulse" />
              <div className="h-32 bg-pale-sand animate-pulse" />
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="pt-28 pb-16 min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="font-heading text-3xl text-charcoal mb-6">Produit introuvable</h1>
          <Link to="/shop" className="btn-primary">Retour à la Boutique</Link>
        </div>
      </div>
    );
  }

  return (
    <div className="pt-28 pb-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Back Link */}
        <Link 
          to="/shop" 
          data-testid="back-to-shop"
          className="inline-flex items-center gap-2 text-charcoal/30 hover:text-charcoal transition-colors duration-500 mb-10"
        >
          <ArrowLeft size={14} />
          <span className="font-body text-xs uppercase tracking-[0.15em]">Retour à la Collection</span>
        </Link>

        <div className="grid lg:grid-cols-2 gap-12 lg:gap-24">
          {/* Images */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
          >
            <div className="aspect-[3/4] overflow-hidden bg-pale-sand mb-4">
              <img
                src={product.images?.[selectedImage] || 'https://images.unsplash.com/photo-1722510825571-8cdd1fe98ba4?crop=entropy&cs=srgb&fm=jpg&q=85'}
                alt={product.name}
                className="w-full h-full object-cover"
              />
            </div>
            {product.images?.length > 1 && (
              <div className="flex gap-3">
                {product.images.map((img, i) => (
                  <button
                    key={i}
                    onClick={() => setSelectedImage(i)}
                    data-testid={`image-thumb-${i}`}
                    className={`w-20 h-24 overflow-hidden transition-all duration-500 ${
                      selectedImage === i ? 'ring-1 ring-charcoal' : 'opacity-40 hover:opacity-70'
                    }`}
                  >
                    <img src={img} alt="" className="w-full h-full object-cover" />
                  </button>
                ))}
              </div>
            )}
          </motion.div>

          {/* Details */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="lg:py-8"
          >
            {product.limited_pieces && (
              <span className="inline-block font-body text-[10px] uppercase tracking-[0.2em] text-terracotta border border-terracotta/20 px-4 py-1.5 mb-6">
                Limité à {product.limited_pieces} pièces
              </span>
            )}

            <h1 className="font-heading text-4xl md:text-5xl text-charcoal mb-4 tracking-tight">
              {product.name}
            </h1>

            <p className="font-heading text-2xl text-charcoal/80 mb-8">
              {product.price?.toFixed(2)} €
            </p>

            <div className="w-12 h-px bg-charcoal/10 mb-8" />

            <p className="font-body text-sm font-light text-charcoal/50 leading-relaxed mb-10">
              {product.description}
            </p>

            {/* Details List */}
            <div className="border-t border-charcoal/5 py-6 mb-8 space-y-4">
              {product.material && (
                <div className="flex justify-between">
                  <span className="font-body text-xs uppercase tracking-[0.15em] text-charcoal/30">Matière</span>
                  <span className="font-body text-sm text-charcoal">{product.material}</span>
                </div>
              )}
              {product.craftsmanship_time && (
                <div className="flex justify-between">
                  <span className="font-body text-xs uppercase tracking-[0.15em] text-charcoal/30">Temps de confection</span>
                  <span className="font-body text-sm text-charcoal">{product.craftsmanship_time}</span>
                </div>
              )}
              {product.stock !== undefined && (
                <div className="flex justify-between">
                  <span className="font-body text-xs uppercase tracking-[0.15em] text-charcoal/30">Disponibilité</span>
                  <span className={`font-body text-sm ${product.stock <= 3 ? 'text-terracotta' : 'text-charcoal'}`}>
                    {product.stock > 0 ? `${product.stock} en stock` : 'Épuisé'}
                  </span>
                </div>
              )}
            </div>

            {/* Quantity & Add to Cart */}
            {product.stock > 0 ? (
              <div className="space-y-4">
                <div className="flex items-center gap-6">
                  <span className="font-body text-xs uppercase tracking-[0.15em] text-charcoal/30">Quantité</span>
                  <div className="flex items-center border border-charcoal/10">
                    <button
                      onClick={() => setQuantity(Math.max(1, quantity - 1))}
                      data-testid="quantity-decrease"
                      className="p-3 hover:bg-pale-sand transition-colors duration-300"
                    >
                      <Minus size={14} />
                    </button>
                    <span className="px-6 font-body text-sm text-charcoal" data-testid="quantity-value">
                      {quantity}
                    </span>
                    <button
                      onClick={() => setQuantity(Math.min(product.stock, quantity + 1))}
                      data-testid="quantity-increase"
                      className="p-3 hover:bg-pale-sand transition-colors duration-300"
                    >
                      <Plus size={14} />
                    </button>
                  </div>
                </div>

                <button
                  onClick={handleAddToCart}
                  disabled={adding}
                  data-testid="add-to-cart-btn"
                  className="w-full btn-primary py-5 flex items-center justify-center gap-3"
                >
                  {adding ? 'Ajout en cours...' : 'Ajouter au Panier'}
                </button>
              </div>
            ) : (
              <button
                disabled
                className="w-full bg-pale-sand text-charcoal/30 px-10 py-5 uppercase tracking-[0.15em] text-xs cursor-not-allowed"
              >
                Épuisé
              </button>
            )}

            {/* Extra Info */}
            <div className="mt-10 pt-8 border-t border-charcoal/5 space-y-3">
              {['Livraison gratuite dès 200€', "Certificat d'authenticité inclus", "Signé par l'artisan"].map((text) => (
                <p key={text} className="font-body text-xs text-charcoal/30 flex items-center gap-3">
                  <Check size={12} strokeWidth={1.5} />
                  {text}
                </p>
              ))}
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetail;

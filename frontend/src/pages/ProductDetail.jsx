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
      toast.success('Added to your bag', {
        description: `${product.name} × ${quantity}`,
      });
    } else {
      toast.error('Could not add to bag');
    }
    setAdding(false);
  };

  if (loading) {
    return (
      <div className="pt-24 pb-16 min-h-screen">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-12 lg:gap-20">
            <div className="aspect-[3/4] bg-pale-sand animate-pulse" />
            <div className="space-y-4">
              <div className="h-10 bg-pale-sand w-3/4 animate-pulse" />
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
      <div className="pt-24 pb-16 min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="font-heading text-3xl text-charcoal mb-4">Product not found</h1>
          <Link to="/shop" className="btn-primary">
            Back to Shop
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="pt-24 pb-16">
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        {/* Back Link */}
        <Link 
          to="/shop" 
          data-testid="back-to-shop"
          className="inline-flex items-center gap-2 text-charcoal/60 hover:text-charcoal transition-colors mb-8"
        >
          <ArrowLeft size={16} />
          <span className="font-body text-sm">Back to Collection</span>
        </Link>

        <div className="grid lg:grid-cols-2 gap-12 lg:gap-20">
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
              <div className="flex gap-4">
                {product.images.map((img, i) => (
                  <button
                    key={i}
                    onClick={() => setSelectedImage(i)}
                    data-testid={`image-thumb-${i}`}
                    className={`w-20 h-20 overflow-hidden ${
                      selectedImage === i ? 'ring-2 ring-charcoal' : 'opacity-60 hover:opacity-100'
                    } transition-opacity`}
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
            {/* Limited Edition Badge */}
            {product.limited_pieces && (
              <span className="inline-block bg-terracotta/10 text-terracotta font-body text-xs uppercase tracking-widest px-3 py-1 mb-4">
                Limited to {product.limited_pieces} pieces
              </span>
            )}

            <h1 className="font-heading text-4xl md:text-5xl text-charcoal mb-4">
              {product.name}
            </h1>

            <p className="font-heading text-2xl text-charcoal mb-6">
              ${product.price?.toFixed(2)}
            </p>

            <div className="prose max-w-none mb-8">
              <p className="font-body text-charcoal/70 leading-relaxed">
                {product.description}
              </p>
            </div>

            {/* Details List */}
            <div className="border-t border-b border-muted py-6 mb-8 space-y-3">
              {product.material && (
                <div className="flex justify-between">
                  <span className="font-body text-sm text-charcoal/60">Material</span>
                  <span className="font-body text-sm text-charcoal">{product.material}</span>
                </div>
              )}
              {product.craftsmanship_time && (
                <div className="flex justify-between">
                  <span className="font-body text-sm text-charcoal/60">Craftsmanship Time</span>
                  <span className="font-body text-sm text-charcoal">{product.craftsmanship_time}</span>
                </div>
              )}
              {product.stock !== undefined && (
                <div className="flex justify-between">
                  <span className="font-body text-sm text-charcoal/60">Availability</span>
                  <span className={`font-body text-sm ${product.stock <= 3 ? 'text-terracotta' : 'text-charcoal'}`}>
                    {product.stock > 0 ? `${product.stock} in stock` : 'Sold out'}
                  </span>
                </div>
              )}
            </div>

            {/* Quantity & Add to Cart */}
            {product.stock > 0 ? (
              <div className="space-y-4">
                <div className="flex items-center gap-4">
                  <span className="font-body text-sm text-charcoal/60">Quantity</span>
                  <div className="flex items-center border border-muted">
                    <button
                      onClick={() => setQuantity(Math.max(1, quantity - 1))}
                      data-testid="quantity-decrease"
                      className="p-3 hover:bg-pale-sand transition-colors"
                    >
                      <Minus size={16} />
                    </button>
                    <span className="px-6 font-body text-charcoal" data-testid="quantity-value">
                      {quantity}
                    </span>
                    <button
                      onClick={() => setQuantity(Math.min(product.stock, quantity + 1))}
                      data-testid="quantity-increase"
                      className="p-3 hover:bg-pale-sand transition-colors"
                    >
                      <Plus size={16} />
                    </button>
                  </div>
                </div>

                <button
                  onClick={handleAddToCart}
                  disabled={adding}
                  data-testid="add-to-cart-btn"
                  className="w-full btn-primary py-4 flex items-center justify-center gap-2"
                >
                  {adding ? (
                    'Adding...'
                  ) : (
                    <>
                      Add to Bag
                      <Check size={16} />
                    </>
                  )}
                </button>
              </div>
            ) : (
              <button
                disabled
                className="w-full bg-muted text-charcoal/50 px-8 py-4 rounded-full uppercase tracking-widest text-xs cursor-not-allowed"
              >
                Sold Out
              </button>
            )}

            {/* Extra Info */}
            <div className="mt-8 space-y-3">
              <p className="font-body text-xs text-charcoal/50 flex items-center gap-2">
                <Check size={12} /> Free shipping on orders over $200
              </p>
              <p className="font-body text-xs text-charcoal/50 flex items-center gap-2">
                <Check size={12} /> Certificate of authenticity included
              </p>
              <p className="font-body text-xs text-charcoal/50 flex items-center gap-2">
                <Check size={12} /> Signed by the artisan
              </p>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetail;

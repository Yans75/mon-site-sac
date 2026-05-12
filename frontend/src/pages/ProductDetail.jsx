import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowLeft, Minus, Plus, Check } from 'lucide-react';
import { useCart } from '../context/CartContext';
import SEO from '../components/SEO';
import Breadcrumb from '../components/Breadcrumb';
import { getProductByHandle, formatMoney, getProductImages } from '../lib/shopify';

const ProductDetail = () => {
  const { handle } = useParams();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [quantity, setQuantity] = useState(1);
  const [selectedImage, setSelectedImage] = useState(0);
  const [selectedVariantId, setSelectedVariantId] = useState(null);
  const [adding, setAdding] = useState(false);
  const { addItem } = useCart();

  useEffect(() => {
    const fetchProduct = async () => {
      setLoading(true);
      try {
        const data = await getProductByHandle(handle);
        setProduct(data);
        if (data?.variants?.edges?.length) {
          const firstAvailable = data.variants.edges.find((e) => e.node.availableForSale);
          setSelectedVariantId((firstAvailable || data.variants.edges[0]).node.id);
        }
      } catch (error) {
        console.error('Error fetching product:', error);
      } finally {
        setLoading(false);
      }
    };
    if (handle) fetchProduct();
  }, [handle]);

  const variants = product?.variants?.edges?.map((e) => e.node) || [];
  const selectedVariant = variants.find((v) => v.id === selectedVariantId) || variants[0];
  const images = getProductImages(product);
  const price = selectedVariant?.price || product?.priceRange?.minVariantPrice;
  const compareAtPrice = selectedVariant?.compareAtPrice;
  const maxQty = 99;

  const handleAddToCart = async () => {
    if (!selectedVariantId) return;
    setAdding(true);
    try {
      await addItem(selectedVariantId, quantity);
    } finally {
      setAdding(false);
    }
  };

  const productJsonLd = product ? {
    '@context': 'https://schema.org',
    '@type': 'Product',
    name: product.title,
    description: product.description,
    image: images[0]?.url,
    brand: { '@type': 'Brand', name: product.vendor || 'Artem Creations' },
    offers: {
      '@type': 'Offer',
      price: price?.amount,
      priceCurrency: price?.currencyCode || 'EUR',
      availability: product.availableForSale ? 'https://schema.org/InStock' : 'https://schema.org/OutOfStock',
      seller: { '@type': 'Organization', name: 'Artem Creations' },
    },
  } : null;

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

  const hasVariantOptions = variants.length > 1;

  return (
    <div className="pt-28 pb-16">
      <SEO
        title={product.title}
        description={`${product.title} — Sac artisanal fait main par Artem Creations. ${(product.description || '').substring(0, 100)}`}
        image={images[0]?.url}
        type="product"
        price={String(price?.amount || '')}
        jsonLd={productJsonLd}
      />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <Breadcrumb items={[
          { label: 'Accueil', to: '/' },
          { label: 'Boutique', to: '/shop' },
          { label: product.title },
        ]} />

        <Link
          to="/shop"
          data-testid="back-to-shop"
          className="inline-flex items-center gap-2 text-charcoal/30 hover:text-charcoal transition-colors duration-500 mb-10"
        >
          <ArrowLeft size={14} />
          <span className="font-body text-xs uppercase tracking-[0.15em]">Retour à la Collection</span>
        </Link>

        <div className="grid lg:grid-cols-2 gap-12 lg:gap-24">
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
          >
            <div className="aspect-[3/4] overflow-hidden bg-pale-sand mb-4">
              <img
                src={images[selectedImage]?.url || 'https://images.unsplash.com/photo-1722510825571-8cdd1fe98ba4?crop=entropy&cs=srgb&fm=jpg&q=85'}
                alt={images[selectedImage]?.altText || `${product.title} — Sac fait main par Artem Creations`}
                className="w-full h-full object-cover"
              />
            </div>
            {images.length > 1 && (
              <div className="flex gap-3 flex-wrap">
                {images.map((img, i) => (
                  <button
                    key={i}
                    onClick={() => setSelectedImage(i)}
                    data-testid={`image-thumb-${i}`}
                    className={`w-20 h-24 overflow-hidden transition-all duration-500 ${
                      selectedImage === i ? 'ring-1 ring-charcoal' : 'opacity-40 hover:opacity-70'
                    }`}
                  >
                    <img src={img.url} alt={img.altText || `${product.title} vue ${i + 1}`} loading="lazy" className="w-full h-full object-cover" />
                  </button>
                ))}
              </div>
            )}
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="lg:py-8"
          >
            {Array.isArray(product.tags) && product.tags.includes('unique') && product.availableForSale && (
              <span className="inline-block font-body text-[10px] uppercase tracking-[0.2em] text-terracotta border border-terracotta/20 px-4 py-1.5 mb-6">
                Pièce unique
              </span>
            )}

            <h1 className="font-heading text-4xl md:text-5xl text-charcoal mb-4 tracking-tight">
              {product.title}
            </h1>

            <div className="flex items-baseline gap-4 mb-8">
              <p className="font-heading text-2xl text-charcoal/80">{formatMoney(price)}</p>
              {compareAtPrice && parseFloat(compareAtPrice.amount) > parseFloat(price.amount) && (
                <p className="font-body text-sm text-charcoal/30 line-through">{formatMoney(compareAtPrice)}</p>
              )}
            </div>

            <div className="w-12 h-px bg-charcoal/10 mb-8" />

            <div
              className="font-body text-sm font-light text-charcoal/60 leading-relaxed mb-10"
              dangerouslySetInnerHTML={{ __html: product.descriptionHtml || product.description || '' }}
            />

            {/* Variant selector */}
            {hasVariantOptions && (
              <div className="mb-8">
                <p className="font-body text-xs uppercase tracking-[0.15em] text-charcoal/30 mb-3">Options</p>
                <div className="flex flex-wrap gap-2">
                  {variants.map((v) => (
                    <button
                      key={v.id}
                      onClick={() => setSelectedVariantId(v.id)}
                      disabled={!v.availableForSale}
                      data-testid={`variant-${v.id}`}
                      className={`px-5 py-2.5 font-body text-xs uppercase tracking-[0.12em] border transition-all duration-300 ${
                        selectedVariantId === v.id
                          ? 'bg-charcoal text-stone-white border-charcoal'
                          : v.availableForSale
                          ? 'border-charcoal/15 text-charcoal hover:border-charcoal'
                          : 'border-charcoal/10 text-charcoal/30 line-through cursor-not-allowed'
                      }`}
                    >
                      {v.title}
                    </button>
                  ))}
                </div>
              </div>
            )}

            <div className="border-t border-charcoal/5 py-6 mb-8 space-y-4">
              {product.vendor && (
                <div className="flex justify-between">
                  <span className="font-body text-xs uppercase tracking-[0.15em] text-charcoal/30">Créateur</span>
                  <span className="font-body text-sm text-charcoal">{product.vendor}</span>
                </div>
              )}
              {product.productType && (
                <div className="flex justify-between">
                  <span className="font-body text-xs uppercase tracking-[0.15em] text-charcoal/30">Type</span>
                  <span className="font-body text-sm text-charcoal">{product.productType}</span>
                </div>
              )}
              <div className="flex justify-between">
                <span className="font-body text-xs uppercase tracking-[0.15em] text-charcoal/30">Disponibilité</span>
                <span className={`font-body text-sm ${product.availableForSale ? 'text-charcoal' : 'text-terracotta'}`}>
                  {product.availableForSale ? 'En stock' : 'Épuisé'}
                </span>
              </div>
            </div>

            {product.availableForSale && selectedVariant?.availableForSale ? (
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
                    <span className="px-6 font-body text-sm text-charcoal" data-testid="quantity-value">{quantity}</span>
                    <button
                      onClick={() => setQuantity(Math.min(maxQty, quantity + 1))}
                      data-testid="quantity-increase"
                      className="p-3 hover:bg-pale-sand transition-colors duration-300"
                    >
                      <Plus size={14} />
                    </button>
                  </div>
                </div>

                <button
                  onClick={handleAddToCart}
                  disabled={adding || !selectedVariantId}
                  data-testid="add-to-cart-btn"
                  className="w-full btn-primary py-5 flex items-center justify-center gap-3"
                >
                  {adding ? 'Ajout en cours...' : 'Ajouter au Panier'}
                </button>
              </div>
            ) : (
              <button disabled className="w-full bg-pale-sand text-charcoal/30 px-10 py-5 uppercase tracking-[0.15em] text-xs cursor-not-allowed">
                Épuisé
              </button>
            )}

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

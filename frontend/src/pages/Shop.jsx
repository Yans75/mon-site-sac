import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import ProductCard from '../components/ProductCard';
import SEO from '../components/SEO';
import Breadcrumb from '../components/Breadcrumb';
import { getProducts } from '../lib/shopify';

const Shop = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all');
  const [productTypes, setProductTypes] = useState([]);

  useEffect(() => {
    const fetchProducts = async () => {
      setLoading(true);
      try {
        const query = filter === 'all' ? null : `product_type:${filter}`;
        const { products: data } = await getProducts({ first: 50, query });
        setProducts(data);

        // Build product type list on first load (when 'all')
        if (filter === 'all') {
          const types = Array.from(
            new Set(data.map((p) => p.productType).filter(Boolean))
          );
          setProductTypes(types);
        }
      } catch (error) {
        console.error('Error fetching products:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchProducts();
  }, [filter]);

  const categories = [
    { value: 'all', label: 'Toutes les Pièces' },
    ...productTypes.map((t) => ({ value: t, label: t })),
  ];

  return (
    <div className="pt-24 lg:pt-28">
      <SEO
        title="Boutique — Sacs Artisanaux"
        description="Explorez notre collection de sacs à main faits main en polyester et fil de yarn. Sacs crochet uniques, cabas, pochettes et bandoulières artisanales."
      />

      <section className="py-16 md:py-24 bg-pale-sand">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <Breadcrumb items={[{ label: 'Accueil', to: '/' }, { label: 'Boutique' }]} />
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
            <p className="font-body text-xs uppercase tracking-[0.25em] text-charcoal/30 mb-4">Collection</p>
            <h1 className="font-heading text-5xl md:text-6xl lg:text-7xl text-charcoal tracking-tighter leading-none mb-6">
              La Collection
            </h1>
            <p className="font-body text-sm font-light text-charcoal/50 max-w-lg leading-relaxed">
              Chaque pièce est confectionnée à la main en quantité limitée. Une fois épuisées, elles ne reviendront pas.
            </p>
          </motion.div>
        </div>
      </section>

      <section className="py-16 md:py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {categories.length > 1 && (
            <div className="mb-16 overflow-x-auto pb-2 -mx-4 px-4">
              <div className="flex gap-1 min-w-max">
                {categories.map((cat) => (
                  <button
                    key={cat.value}
                    onClick={() => setFilter(cat.value)}
                    data-testid={`filter-${cat.value}`}
                    className={`px-6 py-2.5 font-body text-xs uppercase tracking-[0.12em] transition-all duration-500 ${
                      filter === cat.value ? 'bg-charcoal text-stone-white' : 'text-charcoal/40 hover:text-charcoal'
                    }`}
                  >
                    {cat.label}
                  </button>
                ))}
              </div>
            </div>
          )}

          {loading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-8 gap-y-14">
              {[...Array(6)].map((_, i) => (
                <div key={i} className="animate-pulse">
                  <div className="aspect-[3/4] bg-pale-sand mb-5" />
                  <div className="h-5 bg-pale-sand w-3/4 mb-2" />
                  <div className="h-4 bg-pale-sand w-1/4" />
                </div>
              ))}
            </div>
          ) : products.length === 0 ? (
            <div className="text-center py-24">
              <p className="font-body text-sm text-charcoal/30">
                Aucun produit disponible pour le moment. Revenez bientôt !
              </p>
            </div>
          ) : (
            <motion.div layout className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-8 gap-y-14">
              {products.map((product, index) => (
                <ProductCard key={product.id} product={product} index={index} />
              ))}
            </motion.div>
          )}
        </div>
      </section>

      <section className="py-16 md:py-20 bg-charcoal text-stone-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-3 gap-12 md:gap-8">
            {[
              { title: 'Livraison Gratuite', desc: 'Pour toute commande de plus de 200€' },
              { title: 'Fait Main', desc: 'Plus de 40 heures de savoir-faire' },
              { title: 'Certificat', desc: "D'authenticité inclus" },
            ].map((item, i) => (
              <div key={i} className="text-center">
                <h3 className="font-heading text-2xl text-stone-white mb-2 tracking-tight">{item.title}</h3>
                <p className="font-body text-xs text-stone-white/30 uppercase tracking-[0.15em]">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
};

export default Shop;

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import axios from 'axios';
import ProductCard from '../components/ProductCard';

const API = `${process.env.REACT_APP_BACKEND_URL}/api`;

const Shop = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all');

  const categories = [
    { value: 'all', label: 'Toutes les Pièces' },
    { value: 'tote', label: 'Cabas' },
    { value: 'clutch', label: 'Pochettes' },
    { value: 'shoulder', label: 'Sacs à Épaule' },
    { value: 'crossbody', label: 'Bandoulières' },
    { value: 'mini', label: 'Mini Sacs' },
    { value: 'weekender', label: 'Week-end' },
  ];

  useEffect(() => {
    const fetchProducts = async () => {
      setLoading(true);
      try {
        const url = filter === 'all' 
          ? `${API}/products` 
          : `${API}/products?category=${filter}`;
        const response = await axios.get(url);
        setProducts(response.data);
      } catch (error) {
        console.error('Error fetching products:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchProducts();
  }, [filter]);

  return (
    <div className="pt-24 pb-16">
      {/* Hero */}
      <section className="py-16 bg-pale-sand">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="max-w-2xl"
          >
            <h1 className="font-heading text-5xl md:text-6xl text-charcoal mb-4">
              La Collection
            </h1>
            <p className="font-body text-lg text-charcoal/70">
              Chaque pièce est confectionnée à la main en quantité limitée. Une fois épuisées, elles ne reviendront pas.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Filters & Products */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          {/* Filter Tabs */}
          <div className="mb-12 overflow-x-auto pb-2">
            <div className="flex gap-2 min-w-max">
              {categories.map((cat) => (
                <button
                  key={cat.value}
                  onClick={() => setFilter(cat.value)}
                  data-testid={`filter-${cat.value}`}
                  className={`px-6 py-2 rounded-full font-body text-sm transition-colors duration-300 ${
                    filter === cat.value
                      ? 'bg-charcoal text-stone-white'
                      : 'bg-pale-sand text-charcoal hover:bg-charcoal/10'
                  }`}
                >
                  {cat.label}
                </button>
              ))}
            </div>
          </div>

          {/* Products Grid */}
          {loading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 lg:gap-12">
              {[...Array(6)].map((_, i) => (
                <div key={i} className="animate-pulse">
                  <div className="aspect-[3/4] bg-pale-sand mb-4" />
                  <div className="h-6 bg-pale-sand w-3/4 mb-2" />
                  <div className="h-4 bg-pale-sand w-1/4" />
                </div>
              ))}
            </div>
          ) : products.length === 0 ? (
            <div className="text-center py-20">
              <p className="font-body text-charcoal/60">
                Aucun produit trouvé dans cette catégorie.
              </p>
            </div>
          ) : (
            <motion.div 
              layout
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 lg:gap-12"
            >
              {products.map((product, index) => (
                <ProductCard key={product.product_id} product={product} index={index} />
              ))}
            </motion.div>
          )}
        </div>
      </section>

      {/* Info Banner */}
      <section className="py-12 bg-pale-sand">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="grid md:grid-cols-3 gap-8 text-center">
            <div>
              <h3 className="font-heading text-2xl text-charcoal mb-2">Livraison Gratuite</h3>
              <p className="font-body text-sm text-charcoal/60">Pour toute commande de plus de 200€</p>
            </div>
            <div>
              <h3 className="font-heading text-2xl text-charcoal mb-2">Fait Main</h3>
              <p className="font-body text-sm text-charcoal/60">Plus de 40 heures de savoir-faire</p>
            </div>
            <div>
              <h3 className="font-heading text-2xl text-charcoal mb-2">Certificat</h3>
              <p className="font-body text-sm text-charcoal/60">D'authenticité inclus</p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Shop;

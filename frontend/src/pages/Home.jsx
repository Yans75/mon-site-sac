import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowRight, Sparkles } from 'lucide-react';
import axios from 'axios';
import ProductCard from '../components/ProductCard';

const API = `${process.env.REACT_APP_BACKEND_URL}/api`;

const Home = () => {
  const [featuredProducts, setFeaturedProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        // Seed data first
        await axios.post(`${API}/seed`).catch(() => {});
        const response = await axios.get(`${API}/products?featured=true`);
        setFeaturedProducts(response.data.slice(0, 4));
      } catch (error) {
        console.error('Error fetching products:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchProducts();
  }, []);

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative h-screen flex items-center">
        <div className="absolute inset-0 z-0">
          <img
            src="https://images.unsplash.com/photo-1722510825571-8cdd1fe98ba4?crop=entropy&cs=srgb&fm=jpg&q=85"
            alt="Sac à main artisanal"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-stone-white/80 via-stone-white/40 to-transparent" />
        </div>

        <div className="relative z-10 max-w-7xl mx-auto px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="max-w-xl"
          >
            <span className="font-accent text-2xl text-terracotta mb-4 block">
              Confectionné avec amour
            </span>
            <h1 className="font-heading text-5xl md:text-7xl text-charcoal leading-[1.1] mb-6">
              Tissé avec
              <br />
              <span className="italic">intention</span>
            </h1>
            <p className="font-body text-lg text-charcoal/70 mb-8 leading-relaxed">
              Chaque sac ArtemCreations est une œuvre d'amour — tissé à la main à partir de fils 
              premium, façonné au fil des jours, conçu pour durer toute une vie.
            </p>
            <div className="flex flex-wrap gap-4">
              <Link 
                to="/shop" 
                data-testid="hero-shop-btn"
                className="btn-primary inline-flex items-center gap-2"
              >
                Découvrir la Collection
                <ArrowRight size={16} />
              </Link>
              <Link 
                to="/craftsmanship" 
                data-testid="hero-craftsmanship-btn"
                className="btn-secondary"
              >
                Notre Savoir-Faire
              </Link>
            </div>
          </motion.div>
        </div>

        {/* Scroll indicator */}
        <motion.div
          animate={{ y: [0, 10, 0] }}
          transition={{ repeat: Infinity, duration: 2 }}
          className="absolute bottom-8 left-1/2 -translate-x-1/2 text-charcoal/40"
        >
          <div className="w-6 h-10 border-2 border-charcoal/30 rounded-full flex items-start justify-center p-2">
            <motion.div
              animate={{ y: [0, 12, 0] }}
              transition={{ repeat: Infinity, duration: 1.5 }}
              className="w-1 h-2 bg-charcoal/40 rounded-full"
            />
          </div>
        </motion.div>
      </section>

      {/* Philosophy Section */}
      <section className="py-24 bg-pale-sand">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="max-w-3xl mx-auto text-center"
          >
            <Sparkles className="w-8 h-8 text-terracotta mx-auto mb-6" />
            <h2 className="font-heading text-4xl md:text-5xl text-charcoal mb-6">
              Mode lente,
              <br />
              beauté intemporelle
            </h2>
            <p className="font-body text-lg text-charcoal/70 leading-relaxed">
              Dans un monde de fast fashion, nous avons choisi une autre voie. Chaque sac commence 
              comme un simple fil et se transforme, au fil des heures de travail patient, en quelque 
              chose d'unique — quelque chose qui porte la chaleur du toucher humain et l'histoire 
              de son créateur.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Featured Products */}
      <section className="py-24">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-4">
            <div>
              <motion.h2
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                className="font-heading text-4xl md:text-5xl text-charcoal"
              >
                Pièces en Vedette
              </motion.h2>
              <p className="font-body text-charcoal/60 mt-2">
                Chacune limitée à un nombre restreint d'exemplaires
              </p>
            </div>
            <Link 
              to="/shop" 
              data-testid="view-all-btn"
              className="font-body text-sm text-charcoal/70 hover:text-terracotta transition-colors inline-flex items-center gap-2 group"
            >
              Voir Tout
              <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>

          {loading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
              {[...Array(4)].map((_, i) => (
                <div key={i} className="animate-pulse">
                  <div className="aspect-[3/4] bg-pale-sand mb-4" />
                  <div className="h-6 bg-pale-sand w-3/4 mb-2" />
                  <div className="h-4 bg-pale-sand w-1/4" />
                </div>
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
              {featuredProducts.map((product, index) => (
                <ProductCard key={product.product_id} product={product} index={index} />
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Craftsmanship Teaser */}
      <section className="py-24 bg-charcoal text-stone-white">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-12 lg:gap-20 items-center">
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
            >
              <span className="font-accent text-xl text-terracotta mb-4 block">
                L'art de créer
              </span>
              <h2 className="font-heading text-4xl md:text-5xl mb-6">
                Plus de 40 heures de
                <br />
                <span className="italic">dévouement</span>
              </h2>
              <p className="font-body text-stone-white/70 leading-relaxed mb-8">
                Chaque point raconte une histoire. Nos artisans apportent des décennies d'expérience 
                et un profond respect des techniques traditionnelles, garantissant que chaque sac 
                n'est pas qu'un accessoire, mais une œuvre d'art à porter.
              </p>
              <Link 
                to="/craftsmanship"
                data-testid="craftsmanship-cta-btn"
                className="inline-flex items-center gap-2 text-stone-white border border-stone-white/30 px-8 py-3 rounded-full uppercase tracking-widest text-xs hover:bg-stone-white hover:text-charcoal transition-colors duration-300"
              >
                Découvrir Notre Savoir-Faire
                <ArrowRight size={14} />
              </Link>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="relative"
            >
              <div className="aspect-square overflow-hidden">
                <img
                  src="https://images.unsplash.com/photo-1647032713597-1dcfaa15b725?crop=entropy&cs=srgb&fm=jpg&q=85"
                  alt="Artisan au travail"
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="absolute -bottom-6 -left-6 bg-terracotta text-stone-white p-6">
                <p className="font-heading text-4xl">40+</p>
                <p className="font-body text-xs uppercase tracking-widest">Heures par sac</p>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24">
        <div className="max-w-7xl mx-auto px-6 lg:px-8 text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <h2 className="font-heading text-4xl md:text-5xl text-charcoal mb-6">
              Prête à posséder quelque chose
              <br />
              <span className="italic">d'extraordinaire ?</span>
            </h2>
            <p className="font-body text-charcoal/60 mb-8 max-w-xl mx-auto">
              Rejoignez les rares qui apprécient le véritable artisanat. 
              Chaque sac est accompagné d'un certificat d'authenticité.
            </p>
            <Link 
              to="/shop" 
              data-testid="cta-shop-btn"
              className="btn-primary inline-flex items-center gap-2"
            >
              Acheter Maintenant
              <ArrowRight size={16} />
            </Link>
          </motion.div>
        </div>
      </section>
    </div>
  );
};

export default Home;

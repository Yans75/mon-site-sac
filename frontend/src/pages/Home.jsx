import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowRight, Sparkles, ShoppingBag } from 'lucide-react';
import axios from 'axios';
import ProductCard from '../components/ProductCard';

const API = `${process.env.REACT_APP_BACKEND_URL}/api`;

// Vos photos de sacs
const heroImages = [
  'https://customer-assets.emergentagent.com/job_d7b409fe-d52a-4d1e-9549-c6ad2262ad16/artifacts/yipqljae_image.png',
  'https://customer-assets.emergentagent.com/job_d7b409fe-d52a-4d1e-9549-c6ad2262ad16/artifacts/f3dygm93_image.png',
  'https://customer-assets.emergentagent.com/job_d7b409fe-d52a-4d1e-9549-c6ad2262ad16/artifacts/x4ci01bv_image.png',
  'https://customer-assets.emergentagent.com/job_d7b409fe-d52a-4d1e-9549-c6ad2262ad16/artifacts/rv18hqet_image.png',
  'https://customer-assets.emergentagent.com/job_d7b409fe-d52a-4d1e-9549-c6ad2262ad16/artifacts/xfna0mnj_image.png',
];

const Home = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        await axios.post(`${API}/seed`).catch(() => {});
        const response = await axios.get(`${API}/products`);
        setProducts(response.data);
      } catch (error) {
        console.error('Error fetching products:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchProducts();
  }, []);

  // Auto-rotate hero images
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentImageIndex((prev) => (prev + 1) % heroImages.length);
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="min-h-screen">
      {/* Hero Section with your bags */}
      <section className="relative min-h-screen flex items-center overflow-hidden">
        {/* Background Images Slider */}
        <div className="absolute inset-0 z-0">
          {heroImages.map((img, index) => (
            <motion.div
              key={index}
              className="absolute inset-0"
              initial={{ opacity: 0 }}
              animate={{ opacity: index === currentImageIndex ? 1 : 0 }}
              transition={{ duration: 1.5 }}
            >
              <img
                src={img}
                alt="Sac ArtemCreations"
                className="w-full h-full object-cover"
              />
            </motion.div>
          ))}
          <div className="absolute inset-0 bg-gradient-to-r from-charcoal/90 via-charcoal/70 to-charcoal/40" />
        </div>

        {/* Hero Content */}
        <div className="relative z-10 max-w-7xl mx-auto px-6 lg:px-8 py-32">
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="max-w-2xl"
          >
            <span className="font-accent text-3xl text-terracotta mb-4 block">
              Artem Créations
            </span>
            <h1 className="font-heading text-5xl md:text-7xl text-stone-white leading-[1.1] mb-6">
              Sacs artisanaux
              <br />
              <span className="italic">faits avec amour</span>
            </h1>
            <p className="font-body text-lg text-stone-white/80 mb-8 leading-relaxed">
              Chaque création est unique, confectionnée à la main avec des fils de qualité premium. 
              Des pièces d'exception qui allient élégance et savoir-faire artisanal.
            </p>
            <div className="flex flex-wrap gap-4">
              <a 
                href="#collection" 
                data-testid="hero-shop-btn"
                className="bg-terracotta text-stone-white px-8 py-4 rounded-full uppercase tracking-widest text-xs font-medium inline-flex items-center gap-2 hover:bg-terracotta/90 transition-colors"
              >
                <ShoppingBag size={16} />
                Voir la Collection
              </a>
              <Link 
                to="/craftsmanship" 
                data-testid="hero-craftsmanship-btn"
                className="border border-stone-white/30 text-stone-white px-8 py-4 rounded-full uppercase tracking-widest text-xs font-medium hover:bg-stone-white hover:text-charcoal transition-colors"
              >
                Notre Savoir-Faire
              </Link>
            </div>
          </motion.div>
        </div>

        {/* Image indicators */}
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 z-10 flex gap-2">
          {heroImages.map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrentImageIndex(index)}
              className={`w-2 h-2 rounded-full transition-all ${
                index === currentImageIndex 
                  ? 'bg-terracotta w-8' 
                  : 'bg-stone-white/50 hover:bg-stone-white'
              }`}
            />
          ))}
        </div>
      </section>

      {/* Quick Info Bar */}
      <section className="bg-charcoal text-stone-white py-6">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="flex flex-wrap justify-center gap-8 md:gap-16 text-center">
            <div>
              <p className="font-heading text-2xl">100%</p>
              <p className="font-body text-xs uppercase tracking-wider text-stone-white/60">Fait Main</p>
            </div>
            <div>
              <p className="font-heading text-2xl">Premium</p>
              <p className="font-body text-xs uppercase tracking-wider text-stone-white/60">Matériaux</p>
            </div>
            <div>
              <p className="font-heading text-2xl">Unique</p>
              <p className="font-body text-xs uppercase tracking-wider text-stone-white/60">Chaque Pièce</p>
            </div>
            <div>
              <p className="font-heading text-2xl">France</p>
              <p className="font-body text-xs uppercase tracking-wider text-stone-white/60">Confectionné</p>
            </div>
          </div>
        </div>
      </section>

      {/* Collection Section */}
      <section id="collection" className="py-20 bg-stone-white">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <Sparkles className="w-8 h-8 text-terracotta mx-auto mb-4" />
            <h2 className="font-heading text-4xl md:text-5xl text-charcoal mb-4">
              Notre Collection
            </h2>
            <p className="font-body text-charcoal/60 max-w-2xl mx-auto">
              Découvrez nos créations uniques, confectionnées avec passion. 
              Chaque sac est une pièce d'exception, fait pour durer.
            </p>
          </motion.div>

          {/* Products Grid */}
          {loading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 lg:gap-12">
              {[...Array(6)].map((_, i) => (
                <div key={i} className="animate-pulse">
                  <div className="aspect-square bg-pale-sand mb-4 rounded-lg" />
                  <div className="h-6 bg-pale-sand w-3/4 mb-2 rounded" />
                  <div className="h-4 bg-pale-sand w-1/4 rounded" />
                </div>
              ))}
            </div>
          ) : products.length === 0 ? (
            <div className="text-center py-20">
              <ShoppingBag size={48} className="text-charcoal/20 mx-auto mb-4" />
              <p className="font-body text-charcoal/60">
                La collection arrive bientôt...
              </p>
            </div>
          ) : (
            <motion.div 
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 lg:gap-12"
            >
              {products.map((product, index) => (
                <ProductCard key={product.product_id} product={product} index={index} />
              ))}
            </motion.div>
          )}
        </div>
      </section>

      {/* About Section */}
      <section className="py-20 bg-pale-sand">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-12 lg:gap-20 items-center">
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="relative"
            >
              <div className="grid grid-cols-2 gap-4">
                <div className="aspect-[3/4] overflow-hidden rounded-lg">
                  <img
                    src={heroImages[0]}
                    alt="Sac Artem"
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="aspect-[3/4] overflow-hidden rounded-lg mt-8">
                  <img
                    src={heroImages[2]}
                    alt="Sac Artem"
                    className="w-full h-full object-cover"
                  />
                </div>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
            >
              <span className="font-accent text-2xl text-terracotta mb-4 block">
                Notre Histoire
              </span>
              <h2 className="font-heading text-4xl md:text-5xl text-charcoal mb-6">
                L'art du fait main
              </h2>
              <p className="font-body text-charcoal/70 leading-relaxed mb-6">
                Artem Créations est née d'une passion pour l'artisanat et le crochet. 
                Chaque sac est confectionné avec amour, point par point, pour créer 
                des pièces uniques qui vous accompagneront pendant des années.
              </p>
              <p className="font-body text-charcoal/70 leading-relaxed mb-8">
                Nous utilisons uniquement des fils de qualité premium pour garantir 
                la durabilité et la beauté de nos créations.
              </p>
              <Link 
                to="/about"
                className="inline-flex items-center gap-2 text-terracotta hover:gap-4 transition-all font-body"
              >
                En savoir plus
                <ArrowRight size={16} />
              </Link>
            </motion.div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-charcoal text-stone-white">
        <div className="max-w-4xl mx-auto px-6 lg:px-8 text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <h2 className="font-heading text-4xl md:text-5xl mb-6">
              Envie d'une création
              <br />
              <span className="italic">sur mesure ?</span>
            </h2>
            <p className="font-body text-stone-white/70 mb-8 max-w-xl mx-auto">
              Contactez-nous pour discuter de votre projet. Nous pouvons créer 
              le sac de vos rêves, dans la couleur et le style de votre choix.
            </p>
            <Link 
              to="/contact" 
              className="bg-terracotta text-stone-white px-8 py-4 rounded-full uppercase tracking-widest text-xs font-medium inline-flex items-center gap-2 hover:bg-terracotta/90 transition-colors"
            >
              Nous Contacter
              <ArrowRight size={16} />
            </Link>
          </motion.div>
        </div>
      </section>
    </div>
  );
};

export default Home;

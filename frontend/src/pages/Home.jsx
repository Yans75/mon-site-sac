import { useState, useEffect, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowRight, ShoppingBag, ChevronLeft, ChevronRight } from 'lucide-react';
import axios from 'axios';
import ProductCard from '../components/ProductCard';
import SEO from '../components/SEO';

const API = `${process.env.REACT_APP_BACKEND_URL}/api`;

const heroSlides = [
  {
    image: 'https://customer-assets.emergentagent.com/job_ddcf7dd4-0bde-46cb-bf20-9dbb3d1819e4/artifacts/3oaokz1a_1000098153.png',
    title: 'Élégance Bordeaux',
    subtitle: 'Sac à chaîne avec pompon',
  },
  {
    image: 'https://customer-assets.emergentagent.com/job_ddcf7dd4-0bde-46cb-bf20-9dbb3d1819e4/artifacts/918sdgn7_1000100108.png',
    title: 'Rose Éternelle',
    subtitle: 'Sac rond avec anses en bois',
  },
  {
    image: 'https://customer-assets.emergentagent.com/job_ddcf7dd4-0bde-46cb-bf20-9dbb3d1819e4/artifacts/j7cik9hb_1000105625.png',
    title: 'Douceur Rosée',
    subtitle: 'Cabas avec bandoulière',
  },
  {
    image: 'https://customer-assets.emergentagent.com/job_ddcf7dd4-0bde-46cb-bf20-9dbb3d1819e4/artifacts/r37vdetx_1000105865.png',
    title: 'Noeud Fuchsia',
    subtitle: 'Pochette à chaîne argentée',
  },
  {
    image: 'https://customer-assets.emergentagent.com/job_ddcf7dd4-0bde-46cb-bf20-9dbb3d1819e4/artifacts/8yb2vpsk_1000106088.png',
    title: 'Caramel Doré',
    subtitle: 'Sac rond avec fermoir doré',
  },
];

const heroImages = heroSlides.map(s => s.image);

const Home = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);

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

  const goToSlide = useCallback((index) => {
    setCurrentImageIndex(index);
  }, []);

  const nextSlide = useCallback(() => {
    setCurrentImageIndex((prev) => (prev + 1) % heroSlides.length);
  }, []);

  const prevSlide = useCallback(() => {
    setCurrentImageIndex((prev) => (prev - 1 + heroSlides.length) % heroSlides.length);
  }, []);

  useEffect(() => {
    if (isPaused) return;
    const interval = setInterval(() => {
      setCurrentImageIndex((prev) => (prev + 1) % heroSlides.length);
    }, 5000);
    return () => clearInterval(interval);
  }, [isPaused]);

  const featuredProducts = products.slice(0, 6);

  return (
    <div className="min-h-screen">
      <SEO
        title="Sacs à Main Faits Main"
        description="Découvrez nos sacs artisanaux en polyester haut de gamme et fil de yarn. Pièces uniques faites main avec passion. Livraison offerte dès 200€."
      />
      {/* ===== HERO SECTION ===== */}
      <section 
        className="relative min-h-screen flex items-end overflow-hidden"
        onMouseEnter={() => setIsPaused(true)}
        onMouseLeave={() => setIsPaused(false)}
        data-testid="hero-section"
      >
        {/* Fullscreen Background */}
        <div className="absolute inset-0 z-0">
          {heroSlides.map((slide, index) => (
            <motion.div
              key={index}
              className="absolute inset-0"
              initial={{ opacity: 0, scale: 1.08 }}
              animate={{ 
                opacity: index === currentImageIndex ? 1 : 0,
                scale: index === currentImageIndex ? 1 : 1.08,
              }}
              transition={{ duration: 1.8, ease: 'easeOut' }}
            >
              <img src={slide.image} alt={slide.title} className="w-full h-full object-cover" />
            </motion.div>
          ))}
          <div className="absolute inset-0 bg-gradient-to-r from-charcoal/80 via-charcoal/40 to-transparent" />
          <div className="absolute inset-0 bg-gradient-to-t from-charcoal/60 via-transparent to-charcoal/20" />
        </div>

        {/* Content */}
        <div className="relative z-10 w-full px-4 sm:px-6 lg:px-16 pb-16 md:pb-24 pt-40">
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="max-w-2xl"
          >
            <span className="font-accent text-2xl md:text-3xl text-terracotta mb-3 block">
              Artem Créations
            </span>
            <h1 className="font-heading text-5xl md:text-6xl lg:text-[5.5rem] text-stone-white leading-none mb-6 tracking-tighter">
              Sacs artisanaux
              <br />
              <span className="italic">faits avec amour</span>
            </h1>

            <AnimatePresence mode="wait">
              <motion.div
                key={currentImageIndex}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -8 }}
                transition={{ duration: 0.4 }}
                className="mb-8"
              >
                <p className="font-heading text-xl text-terracotta">
                  {heroSlides[currentImageIndex].title}
                </p>
                <p className="font-body text-xs text-stone-white/40 uppercase tracking-[0.2em] mt-1">
                  {heroSlides[currentImageIndex].subtitle}
                </p>
              </motion.div>
            </AnimatePresence>

            <div className="flex flex-wrap gap-4">
              <a 
                href="#collection" 
                data-testid="hero-shop-btn"
                className="bg-stone-white text-charcoal px-10 py-4 uppercase tracking-[0.15em] text-xs font-medium inline-flex items-center gap-3 hover:bg-terracotta hover:text-stone-white transition-colors duration-500"
              >
                <ShoppingBag size={14} strokeWidth={1.5} />
                Voir la Collection
              </a>
              <Link 
                to="/craftsmanship" 
                data-testid="hero-craftsmanship-btn"
                className="border border-stone-white/30 text-stone-white px-10 py-4 uppercase tracking-[0.15em] text-xs font-medium hover:bg-stone-white hover:text-charcoal transition-all duration-500"
              >
                Notre Savoir-Faire
              </Link>
            </div>

            {/* Navigation */}
            <div className="flex items-center gap-4 mt-14">
              <button 
                onClick={prevSlide} 
                data-testid="hero-prev-btn"
                className="w-10 h-10 border border-stone-white/15 flex items-center justify-center text-stone-white/40 hover:text-stone-white hover:border-stone-white/40 transition-all duration-500"
              >
                <ChevronLeft size={16} />
              </button>
              <div className="flex gap-2">
                {heroSlides.map((_, index) => (
                  <button
                    key={index}
                    onClick={() => goToSlide(index)}
                    data-testid={`hero-dot-${index}`}
                    className={`h-[2px] transition-all duration-700 ${
                      index === currentImageIndex 
                        ? 'bg-stone-white w-10' 
                        : 'bg-stone-white/20 w-5 hover:bg-stone-white/40'
                    }`}
                  />
                ))}
              </div>
              <button 
                onClick={nextSlide} 
                data-testid="hero-next-btn"
                className="w-10 h-10 border border-stone-white/15 flex items-center justify-center text-stone-white/40 hover:text-stone-white hover:border-stone-white/40 transition-all duration-500"
              >
                <ChevronRight size={16} />
              </button>
              <span className="font-body text-stone-white/20 text-xs ml-3 tracking-widest">
                {String(currentImageIndex + 1).padStart(2, '0')} / {String(heroSlides.length).padStart(2, '0')}
              </span>
            </div>
          </motion.div>
        </div>
      </section>

      {/* ===== MARQUEE / INFO BAR ===== */}
      <section className="bg-charcoal text-stone-white py-8 md:py-10 border-b border-stone-white/5">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-wrap justify-between gap-8 md:gap-0">
            {[
              { value: '100%', label: 'Fait Main' },
              { value: 'Premium', label: 'Matériaux' },
              { value: 'Unique', label: 'Chaque Pièce' },
              { value: 'France', label: 'Confectionné' },
            ].map((stat, i) => (
              <div key={i} className="text-center flex-1 min-w-[120px]">
                <p className="font-heading text-2xl md:text-3xl text-stone-white tracking-tight">{stat.value}</p>
                <p className="font-body text-[10px] uppercase tracking-[0.25em] text-stone-white/30 mt-1">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ===== COLLECTION SECTION ===== */}
      <section id="collection" className="py-24 md:py-32 bg-stone-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="mb-20"
          >
            <p className="font-body text-xs uppercase tracking-[0.25em] text-charcoal/30 mb-4">Collection</p>
            <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-6">
              <h2 className="font-heading text-4xl md:text-5xl text-charcoal tracking-tight">
                Nos Créations
              </h2>
              <Link 
                to="/shop" 
                data-testid="view-all-collection"
                className="font-body text-xs uppercase tracking-[0.15em] text-charcoal/50 hover:text-terracotta transition-colors duration-500 inline-flex items-center gap-2 group"
              >
                Voir tout
                <ArrowRight size={12} className="group-hover:translate-x-1 transition-transform duration-300" />
              </Link>
            </div>
            <div className="w-12 h-px bg-terracotta mt-6" />
          </motion.div>

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
          ) : featuredProducts.length === 0 ? (
            <div className="text-center py-20">
              <ShoppingBag size={48} className="text-charcoal/10 mx-auto mb-4" />
              <p className="font-body text-charcoal/40">La collection arrive bientôt...</p>
            </div>
          ) : (
            <motion.div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-8 gap-y-14">
              {featuredProducts.map((product, index) => (
                <ProductCard key={product.product_id} product={product} index={index} />
              ))}
            </motion.div>
          )}
        </div>
      </section>

      {/* ===== ABOUT / STORY SECTION ===== */}
      <section className="py-24 md:py-32 bg-pale-sand">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-12 lg:gap-24 items-center">
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
              className="relative"
            >
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-3">
                  <div className="aspect-square overflow-hidden">
                    <img
                      src={heroImages[0]}
                      alt="Sac Artem Bordeaux"
                      className="w-full h-full object-cover transition-transform duration-700 hover:scale-[1.03]"
                    />
                  </div>
                  <div className="aspect-[4/3] overflow-hidden">
                    <img
                      src={heroImages[3]}
                      alt="Sac Artem Fuchsia"
                      className="w-full h-full object-cover transition-transform duration-700 hover:scale-[1.03]"
                    />
                  </div>
                </div>
                <div className="space-y-3 mt-8">
                  <div className="aspect-[4/3] overflow-hidden">
                    <img
                      src={heroImages[1]}
                      alt="Sac Artem Chocolat"
                      className="w-full h-full object-cover transition-transform duration-700 hover:scale-[1.03]"
                    />
                  </div>
                  <div className="aspect-square overflow-hidden">
                    <img
                      src={heroImages[4]}
                      alt="Sac Artem Caramel"
                      className="w-full h-full object-cover transition-transform duration-700 hover:scale-[1.03]"
                    />
                  </div>
                </div>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, delay: 0.1 }}
            >
              <p className="font-body text-xs uppercase tracking-[0.25em] text-charcoal/30 mb-4">Notre Histoire</p>
              <h2 className="font-heading text-4xl md:text-5xl text-charcoal mb-8 tracking-tight">
                L'art du
                <br />
                <span className="italic">fait main</span>
              </h2>
              <p className="font-body text-sm font-light text-charcoal/60 leading-relaxed mb-6">
                Artem Créations est née d'une passion pour l'artisanat et le crochet. 
                Chaque sac est confectionné avec amour, point par point, pour créer 
                des pièces uniques qui vous accompagneront pendant des années.
              </p>
              <p className="font-body text-sm font-light text-charcoal/60 leading-relaxed mb-10">
                Nous utilisons uniquement des fils de qualité premium pour garantir 
                la durabilité et la beauté de nos créations.
              </p>
              <Link 
                to="/about"
                className="font-body text-xs uppercase tracking-[0.15em] text-charcoal inline-flex items-center gap-3 group hover:text-terracotta transition-colors duration-500"
              >
                En savoir plus
                <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform duration-300" />
              </Link>
            </motion.div>
          </div>
        </div>
      </section>

      {/* ===== CTA SECTION ===== */}
      <section className="py-24 md:py-32 bg-charcoal text-stone-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <p className="font-body text-xs uppercase tracking-[0.25em] text-stone-white/30 mb-6">Commande sur mesure</p>
            <h2 className="font-heading text-4xl md:text-5xl lg:text-6xl mb-8 tracking-tight leading-none">
              Envie d'une création
              <br />
              <span className="italic">sur mesure ?</span>
            </h2>
            <p className="font-body text-sm font-light text-stone-white/40 mb-10 max-w-xl mx-auto leading-relaxed">
              Contactez-nous pour discuter de votre projet. Nous pouvons créer 
              le sac de vos rêves, dans la couleur et le style de votre choix.
            </p>
            <Link 
              to="/contact" 
              className="bg-stone-white text-charcoal px-10 py-4 uppercase tracking-[0.15em] text-xs font-medium inline-flex items-center gap-3 hover:bg-terracotta hover:text-stone-white transition-colors duration-500"
            >
              Nous Contacter
              <ArrowRight size={14} />
            </Link>
          </motion.div>
        </div>
      </section>
    </div>
  );
};

export default Home;

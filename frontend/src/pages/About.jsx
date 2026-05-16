import { motion } from 'framer-motion';
import { Heart, Sparkles, Hand, MapPin } from 'lucide-react';
import SEO from '../components/SEO';

const HERO_IMAGE = 'https://images.unsplash.com/photo-1635617045254-f7c84052672c?crop=entropy&cs=srgb&fm=jpg&q=85&w=1200';
const PORTRAIT_IMAGE = 'https://images.unsplash.com/photo-1668072587859-f0f30c8fa938?crop=entropy&cs=srgb&fm=jpg&q=85&w=1200';

const About = () => {
  const values = [
    {
      icon: Hand,
      title: 'Fait à la main',
      description: 'Chaque sac est imaginé, conçu et fabriqué entièrement à la main. Pas de machines, pas de production en série.'
    },
    {
      icon: Sparkles,
      title: 'Pièces uniques',
      description: 'Aucun sac ne ressemble à un autre. Chaque création porte sa propre signature, sa propre histoire.'
    },
    {
      icon: Heart,
      title: 'Matières premium',
      description: 'Fils de yarn et polyester haute gamme, sélectionnés avec soin pour leur tenue, leur douceur et leur beauté.'
    },
    {
      icon: MapPin,
      title: 'Marque française',
      description: 'Une création artisanale indépendante, née en France et portée par la passion d’une seule créatrice.'
    }
  ];

  return (
    <div className="pt-24 lg:pt-28">
      <SEO
        title="Notre Histoire"
        description="Découvrez l'histoire d'Artem Créations, marque artisanale française de sacs faits main par Marlena. Pièces uniques en yarn et polyester premium."
      />

      {/* Hero */}
      <section className="py-20 md:py-28">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-12 lg:gap-24 items-center">
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
            >
              <p className="font-body text-xs uppercase tracking-[0.25em] text-charcoal/30 mb-4">Notre Histoire</p>
              <h1 className="font-heading text-5xl md:text-6xl lg:text-7xl text-charcoal tracking-tighter leading-none mb-8">
                Une bobine de fil,
                <br />
                <span className="italic">une idée simple</span>
              </h1>
              <div className="w-12 h-px bg-terracotta mb-8" />
              <p className="font-body text-sm font-light text-charcoal/60 leading-relaxed max-w-md mb-6">
                Tout a commencé il y a plus de 8 ans, dans un appartement baigné de lumière,
                avec une bobine de fil et une idée simple : créer des sacs qui durent,
                qui racontent quelque chose.
              </p>
              <p className="font-accent text-xl text-terracotta">
                Je m’appelle Marlena.
              </p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="relative"
            >
              <div className="aspect-[4/5] overflow-hidden">
                <img
                  src={HERO_IMAGE}
                  alt="Marlena, fondatrice d'Artem Créations, tricotant un sac à la main"
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="absolute -bottom-6 -left-6 bg-charcoal text-stone-white p-8 hidden lg:block max-w-xs">
                <p className="font-accent text-xl text-terracotta">
                  "Chaque création est unique, comme celle qui la portera."
                </p>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* La Créatrice */}
      <section className="py-24 md:py-32 bg-pale-sand">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-12 lg:gap-24 items-center">
            <motion.div
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
              className="order-2 lg:order-1"
            >
              <div className="aspect-square overflow-hidden">
                <img
                  src={PORTRAIT_IMAGE}
                  alt="Marlena entourée de fils de yarn colorés dans son atelier"
                  className="w-full h-full object-cover"
                />
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
              className="order-1 lg:order-2"
            >
              <p className="font-body text-xs uppercase tracking-[0.25em] text-charcoal/30 mb-4">La Créatrice</p>
              <h2 className="font-heading text-4xl md:text-5xl text-charcoal mb-8 tracking-tight">
                Rencontrez
                <br />
                <span className="italic">Marlena</span>
              </h2>
              <p className="font-body text-sm font-light text-charcoal/60 leading-relaxed mb-6">
                J’ai la trentaine, et depuis toute petite j’ai eu ce besoin de créer avec mes mains.
                Artem Créations est née de cette passion — une marque artisanale française
                où chaque sac est imaginé, conçu et fabriqué par moi, entièrement à la main.
              </p>
              <p className="font-body text-sm font-light text-charcoal/60 leading-relaxed mb-6">
                Pas de production en série, pas de compromis. Seulement des matières premium
                — fils de yarn et polyester haute gamme — sélectionnées avec soin pour leur tenue,
                leur douceur et leur beauté.
              </p>
              <p className="font-body text-sm font-light text-charcoal/60 leading-relaxed mb-8">
                Chaque création est unique, comme celle qui la portera.
              </p>
              <p className="font-accent text-xl text-terracotta">
                — Marlena, Fondatrice & Créatrice
              </p>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Valeurs */}
      <section className="py-24 md:py-32">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="mb-20"
          >
            <p className="font-body text-xs uppercase tracking-[0.25em] text-charcoal/30 mb-4">Nos Valeurs</p>
            <h2 className="font-heading text-4xl md:text-5xl text-charcoal tracking-tight">
              Ce qui nous guide
            </h2>
            <div className="w-12 h-px bg-terracotta mt-6" />
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-12 lg:gap-8">
            {values.map((value, index) => (
              <motion.div
                key={value.title}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1, duration: 0.6 }}
              >
                <value.icon size={28} className="text-terracotta mb-6" strokeWidth={1} />
                <h3 className="font-heading text-xl text-charcoal mb-3">
                  {value.title}
                </h3>
                <p className="font-body text-xs font-light text-charcoal/40 leading-relaxed">
                  {value.description}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Citation */}
      <section className="py-24 md:py-32 bg-charcoal text-stone-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.blockquote
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
          >
            <p className="font-heading text-3xl md:text-4xl lg:text-5xl italic leading-snug mb-10 tracking-tight">
              "Pas de production en série, pas de compromis.
              Juste du fil, des mains, et du temps."
            </p>
            <div className="w-12 h-px bg-stone-white/20 mx-auto mb-6" />
            <cite className="font-body text-[10px] text-stone-white/30 uppercase tracking-[0.3em] not-italic">
              Notre Philosophie
            </cite>
          </motion.blockquote>
        </div>
      </section>
    </div>
  );
};

export default About;

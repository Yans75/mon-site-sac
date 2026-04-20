import { motion } from 'framer-motion';
import { Heart, Leaf, Clock, Sparkles } from 'lucide-react';
import SEO from '../components/SEO';

const About = () => {
  const values = [
    { icon: Heart, title: 'Fait avec Amour', description: "Chaque point porte la chaleur des mains humaines et la passion d'artisans qualifiés." },
    { icon: Leaf, title: 'Matériaux Durables', description: 'Nous sélectionnons des fils biologiques, recyclés et produits de manière éthique.' },
    { icon: Clock, title: 'Mode Lente', description: 'La qualité plutôt que la quantité. Chaque pièce nécessite 20 à 60 heures de travail.' },
    { icon: Sparkles, title: 'Pièces Uniques', description: 'Des éditions limitées garantissent que vous possédez quelque chose de vraiment spécial.' }
  ];

  return (
    <div className="pt-24 lg:pt-28">
      <SEO
        title="Notre Histoire"
        description="Découvrez l'histoire d'Artem Creations, marque artisanale de sacs faits main. Passion, savoir-faire et matériaux nobles au coeur de chaque création."
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
                Née d'un amour pour
                <br />
                <span className="italic">la beauté artisanale</span>
              </h1>
              <div className="w-12 h-px bg-terracotta mb-8" />
              <p className="font-body text-sm font-light text-charcoal/50 leading-relaxed max-w-md">
                ArtemCreations est née dans un petit atelier, avec une seule artisane et une vision : 
                créer des sacs qui racontent des histoires, des sacs qui deviennent plus beaux avec le temps, 
                des sacs qui honorent l'art ancestral du textile.
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
                  src="https://images.unsplash.com/photo-1647032713597-1dcfaa15b725?crop=entropy&cs=srgb&fm=jpg&q=85"
                  alt="Artisan au travail"
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="absolute -bottom-6 -left-6 bg-charcoal text-stone-white p-8 hidden lg:block">
                <p className="font-accent text-xl text-terracotta">
                  "Chaque sac a une âme"
                </p>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* The Artisan */}
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
                  src="https://images.unsplash.com/photo-1737888828619-96e0f50302f4?crop=entropy&cs=srgb&fm=jpg&q=85"
                  alt="L'artisane"
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
                <span className="italic">la Créatrice</span>
              </h2>
              <p className="font-body text-sm font-light text-charcoal/50 leading-relaxed mb-6">
                Avec plus de trois décennies d'expérience dans les arts textiles, notre fondatrice 
                apporte une richesse de connaissances et un engagement indéfectible envers la qualité. 
              </p>
              <p className="font-body text-sm font-light text-charcoal/50 leading-relaxed mb-8">
                Chaque création ArtemCreations passe entre des mains expertes qui ont perfectionné 
                des techniques transmises de génération en génération.
              </p>
              <p className="font-accent text-xl text-terracotta">
                — Elena, Fondatrice & Maître Artisane
              </p>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Values */}
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

      {/* Quote */}
      <section className="py-24 md:py-32 bg-charcoal text-stone-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.blockquote
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
          >
            <p className="font-heading text-3xl md:text-4xl lg:text-5xl italic leading-snug mb-10 tracking-tight">
              "Dans un monde qui va trop vite, nous choisissons de ralentir. 
              De créer avec intention."
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

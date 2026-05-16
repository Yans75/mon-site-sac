import { motion } from 'framer-motion';
import SEO from '../components/SEO';

const Craftsmanship = () => {
  const steps = [
    {
      number: '01',
      title: 'Le choix des matières',
      description: "Tout commence par la sélection des fils : yarn et polyester haute gamme, choisis pour leur résistance, leur rendu visuel et leur toucher. Aucune fibre n'entre dans l'atelier sans avoir été testée.",
      image: 'https://images.unsplash.com/photo-1584992236310-6edddc08acff?crop=entropy&cs=srgb&fm=jpg&q=85&w=1200'
    },
    {
      number: '02',
      title: 'La conception',
      description: "Chaque forme, chaque détail est pensé à la main, sans patron industriel. Une création Artem naît d'une intuition, d'un dessin, d'une couleur — puis se construit point par point.",
      image: 'https://images.unsplash.com/photo-1626784579980-db39c1a13aa9?crop=entropy&cs=srgb&fm=jpg&q=85&w=1200'
    },
    {
      number: '03',
      title: 'Le montage',
      description: "C'est l'étape la plus longue, parfois plusieurs jours de travail patient. Le fil prend vie entre les mains, transformé maille après maille en un sac structuré et fidèle à son dessin initial.",
      image: 'https://images.unsplash.com/photo-1632649027900-389e810204e6?crop=entropy&cs=srgb&fm=jpg&q=85&w=1200'
    },
    {
      number: '04',
      title: 'Les finitions',
      description: "Anses, fermetures, doublures, dernières retouches : chaque étape est réalisée avec soin et précision. Le sac est alors inspecté, signé, et prêt à partir vivre sa vie.",
      image: 'https://images.unsplash.com/photo-1596939082030-301c0d17b5b3?crop=entropy&cs=srgb&fm=jpg&q=85&w=1200'
    }
  ];

  return (
    <div className="pt-24 lg:pt-28">
      <SEO
        title="Savoir-Faire Artisanal"
        description="Le savoir-faire derrière chaque sac Artem : fils yarn et polyester premium, conception sans patron industriel, fabrication entièrement à la main par Marlena."
      />

      {/* Hero */}
      <section className="py-16 md:py-24 bg-pale-sand">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            className="max-w-3xl"
          >
            <p className="font-body text-xs uppercase tracking-[0.25em] text-charcoal/30 mb-4">Savoir-Faire</p>
            <h1 className="font-heading text-5xl md:text-6xl lg:text-7xl text-charcoal tracking-tighter leading-none mb-8">
              Un processus entier,
              <br />
              <span className="italic">du fil au sac fini</span>
            </h1>
            <p className="font-body text-sm font-light text-charcoal/60 leading-relaxed max-w-lg">
              Créer un sac Artem, c'est un processus entier qui peut prendre plusieurs jours.
              Pas de raccourcis, pas de machines. Juste du fil, des mains et du temps.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Stats */}
      <section className="py-16 md:py-20 bg-charcoal text-stone-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row items-center justify-center gap-12 md:gap-20 text-center">
            {[
              { value: 'Plusieurs', label: 'Jours par sac' },
              { value: '100%', label: 'Fait à la main' },
              { value: 'Sans', label: 'Patron industriel' },
            ].map((stat, i) => (
              <div key={i}>
                <p className="font-heading text-4xl md:text-5xl tracking-tight">{stat.value}</p>
                <p className="font-body text-[10px] uppercase tracking-[0.25em] text-stone-white/25 mt-2">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Étapes */}
      <section className="py-24 md:py-32">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="space-y-28 md:space-y-40">
            {steps.map((step, index) => (
              <motion.div
                key={step.number}
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-100px" }}
                transition={{ duration: 0.8 }}
                className="grid lg:grid-cols-2 gap-12 lg:gap-24 items-center"
              >
                <div className={index % 2 === 1 ? 'lg:order-2' : ''}>
                  <div className="aspect-[4/3] overflow-hidden group">
                    <img
                      src={step.image}
                      alt={`Étape ${step.number} — ${step.title}`}
                      className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-[1.04]"
                    />
                  </div>
                </div>

                <div className={index % 2 === 1 ? 'lg:order-1' : ''}>
                  <span className="font-heading text-[7rem] md:text-[9rem] text-pale-sand leading-none block">
                    {step.number}
                  </span>
                  <h2 className="font-heading text-3xl md:text-4xl text-charcoal -mt-12 mb-5 relative z-10 tracking-tight">
                    {step.title}
                  </h2>
                  <p className="font-body text-sm font-light text-charcoal/60 leading-relaxed max-w-md">
                    {step.description}
                  </p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Matières */}
      <section className="py-24 md:py-32 bg-pale-sand">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="mb-20"
          >
            <p className="font-body text-xs uppercase tracking-[0.25em] text-charcoal/30 mb-4">Matières</p>
            <h2 className="font-heading text-4xl md:text-5xl text-charcoal tracking-tight">
              Nos Matières
            </h2>
            <div className="w-12 h-px bg-terracotta mt-6" />
          </motion.div>

          <div className="grid md:grid-cols-2 gap-8">
            {[
              {
                name: 'Fil de Yarn premium',
                description: "Un fil souple, dense et résistant, choisi pour sa tenue dans le temps et la richesse de ses coloris. Il offre aux sacs leur structure et leur main caractéristique."
              },
              {
                name: 'Polyester haute gamme',
                description: "Un polyester d'exception, doux au toucher mais résistant à l'usure. Sa brillance subtile sublime les couleurs et garantit la durabilité de chaque création."
              }
            ].map((material, index) => (
              <motion.div
                key={material.name}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1, duration: 0.6 }}
                className="bg-stone-white p-10 border border-transparent hover:border-charcoal/5 transition-colors duration-500"
              >
                <h3 className="font-heading text-2xl text-charcoal mb-4 tracking-tight">
                  {material.name}
                </h3>
                <p className="font-body text-xs font-light text-charcoal/50 leading-relaxed">
                  {material.description}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Citation */}
      <section className="py-24 md:py-32">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.blockquote
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
          >
            <p className="font-heading text-3xl md:text-4xl text-charcoal italic leading-snug mb-10 tracking-tight">
              "Un sac qui ne ressemble à aucun autre,
              conçu pour durer et pour être remarqué."
            </p>
            <div className="w-12 h-px bg-terracotta mx-auto mb-6" />
            <cite className="font-accent text-xl text-terracotta not-italic">
              — Marlena, Créatrice
            </cite>
          </motion.blockquote>
        </div>
      </section>
    </div>
  );
};

export default Craftsmanship;

import { motion } from 'framer-motion';

const Craftsmanship = () => {
  const steps = [
    {
      number: '01',
      title: 'Sélection du Fil',
      description: 'Nous sélectionnons uniquement les fils biologiques et recyclés les plus fins. Chaque fibre est choisie pour sa texture, sa durabilité et sa beauté.',
      image: 'https://images.unsplash.com/photo-1666112512232-f763ceeb5ec8?crop=entropy&cs=srgb&fm=jpg&q=85'
    },
    {
      number: '02',
      title: 'Conception du Design',
      description: 'Chaque sac commence par une vision. Croquis, études de couleurs et planification des motifs garantissent que chaque pièce sera belle et fonctionnelle.',
      image: 'https://images.unsplash.com/photo-1636545767112-27892db3d13f?crop=entropy&cs=srgb&fm=jpg&q=85'
    },
    {
      number: '03',
      title: 'La Confection',
      description: "C'est là que la magie opère. Heure après heure de travail minutieux transforment le fil brut en oeuvre d'art.",
      image: 'https://images.unsplash.com/photo-1647032713597-1dcfaa15b725?crop=entropy&cs=srgb&fm=jpg&q=85'
    },
    {
      number: '04',
      title: 'Les Finitions',
      description: "Les accessoires sont fixés, les doublures cousues, et chaque sac est inspecté pour atteindre la perfection. L'artisan signe son oeuvre.",
      image: 'https://images.unsplash.com/photo-1737888828619-96e0f50302f4?crop=entropy&cs=srgb&fm=jpg&q=85'
    }
  ];

  return (
    <div className="pt-24 lg:pt-28">
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
              Un savoir-faire qui
              <br />
              <span className="italic">raconte une histoire</span>
            </h1>
            <p className="font-body text-sm font-light text-charcoal/50 leading-relaxed max-w-lg">
              Chaque sac naît d'heures de travail patient. Pas de raccourcis, pas de machines. 
              Juste du fil, des mains et du temps.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Stats */}
      <section className="py-16 md:py-20 bg-charcoal text-stone-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row items-center justify-center gap-12 md:gap-20 text-center">
            {[
              { value: '40+', label: 'Heures en moyenne' },
              { value: '200+', label: 'Noeuds au centimètre' },
              { value: '100%', label: 'Fait Main' },
            ].map((stat, i) => (
              <div key={i}>
                <p className="font-heading text-5xl md:text-6xl tracking-tight">{stat.value}</p>
                <p className="font-body text-[10px] uppercase tracking-[0.25em] text-stone-white/25 mt-2">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Process Steps */}
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
                      alt={step.title}
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
                  <p className="font-body text-sm font-light text-charcoal/50 leading-relaxed max-w-md">
                    {step.description}
                  </p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Materials */}
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

          <div className="grid md:grid-cols-3 gap-8">
            {[
              { name: 'Coton Biologique', description: 'Doux, respirant et cultivé sans produits chimiques nocifs. Notre choix pour les sacs du quotidien.' },
              { name: 'Fibres Recyclées', description: 'Donner une nouvelle vie aux déchets textiles. Beau, durable et respectueux de la planète.' },
              { name: 'Laine Premium', description: "Provenant de fermes éthiques. Parfaite pour les pièces qui nécessitent chaleur et texture." }
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
                <p className="font-body text-xs font-light text-charcoal/40 leading-relaxed">
                  {material.description}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Quote */}
      <section className="py-24 md:py-32">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.blockquote
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
          >
            <p className="font-heading text-3xl md:text-4xl text-charcoal italic leading-snug mb-10 tracking-tight">
              "La beauté du fait main réside dans les imperfections — les subtiles variations 
              qui prouvent que des mains humaines étaient là."
            </p>
            <div className="w-12 h-px bg-terracotta mx-auto mb-6" />
            <cite className="font-accent text-xl text-terracotta not-italic">
              — Elena, Maître Artisane
            </cite>
          </motion.blockquote>
        </div>
      </section>
    </div>
  );
};

export default Craftsmanship;

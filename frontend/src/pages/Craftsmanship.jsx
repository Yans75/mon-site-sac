import { motion } from 'framer-motion';

const Craftsmanship = () => {
  const steps = [
    {
      number: '01',
      title: 'Selecting the Yarn',
      description: 'We source only the finest organic and recycled yarns from ethical suppliers. Each fiber is chosen for its texture, durability, and beauty.',
      image: 'https://images.unsplash.com/photo-1666112512232-f763ceeb5ec8?crop=entropy&cs=srgb&fm=jpg&q=85'
    },
    {
      number: '02',
      title: 'Planning the Design',
      description: 'Every bag begins with a vision. Sketches, color studies, and pattern planning ensure each piece will be both beautiful and functional.',
      image: 'https://images.unsplash.com/photo-1636545767112-27892db3d13f?crop=entropy&cs=srgb&fm=jpg&q=85'
    },
    {
      number: '03',
      title: 'The Making',
      description: 'This is where the magic happens. Hour after hour of careful handiwork—crocheting, weaving, shaping—transforms raw yarn into art.',
      image: 'https://images.unsplash.com/photo-1647032713597-1dcfaa15b725?crop=entropy&cs=srgb&fm=jpg&q=85'
    },
    {
      number: '04',
      title: 'Finishing Touches',
      description: 'Hardware is attached, linings are sewn, and each bag is inspected for perfection. Finally, the artisan signs their work.',
      image: 'https://images.unsplash.com/photo-1737888828619-96e0f50302f4?crop=entropy&cs=srgb&fm=jpg&q=85'
    }
  ];

  return (
    <div className="pt-24 pb-16">
      {/* Hero */}
      <section className="py-20 bg-pale-sand">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            className="max-w-3xl"
          >
            <span className="font-accent text-2xl text-terracotta mb-4 block">
              The Art of Making
            </span>
            <h1 className="font-heading text-5xl md:text-6xl text-charcoal mb-6 leading-tight">
              Craftsmanship that
              <br />
              <span className="italic">tells a story</span>
            </h1>
            <p className="font-body text-lg text-charcoal/70 leading-relaxed">
              Every ArtemCreations bag is born from hours of patient, skilled handiwork. 
              There are no shortcuts, no machines replacing human touch. Just yarn, hands, 
              and time—the ingredients of something truly special.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Time Banner */}
      <section className="py-12 bg-charcoal text-stone-white">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="flex flex-col md:flex-row items-center justify-center gap-8 md:gap-16 text-center">
            <div>
              <p className="font-heading text-5xl md:text-6xl">40+</p>
              <p className="font-body text-xs uppercase tracking-widest text-stone-white/60 mt-2">
                Hours Average
              </p>
            </div>
            <div className="hidden md:block w-px h-16 bg-stone-white/20" />
            <div>
              <p className="font-heading text-5xl md:text-6xl">200+</p>
              <p className="font-body text-xs uppercase tracking-widest text-stone-white/60 mt-2">
                Knots Per Inch
              </p>
            </div>
            <div className="hidden md:block w-px h-16 bg-stone-white/20" />
            <div>
              <p className="font-heading text-5xl md:text-6xl">100%</p>
              <p className="font-body text-xs uppercase tracking-widest text-stone-white/60 mt-2">
                Handmade
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Process Steps */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="space-y-32">
            {steps.map((step, index) => (
              <motion.div
                key={step.number}
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-100px" }}
                transition={{ duration: 0.8 }}
                className={`grid lg:grid-cols-2 gap-12 lg:gap-20 items-center ${
                  index % 2 === 1 ? 'lg:flex-row-reverse' : ''
                }`}
              >
                <div className={index % 2 === 1 ? 'lg:order-2' : ''}>
                  <div className="aspect-[4/3] overflow-hidden">
                    <img
                      src={step.image}
                      alt={step.title}
                      className="w-full h-full object-cover filter grayscale-[15%] hover:grayscale-0 transition-all duration-700"
                    />
                  </div>
                </div>

                <div className={index % 2 === 1 ? 'lg:order-1' : ''}>
                  <span className="font-heading text-8xl text-pale-sand">
                    {step.number}
                  </span>
                  <h2 className="font-heading text-3xl md:text-4xl text-charcoal -mt-8 mb-4 relative z-10">
                    {step.title}
                  </h2>
                  <p className="font-body text-charcoal/70 leading-relaxed">
                    {step.description}
                  </p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Materials */}
      <section className="py-20 bg-pale-sand">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="font-heading text-4xl md:text-5xl text-charcoal mb-4">
              Our Materials
            </h2>
            <p className="font-body text-charcoal/60 max-w-2xl mx-auto">
              We believe great craft starts with great materials. Every yarn we use 
              is carefully selected for quality, sustainability, and beauty.
            </p>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                name: 'Organic Cotton',
                description: 'Soft, breathable, and grown without harmful chemicals. Our go-to for everyday bags.'
              },
              {
                name: 'Recycled Fibers',
                description: 'Giving new life to textile waste. Beautiful, durable, and kind to the planet.'
              },
              {
                name: 'Premium Wool',
                description: 'Ethically sourced from trusted farms. Perfect for pieces that need extra warmth and texture.'
              }
            ].map((material, index) => (
              <motion.div
                key={material.name}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="bg-stone-white p-8"
              >
                <h3 className="font-heading text-2xl text-charcoal mb-3">
                  {material.name}
                </h3>
                <p className="font-body text-sm text-charcoal/60 leading-relaxed">
                  {material.description}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Quote */}
      <section className="py-20">
        <div className="max-w-4xl mx-auto px-6 lg:px-8 text-center">
          <motion.blockquote
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
          >
            <p className="font-heading text-3xl md:text-4xl text-charcoal italic mb-8 leading-relaxed">
              "The beauty of handmade is in the imperfections—the subtle variations 
              that prove human hands were here, creating something with care."
            </p>
            <cite className="font-accent text-xl text-terracotta not-italic">
              — Elena, Master Artisan
            </cite>
          </motion.blockquote>
        </div>
      </section>
    </div>
  );
};

export default Craftsmanship;

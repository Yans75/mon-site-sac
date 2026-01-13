import { motion } from 'framer-motion';
import { Heart, Leaf, Clock, Sparkles } from 'lucide-react';

const About = () => {
  const values = [
    {
      icon: Heart,
      title: 'Made with Love',
      description: 'Every stitch carries the warmth of human hands and the passion of skilled artisans.'
    },
    {
      icon: Leaf,
      title: 'Sustainable Materials',
      description: 'We source organic, recycled, and ethically produced yarns from trusted suppliers.'
    },
    {
      icon: Clock,
      title: 'Slow Fashion',
      description: 'Quality over quantity. Each piece takes 20-60 hours to complete—time well spent.'
    },
    {
      icon: Sparkles,
      title: 'Unique Pieces',
      description: 'Limited editions ensure you own something truly special and exclusive.'
    }
  ];

  return (
    <div className="pt-24 pb-16">
      {/* Hero */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-12 lg:gap-20 items-center">
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
            >
              <span className="font-accent text-2xl text-terracotta mb-4 block">
                Our Story
              </span>
              <h1 className="font-heading text-5xl md:text-6xl text-charcoal mb-6 leading-tight">
                Born from a love of
                <br />
                <span className="italic">handmade beauty</span>
              </h1>
              <p className="font-body text-lg text-charcoal/70 leading-relaxed">
                ArtemCreations began in a small studio, with a single artisan and a vision: 
                to create bags that tell stories, bags that become more beautiful with time, 
                bags that honor the ancient art of textile making.
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
                  alt="Artisan at work"
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="absolute -bottom-8 -right-8 bg-pale-sand p-8 hidden lg:block">
                <p className="font-accent text-2xl text-terracotta">
                  "Every bag has a soul"
                </p>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* The Artisan */}
      <section className="py-20 bg-pale-sand">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-12 lg:gap-20 items-center">
            <motion.div
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              className="order-2 lg:order-1"
            >
              <div className="aspect-square overflow-hidden">
                <img
                  src="https://images.unsplash.com/photo-1737888828619-96e0f50302f4?crop=entropy&cs=srgb&fm=jpg&q=85"
                  alt="The artisan"
                  className="w-full h-full object-cover"
                />
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="order-1 lg:order-2"
            >
              <h2 className="font-heading text-4xl md:text-5xl text-charcoal mb-6">
                Meet the Maker
              </h2>
              <p className="font-body text-charcoal/70 leading-relaxed mb-6">
                With over three decades of experience in textile arts, our founder brings 
                a wealth of knowledge and an unwavering commitment to quality. What started 
                as a childhood fascination with yarn and needles has blossomed into a 
                celebrated craft.
              </p>
              <p className="font-body text-charcoal/70 leading-relaxed mb-6">
                Each ArtemCreations piece passes through skilled hands that have perfected 
                techniques passed down through generations. It's not just about making bags—
                it's about preserving a tradition, creating beauty, and crafting objects 
                that last.
              </p>
              <p className="font-accent text-xl text-terracotta">
                — Elena, Founder & Master Artisan
              </p>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Values */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="font-heading text-4xl md:text-5xl text-charcoal mb-4">
              What We Believe
            </h2>
            <p className="font-body text-charcoal/60 max-w-2xl mx-auto">
              Our values guide every decision, from the yarns we choose to the 
              techniques we employ.
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {values.map((value, index) => (
              <motion.div
                key={value.title}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="text-center p-8"
              >
                <div className="w-12 h-12 mx-auto mb-6 flex items-center justify-center">
                  <value.icon size={32} className="text-terracotta" strokeWidth={1} />
                </div>
                <h3 className="font-heading text-xl text-charcoal mb-3">
                  {value.title}
                </h3>
                <p className="font-body text-sm text-charcoal/60 leading-relaxed">
                  {value.description}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Quote */}
      <section className="py-20 bg-charcoal text-stone-white">
        <div className="max-w-4xl mx-auto px-6 lg:px-8 text-center">
          <motion.blockquote
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
          >
            <p className="font-heading text-3xl md:text-4xl italic mb-8 leading-relaxed">
              "In a world that moves too fast, we choose to slow down. 
              To create with intention. To make something worth keeping."
            </p>
            <cite className="font-body text-stone-white/60 text-sm uppercase tracking-widest not-italic">
              — Our Philosophy
            </cite>
          </motion.blockquote>
        </div>
      </section>
    </div>
  );
};

export default About;

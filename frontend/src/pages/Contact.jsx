import { useState } from 'react';
import { motion } from 'framer-motion';
import { Send, Mail, MapPin, Instagram, Facebook } from 'lucide-react';
import { toast } from 'sonner';
import axios from 'axios';
import { Input } from '../components/ui/input';
import { Textarea } from '../components/ui/textarea';
import { Label } from '../components/ui/label';

const API = `${process.env.REACT_APP_BACKEND_URL}/api`;

const Contact = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  });
  const [sending, setSending] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSending(true);
    try {
      await axios.post(`${API}/contact`, formData);
      toast.success('Message envoyé !', { description: "Nous vous répondrons très bientôt." });
      setFormData({ name: '', email: '', subject: '', message: '' });
    } catch (error) {
      toast.error("Impossible d'envoyer le message", { description: 'Veuillez réessayer plus tard.' });
    } finally {
      setSending(false);
    }
  };

  return (
    <div className="pt-24 lg:pt-28">
      {/* Hero */}
      <section className="py-16 md:py-24 bg-pale-sand">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <p className="font-body text-xs uppercase tracking-[0.25em] text-charcoal/30 mb-4">Contact</p>
            <h1 className="font-heading text-5xl md:text-6xl lg:text-7xl text-charcoal tracking-tighter leading-none mb-6">
              Contactez-nous
            </h1>
            <p className="font-body text-sm font-light text-charcoal/50 max-w-lg leading-relaxed">
              Une question sur nos sacs ? Intéressé(e) par une commande personnalisée ? 
              Nous serions ravis d'échanger avec vous.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Contact Content */}
      <section className="py-20 md:py-28">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-16 lg:gap-28">
            {/* Form */}
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
            >
              <p className="font-body text-xs uppercase tracking-[0.25em] text-charcoal/30 mb-6">Message</p>
              <h2 className="font-heading text-3xl md:text-4xl text-charcoal mb-10 tracking-tight">
                Envoyez-nous un mot
              </h2>
              <form onSubmit={handleSubmit} className="space-y-8">
                <div>
                  <Label htmlFor="name" className="font-body text-xs uppercase tracking-[0.15em] text-charcoal/30 mb-3 block">
                    Votre Nom
                  </Label>
                  <Input
                    id="name" name="name" type="text"
                    value={formData.name} onChange={handleChange} required
                    data-testid="contact-name"
                    className="w-full bg-transparent border-0 border-b border-charcoal/10 focus:border-charcoal rounded-none py-3 px-0 font-body text-sm placeholder:text-charcoal/20"
                    placeholder="Marie Dupont"
                  />
                </div>
                <div>
                  <Label htmlFor="email" className="font-body text-xs uppercase tracking-[0.15em] text-charcoal/30 mb-3 block">
                    Adresse Email
                  </Label>
                  <Input
                    id="email" name="email" type="email"
                    value={formData.email} onChange={handleChange} required
                    data-testid="contact-email"
                    className="w-full bg-transparent border-0 border-b border-charcoal/10 focus:border-charcoal rounded-none py-3 px-0 font-body text-sm placeholder:text-charcoal/20"
                    placeholder="marie@exemple.com"
                  />
                </div>
                <div>
                  <Label htmlFor="subject" className="font-body text-xs uppercase tracking-[0.15em] text-charcoal/30 mb-3 block">
                    Sujet
                  </Label>
                  <Input
                    id="subject" name="subject" type="text"
                    value={formData.subject} onChange={handleChange}
                    data-testid="contact-subject"
                    className="w-full bg-transparent border-0 border-b border-charcoal/10 focus:border-charcoal rounded-none py-3 px-0 font-body text-sm placeholder:text-charcoal/20"
                    placeholder="Commande personnalisée"
                  />
                </div>
                <div>
                  <Label htmlFor="message" className="font-body text-xs uppercase tracking-[0.15em] text-charcoal/30 mb-3 block">
                    Votre Message
                  </Label>
                  <Textarea
                    id="message" name="message"
                    value={formData.message} onChange={handleChange} required rows={5}
                    data-testid="contact-message"
                    className="w-full bg-transparent border-0 border-b border-charcoal/10 focus:border-charcoal rounded-none py-3 px-0 resize-none font-body text-sm placeholder:text-charcoal/20"
                    placeholder="Décrivez votre demande..."
                  />
                </div>
                <button
                  type="submit" disabled={sending}
                  data-testid="contact-submit"
                  className="btn-primary flex items-center gap-3"
                >
                  {sending ? 'Envoi en cours...' : (
                    <>
                      Envoyer
                      <Send size={12} />
                    </>
                  )}
                </button>
              </form>
            </motion.div>

            {/* Info */}
            <motion.div
              initial={{ opacity: 0, x: 30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="lg:pl-8"
            >
              <p className="font-body text-xs uppercase tracking-[0.25em] text-charcoal/30 mb-6">Informations</p>
              <h2 className="font-heading text-3xl md:text-4xl text-charcoal mb-10 tracking-tight">
                Où nous trouver
              </h2>

              <div className="space-y-10">
                <div className="flex gap-5">
                  <div className="w-10 h-10 bg-pale-sand flex items-center justify-center flex-shrink-0">
                    <Mail size={16} strokeWidth={1.5} className="text-charcoal/50" />
                  </div>
                  <div>
                    <p className="font-body text-xs uppercase tracking-[0.2em] text-charcoal/30 mb-1">Email</p>
                    <a href="mailto:bonjour@artemcreations.com"
                      className="font-body text-sm text-charcoal hover:text-terracotta transition-colors duration-500">
                      bonjour@artemcreations.com
                    </a>
                  </div>
                </div>

                <div className="flex gap-5">
                  <div className="w-10 h-10 bg-pale-sand flex items-center justify-center flex-shrink-0">
                    <MapPin size={16} strokeWidth={1.5} className="text-charcoal/50" />
                  </div>
                  <div>
                    <p className="font-body text-xs uppercase tracking-[0.2em] text-charcoal/30 mb-1">Atelier</p>
                    <p className="font-body text-sm text-charcoal">123 Rue des Artisans<br />75011 Paris, France</p>
                  </div>
                </div>

                <div className="pt-8 border-t border-charcoal/5">
                  <p className="font-body text-xs uppercase tracking-[0.2em] text-charcoal/30 mb-5">Suivez-nous</p>
                  <div className="flex gap-3">
                    {[
                      { href: 'https://instagram.com', icon: Instagram, testId: 'contact-instagram' },
                      { href: 'https://facebook.com', icon: Facebook, testId: 'contact-facebook' },
                    ].map(({ href, icon: Icon, testId }) => (
                      <a key={testId} href={href} target="_blank" rel="noopener noreferrer"
                        data-testid={testId}
                        className="w-10 h-10 border border-charcoal/10 flex items-center justify-center text-charcoal/30 hover:text-charcoal hover:border-charcoal/30 transition-all duration-500">
                        <Icon size={16} strokeWidth={1.5} />
                      </a>
                    ))}
                  </div>
                </div>

                <div className="pt-8 border-t border-charcoal/5">
                  <p className="font-body text-xs uppercase tracking-[0.2em] text-charcoal/30 mb-4">Horaires</p>
                  <div className="space-y-2 font-body text-sm font-light text-charcoal/50">
                    <p>Lundi - Vendredi : 10h - 18h</p>
                    <p>Samedi : Sur rendez-vous</p>
                    <p>Dimanche : Fermé</p>
                  </div>
                </div>
              </div>

              {/* Custom order note */}
              <div className="mt-12 p-8 bg-pale-sand">
                <p className="font-accent text-lg text-terracotta mb-3">
                  Commandes personnalisées
                </p>
                <p className="font-body text-xs font-light text-charcoal/50 leading-relaxed">
                  Nous accueillons les commandes sur mesure. Les délais varient de 4 à 8 semaines 
                  selon la complexité. Contactez-nous pour discuter de votre vision.
                </p>
              </div>
            </motion.div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Contact;

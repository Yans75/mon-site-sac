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
      toast.success('Message envoyé !', {
        description: "Nous vous répondrons très bientôt."
      });
      setFormData({ name: '', email: '', subject: '', message: '' });
    } catch (error) {
      toast.error('Impossible d\'envoyer le message', {
        description: 'Veuillez réessayer plus tard.'
      });
    } finally {
      setSending(false);
    }
  };

  return (
    <div className="pt-24 pb-16">
      {/* Hero */}
      <section className="py-20 bg-pale-sand">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            className="max-w-2xl"
          >
            <span className="font-accent text-2xl text-terracotta mb-4 block">
              Restons en Contact
            </span>
            <h1 className="font-heading text-5xl md:text-6xl text-charcoal mb-6">
              Contactez-nous
            </h1>
            <p className="font-body text-lg text-charcoal/70 leading-relaxed">
              Une question sur nos sacs ? Intéressé(e) par une commande personnalisée ? 
              Nous serions ravis d'échanger avec vous.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Contact Content */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-16 lg:gap-24">
            {/* Form */}
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
            >
              <h2 className="font-heading text-3xl text-charcoal mb-8">
                Envoyez un Message
              </h2>
              <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                  <Label htmlFor="name" className="font-body text-sm text-charcoal/70 mb-2 block">
                    Votre Nom
                  </Label>
                  <Input
                    id="name"
                    name="name"
                    type="text"
                    value={formData.name}
                    onChange={handleChange}
                    required
                    data-testid="contact-name"
                    className="w-full bg-stone-white border-muted focus:border-charcoal rounded-none py-3"
                    placeholder="Marie Dupont"
                  />
                </div>

                <div>
                  <Label htmlFor="email" className="font-body text-sm text-charcoal/70 mb-2 block">
                    Adresse Email
                  </Label>
                  <Input
                    id="email"
                    name="email"
                    type="email"
                    value={formData.email}
                    onChange={handleChange}
                    required
                    data-testid="contact-email"
                    className="w-full bg-stone-white border-muted focus:border-charcoal rounded-none py-3"
                    placeholder="marie@exemple.com"
                  />
                </div>

                <div>
                  <Label htmlFor="subject" className="font-body text-sm text-charcoal/70 mb-2 block">
                    Sujet
                  </Label>
                  <Input
                    id="subject"
                    name="subject"
                    type="text"
                    value={formData.subject}
                    onChange={handleChange}
                    data-testid="contact-subject"
                    className="w-full bg-stone-white border-muted focus:border-charcoal rounded-none py-3"
                    placeholder="Demande de commande personnalisée"
                  />
                </div>

                <div>
                  <Label htmlFor="message" className="font-body text-sm text-charcoal/70 mb-2 block">
                    Votre Message
                  </Label>
                  <Textarea
                    id="message"
                    name="message"
                    value={formData.message}
                    onChange={handleChange}
                    required
                    rows={6}
                    data-testid="contact-message"
                    className="w-full bg-stone-white border-muted focus:border-charcoal rounded-none resize-none"
                    placeholder="Décrivez votre demande..."
                  />
                </div>

                <button
                  type="submit"
                  disabled={sending}
                  data-testid="contact-submit"
                  className="btn-primary flex items-center gap-2"
                >
                  {sending ? 'Envoi en cours...' : (
                    <>
                      Envoyer le Message
                      <Send size={14} />
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
              <h2 className="font-heading text-3xl text-charcoal mb-8">
                Informations
              </h2>

              <div className="space-y-8">
                <div className="flex gap-4">
                  <div className="w-12 h-12 bg-pale-sand flex items-center justify-center flex-shrink-0">
                    <Mail size={20} className="text-charcoal" />
                  </div>
                  <div>
                    <h3 className="font-body text-sm uppercase tracking-widest text-charcoal/60 mb-1">
                      Email
                    </h3>
                    <a 
                      href="mailto:bonjour@artemcreations.com"
                      className="font-body text-charcoal hover:text-terracotta transition-colors"
                    >
                      bonjour@artemcreations.com
                    </a>
                  </div>
                </div>

                <div className="flex gap-4">
                  <div className="w-12 h-12 bg-pale-sand flex items-center justify-center flex-shrink-0">
                    <MapPin size={20} className="text-charcoal" />
                  </div>
                  <div>
                    <h3 className="font-body text-sm uppercase tracking-widest text-charcoal/60 mb-1">
                      Atelier
                    </h3>
                    <p className="font-body text-charcoal">
                      123 Rue des Artisans<br />
                      75011 Paris, France
                    </p>
                  </div>
                </div>

                <div className="pt-8 border-t border-muted">
                  <h3 className="font-body text-sm uppercase tracking-widest text-charcoal/60 mb-4">
                    Suivez-nous
                  </h3>
                  <div className="flex gap-4">
                    <a 
                      href="https://instagram.com" 
                      target="_blank" 
                      rel="noopener noreferrer"
                      data-testid="contact-instagram"
                      className="w-12 h-12 bg-pale-sand flex items-center justify-center hover:bg-charcoal hover:text-stone-white transition-colors duration-300"
                    >
                      <Instagram size={20} />
                    </a>
                    <a 
                      href="https://facebook.com" 
                      target="_blank" 
                      rel="noopener noreferrer"
                      data-testid="contact-facebook"
                      className="w-12 h-12 bg-pale-sand flex items-center justify-center hover:bg-charcoal hover:text-stone-white transition-colors duration-300"
                    >
                      <Facebook size={20} />
                    </a>
                  </div>
                </div>

                <div className="pt-8 border-t border-muted">
                  <h3 className="font-body text-sm uppercase tracking-widest text-charcoal/60 mb-4">
                    Horaires de l'Atelier
                  </h3>
                  <div className="space-y-2 font-body text-charcoal/70">
                    <p>Lundi - Vendredi : 10h - 18h</p>
                    <p>Samedi : Sur rendez-vous</p>
                    <p>Dimanche : Fermé</p>
                  </div>
                </div>
              </div>

              {/* Note */}
              <div className="mt-12 p-6 bg-pale-sand">
                <p className="font-accent text-lg text-terracotta mb-2">
                  À propos des commandes personnalisées
                </p>
                <p className="font-body text-sm text-charcoal/70 leading-relaxed">
                  Nous accueillons avec plaisir les commandes personnalisées pour ceux qui 
                  recherchent quelque chose de vraiment unique. Les délais varient généralement 
                  de 4 à 8 semaines selon la complexité. Contactez-nous pour discuter de votre vision.
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

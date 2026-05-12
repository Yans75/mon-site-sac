import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowLeft, FileText } from 'lucide-react';
import SEO from '../components/SEO';
import Breadcrumb from '../components/Breadcrumb';
import { getInformationPageByHandle } from '../lib/shopify';

const Page = () => {
  const { handle } = useParams();
  const [page, setPage] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPage = async () => {
      setLoading(true);
      try {
        const data = await getInformationPageByHandle(handle);
        setPage(data);
      } catch (error) {
        console.error('Error fetching page:', error);
      } finally {
        setLoading(false);
      }
    };
    if (handle) fetchPage();
  }, [handle]);

  if (loading) {
    return (
      <div className="pt-28 pb-16 min-h-screen">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="animate-pulse space-y-6">
            <div className="h-4 bg-pale-sand w-1/3" />
            <div className="h-12 bg-pale-sand w-2/3" />
            <div className="space-y-3 pt-8">
              <div className="h-4 bg-pale-sand" />
              <div className="h-4 bg-pale-sand" />
              <div className="h-4 bg-pale-sand w-5/6" />
              <div className="h-4 bg-pale-sand w-4/6" />
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!page) {
    return (
      <div className="pt-28 pb-16 min-h-screen flex items-center justify-center">
        <div className="text-center px-4">
          <FileText size={48} className="text-charcoal/10 mx-auto mb-6" strokeWidth={1} />
          <h1 className="font-heading text-3xl text-charcoal mb-3">Page introuvable</h1>
          <p className="font-body text-sm text-charcoal/40 mb-8">
            Cette page n'existe pas ou a été déplacée.
          </p>
          <Link to="/" className="btn-primary inline-flex items-center gap-2">
            <ArrowLeft size={14} />
            Retour à l'accueil
          </Link>
        </div>
      </div>
    );
  }

  const updatedDate = page.updatedAt
    ? new Date(page.updatedAt).toLocaleDateString('fr-FR', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
      })
    : null;

  return (
    <div className="pt-28 pb-16">
      <SEO
        title={page.seo?.title || page.title}
        description={page.seo?.description || page.bodySummary || `${page.title} — Artem Creations`}
      />

      <section className="py-16 md:py-20 bg-pale-sand">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <Breadcrumb items={[{ label: 'Accueil', to: '/' }, { label: page.title }]} />
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
            <p className="font-body text-xs uppercase tracking-[0.25em] text-charcoal/30 mb-4">
              Informations légales
            </p>
            <h1 className="font-heading text-4xl md:text-5xl lg:text-6xl text-charcoal tracking-tighter leading-none mb-6">
              {page.title}
            </h1>
            {updatedDate && (
              <p className="font-body text-xs text-charcoal/40 uppercase tracking-[0.15em]">
                Dernière mise à jour : {updatedDate}
              </p>
            )}
          </motion.div>
        </div>
      </section>

      <section className="py-16 md:py-24">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.article
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="shopify-page-content font-body text-charcoal/80 leading-relaxed"
            dangerouslySetInnerHTML={{ __html: page.body || '<p>Aucun contenu disponible pour le moment.</p>' }}
          />

          <div className="mt-16 pt-10 border-t border-charcoal/10">
            <Link
              to="/"
              data-testid="page-back-home"
              className="inline-flex items-center gap-2 font-body text-xs uppercase tracking-[0.15em] text-charcoal/40 hover:text-terracotta transition-colors duration-500"
            >
              <ArrowLeft size={14} />
              Retour à l'accueil
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Page;

import { Link } from 'react-router-dom';
import { ChevronRight } from 'lucide-react';
import { Helmet } from 'react-helmet-async';

const SITE_URL = 'https://artemcreations.com';

const Breadcrumb = ({ items }) => {
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: items.map((item, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name: item.label,
      item: item.to ? `${SITE_URL}${item.to}` : undefined,
    })),
  };

  return (
    <>
      <Helmet>
        <script type="application/ld+json">{JSON.stringify(jsonLd)}</script>
      </Helmet>
      <nav aria-label="Fil d'Ariane" data-testid="breadcrumb" className="mb-8">
        <ol className="flex items-center gap-2 font-body text-xs text-charcoal/30">
          {items.map((item, index) => (
            <li key={index} className="flex items-center gap-2">
              {index > 0 && <ChevronRight size={10} />}
              {item.to ? (
                <Link
                  to={item.to}
                  className="hover:text-charcoal transition-colors duration-300 uppercase tracking-[0.15em]"
                >
                  {item.label}
                </Link>
              ) : (
                <span className="text-charcoal uppercase tracking-[0.15em]">{item.label}</span>
              )}
            </li>
          ))}
        </ol>
      </nav>
    </>
  );
};

export default Breadcrumb;

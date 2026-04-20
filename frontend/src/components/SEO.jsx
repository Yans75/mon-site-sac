import { Helmet } from 'react-helmet-async';
import { useLocation } from 'react-router-dom';

const SITE_URL = 'https://artemcreations.com';
const SITE_NAME = 'Artem Creations';
const DEFAULT_IMAGE = 'https://customer-assets.emergentagent.com/job_ddcf7dd4-0bde-46cb-bf20-9dbb3d1819e4/artifacts/3oaokz1a_1000098153.png';

const SEO = ({
  title,
  description,
  image = DEFAULT_IMAGE,
  type = 'website',
  price,
  currency = 'EUR',
  noindex = false,
  jsonLd,
}) => {
  const location = useLocation();
  const url = `${SITE_URL}${location.pathname}`;
  const fullTitle = title ? `${title} | ${SITE_NAME}` : `${SITE_NAME} — Sacs à Main Faits Main`;

  return (
    <Helmet>
      <title>{fullTitle}</title>
      <meta name="description" content={description} />
      <link rel="canonical" href={url} />
      <link rel="alternate" hrefLang="fr" href={url} />
      {noindex && <meta name="robots" content="noindex,nofollow" />}

      {/* Open Graph */}
      <meta property="og:title" content={fullTitle} />
      <meta property="og:description" content={description} />
      <meta property="og:image" content={image} />
      <meta property="og:url" content={url} />
      <meta property="og:type" content={type} />
      <meta property="og:site_name" content={SITE_NAME} />
      <meta property="og:locale" content="fr_FR" />
      {price && <meta property="og:price:amount" content={price} />}
      {price && <meta property="og:price:currency" content={currency} />}

      {/* Twitter Card */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={fullTitle} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:image" content={image} />

      {/* JSON-LD */}
      {jsonLd && (
        <script type="application/ld+json">
          {JSON.stringify(jsonLd)}
        </script>
      )}
    </Helmet>
  );
};

export default SEO;

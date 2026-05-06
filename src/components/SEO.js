import React from 'react';
import { Helmet } from 'react-helmet-async';

const SITE_NAME = 'Guerrmo';
const SITE_URL = 'https://guerrmo.com';
const DEFAULT_OG_IMAGE = 'https://guerrmo-store.s3.us-east-1.amazonaws.com/general/og-default.jpg';

const SEO = ({ title, pageTitle: pageTitleProp, description, ogImage, noIndex = false, structuredData }) => {
  const pageTitle = pageTitleProp || (title
    ? `${title} — ${SITE_NAME}`
    : `${SITE_NAME} — Refacciones Automotrices en Ciudad Juárez`);
  const canonical = `${SITE_URL}/${typeof window !== 'undefined' ? window.location.hash : ''}`;

  return (
    <Helmet>
      <title>{pageTitle}</title>
      <meta name="description" content={description} />
      <meta name="robots" content={noIndex ? 'noindex, nofollow' : 'index, follow'} />
      <link rel="canonical" href={canonical} />

      <meta property="og:type" content="website" />
      <meta property="og:title" content={pageTitle} />
      <meta property="og:description" content={description} />
      <meta property="og:image" content={ogImage || DEFAULT_OG_IMAGE} />
      <meta property="og:url" content={canonical} />
      <meta property="og:site_name" content={SITE_NAME} />
      <meta property="og:locale" content="es_MX" />

      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={pageTitle} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:image" content={ogImage || DEFAULT_OG_IMAGE} />

      {structuredData && (
        <script type="application/ld+json">
          {JSON.stringify(structuredData)}
        </script>
      )}
    </Helmet>
  );
};

export default SEO;

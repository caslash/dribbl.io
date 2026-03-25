import { Helmet } from 'react-helmet-async';

const DEFAULT_OG_IMAGE = 'https://dribbl.io/images/og-default.png';

interface PageMetaProps {
  title: string;
  description: string;
  canonicalPath: string;
  noIndex?: boolean;
  image?: string;
}

/**
 * Injects per-page SEO metadata into `<head>` via react-helmet-async.
 * Renders title, description, canonical URL, Open Graph, and Twitter Card tags.
 * Pass `noIndex` for pages that should not be indexed (e.g. ephemeral room URLs).
 *
 * @param title - The page `<title>` and OG/Twitter title.
 * @param description - The meta description and OG/Twitter description.
 * @param canonicalPath - The path portion of the canonical URL (e.g. `/career`).
 * @param noIndex - When true, adds `<meta name="robots" content="noindex, nofollow" />`.
 * @param image - Absolute URL for `og:image` and `twitter:image`. Defaults to the site-wide social preview.
 *
 * @example
 * <PageMeta
 *   title="Career Path — dribbl.io"
 *   description="Guess the NBA player from their career team history."
 *   canonicalPath="/career"
 * />
 */
export function PageMeta({ title, description, canonicalPath, noIndex = false, image = DEFAULT_OG_IMAGE }: PageMetaProps) {
  const canonicalUrl = `https://dribbl.io${canonicalPath}`;

  return (
    <Helmet>
      <title>{title}</title>
      <meta name="description" content={description} />
      <link rel="canonical" href={canonicalUrl} />
      {noIndex && <meta name="robots" content="noindex, nofollow" />}
      <meta property="og:url" content={canonicalUrl} />
      <meta property="og:title" content={title} />
      <meta property="og:description" content={description} />
      <meta property="og:image" content={image} />
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={title} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:image" content={image} />
    </Helmet>
  );
}

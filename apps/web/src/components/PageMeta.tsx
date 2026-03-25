import { Helmet } from 'react-helmet-async';

interface PageMetaProps {
  title: string;
  description: string;
  canonicalPath: string;
  noIndex?: boolean;
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
 *
 * @example
 * <PageMeta
 *   title="Career Path — dribbl.io"
 *   description="Guess the NBA player from their career team history."
 *   canonicalPath="/career"
 * />
 */
export function PageMeta({ title, description, canonicalPath, noIndex = false }: PageMetaProps) {
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
      <meta name="twitter:title" content={title} />
      <meta name="twitter:description" content={description} />
    </Helmet>
  );
}

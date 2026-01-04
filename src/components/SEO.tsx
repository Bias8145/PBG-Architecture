import React from 'react';
import { Helmet } from 'react-helmet-async';
import { useLocation } from 'react-router-dom';

interface SEOProps {
  title: string;
  description?: string;
  image?: string;
  type?: 'website' | 'article';
}

export default function SEO({ 
  title, 
  description, 
  image, 
  type = 'website' 
}: SEOProps) {
  const location = useLocation();
  const siteTitle = 'Jasa Desain PBG';
  
  // Dynamic URL handling - ensures the shared link matches the actual deployed URL (Netlify, localhost, etc.)
  const currentUrl = window.location.origin + location.pathname;
  
  const defaultDescription = 'Jasa Desain Arsitektur, Perhitungan Struktur, dan MEP Terpercaya untuk Hunian Komersil & Non-Komersil.';
  const metaDescription = description || defaultDescription;
  
  // Default fallback image if none provided
  const metaImage = image || 'https://images.unsplash.com/photo-1487958449943-2429e8be8625?auto=format&fit=crop&q=80&w=2070';

  return (
    <Helmet>
      {/* Standard Metadata */}
      <title>{`${title} | ${siteTitle}`}</title>
      <meta name="description" content={metaDescription} />
      <link rel="canonical" href={currentUrl} />

      {/* Open Graph / Facebook */}
      <meta property="og:url" content={currentUrl} />
      <meta property="og:type" content={type} />
      <meta property="og:title" content={title} />
      <meta property="og:description" content={metaDescription} />
      <meta property="og:image" content={metaImage} />
      <meta property="og:site_name" content={siteTitle} />

      {/* Twitter */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={title} />
      <meta name="twitter:description" content={metaDescription} />
      <meta name="twitter:image" content={metaImage} />
    </Helmet>
  );
}

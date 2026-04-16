/**
 * Cliente para la API de Emdash CMS.
 *
 * Emdash expone contenido vía REST API.
 * Documentación: https://emdash.ai/docs
 */

const apiUrl = import.meta.env.EMDASH_API_URL;
const apiKey = import.meta.env.EMDASH_API_KEY;
const siteId = import.meta.env.EMDASH_SITE_ID;

interface EmdashRequestOptions {
  endpoint: string;
  params?: Record<string, string>;
}

async function emdashFetch<T>({ endpoint, params }: EmdashRequestOptions): Promise<T> {
  const url = new URL(`${apiUrl}/sites/${siteId}/${endpoint}`);

  if (params) {
    for (const [key, value] of Object.entries(params)) {
      url.searchParams.set(key, value);
    }
  }

  const response = await fetch(url.toString(), {
    headers: {
      Authorization: `Bearer ${apiKey}`,
      'Content-Type': 'application/json',
    },
  });

  if (!response.ok) {
    throw new Error(`Emdash API error: ${response.status} ${response.statusText}`);
  }

  return response.json() as Promise<T>;
}

// ──────────────────────────────────────────
// Tipos — Ajustar según el schema de Emdash
// ──────────────────────────────────────────

export interface PortfolioProject {
  id: string;
  slug: string;
  title: string;
  description: string;
  category: 'photography' | 'video' | 'both';
  coverImage: string;       // Cloudinary public_id
  images: string[];          // Cloudinary public_ids
  youtubeVideoId?: string;
  date: string;
  featured: boolean;
}

export interface AboutContent {
  id: string;
  bio: string;
  profileImage: string;     // Cloudinary public_id
  skills: string[];
}

export interface SiteSettings {
  id: string;
  siteName: string;
  tagline: string;
  socialLinks: {
    instagram?: string;
    youtube?: string;
    vimeo?: string;
    email?: string;
  };
}

// ──────────────────────────────────────────
// Funciones de consulta
// ──────────────────────────────────────────

export async function getPortfolioProjects(): Promise<PortfolioProject[]> {
  return emdashFetch<PortfolioProject[]>({ endpoint: 'collections/portfolio/entries' });
}

export async function getProjectBySlug(slug: string): Promise<PortfolioProject> {
  return emdashFetch<PortfolioProject>({
    endpoint: `collections/portfolio/entries`,
    params: { slug },
  });
}

export async function getFeaturedProjects(): Promise<PortfolioProject[]> {
  const projects = await getPortfolioProjects();
  return projects.filter((p) => p.featured);
}

export async function getAboutContent(): Promise<AboutContent> {
  return emdashFetch<AboutContent>({ endpoint: 'collections/about/entries' });
}

export async function getSiteSettings(): Promise<SiteSettings> {
  return emdashFetch<SiteSettings>({ endpoint: 'collections/settings/entries' });
}

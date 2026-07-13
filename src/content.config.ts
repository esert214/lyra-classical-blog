import { defineCollection, z } from 'astro:content';
import { glob } from 'astro/loaders';

function uniqueId({ data }: { data: Record<string, unknown> }) {
  return `${data.locale}-${data.slug}`;
}

const performerSchema = z.object({
  name: z.string(),
  role: z.string().optional(),
  bio: z.string().optional(),
});

const composerSchema = z.object({
  name: z.string(),
  bio: z.string().optional(),
});

const album = defineCollection({
  loader: glob({ pattern: "**/*.md", base: "./src/content/album", generateId: uniqueId }),
  schema: z.object({
    title: z.string(),
    locale: z.enum(['zh', 'en']),
    slug: z.string(),
    date: z.date(),
    artist: z.string(),
    album: z.string(),
    releaseDate: z.string(),
    genre: z.string(),
    catalogNumber: z.string(),
    performers: z.array(performerSchema),
    composers: z.array(composerSchema),
    hasPerformedInTaiwan: z.boolean(),
    taiwanVisitDetail: z.string().optional(),
    taiwanVisitImages: z.array(z.string()).optional(),
    upcomingConcerts: z.array(z.object({
      date: z.string(),
      location: z.string(),
      event: z.string(),
      url: z.string().optional(),
    })).optional(),
    relatedAlbums: z.array(z.object({
      title: z.string(),
      artist: z.string(),
      coverImage: z.string().optional(),
      slug: z.string().optional(),
      url: z.string().optional(),
    })).optional(),
    coverImage: z.string().optional(),
    tags: z.array(z.string()),
  }),
});

const dailyClassical = defineCollection({
  loader: glob({ pattern: "**/*.md", base: "./src/content/daily-classical", generateId: uniqueId }),
  schema: z.object({
    title: z.string(),
    locale: z.enum(['zh', 'en']),
    slug: z.string(),
    date: z.date(),
    composer: composerSchema,
    period: z.string(),
    year: z.string(),
    coverImage: z.string().optional(),
    notableRecordings: z.array(z.object({
      performer: z.string(),
      label: z.string(),
      year: z.string(),
      notes: z.string().optional(),
      slug: z.string().optional(),
      url: z.string().optional(),
    })),
    tags: z.array(z.string()),
  }),
});

export const collections = { album, 'daily-classical': dailyClassical };

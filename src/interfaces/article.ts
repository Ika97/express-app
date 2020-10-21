import { Moment } from 'moment';
import { Document, Model } from 'mongoose';

export interface IArticleDocument extends Document {
  wordpressId: number;
  categories: [string];
  people: [string];
  defaultCategory: string;
  content: string;
  contentText: string;
  playerEmbed: string;
  inEpisode: string;
  episodeNumber: number;
  extraContent: number;
  excerpt: string;
  slug: string;
  title: string;
  createdAt: Date;
  modifiedAt: Date;
  type: string;
  imageUrl: string;
  order: number;
  status: string;
  path: string;
  seo: {
    title: string;
    description: string;
    keywords: string;
    featuredImage: string;
    openGraph: {
      'og:title': string;
      'og:description': string;
      'og:type': string;
    }
  };
  thumbnails: {
    full: string,
  };
}

export interface IArticleModel extends Model<IArticleDocument> {
  hasCategory: () => boolean;
  findById: (id) => any;
  findByWordpressId: (wordpressId) => object;
  findBySlug: (slug) => object;
  findAll: () => object[];
  findByYearMonth: (year: number, month: number) => object[];
  search: (query: IArticleQuery) => { totalCount: number, results: object[] };
  getAvailablePeopleCodes: () => string[];
  getFeaturedByCode: (code: string) => object[];
  getNextEpisode: (currentEpisodeNumber: number) => IArticleDocument;
}

export interface IArticleQuery {
  keywords?: string;
  person?: string;
  dateFrom?: Moment;
  dateTo?: Moment;
  order?: string;
  limit: number;
  page: number;
  categories?: string[];
  haveCriteria: boolean;
}

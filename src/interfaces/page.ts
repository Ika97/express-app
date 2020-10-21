import { Document, Model } from 'mongoose';

export interface IPageDocument extends Document {
  wordpressId: number;
  slug: string;
  title: string;
  path: string;

  // content
  content: string;
  contentText: string;
  excerpt: string;

  // meta - same as Route:meta
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

  // publications
  publications: [{
    publicationCode: string;
    level: string;
  }];

  defaultPublication: {
    publicationCode: string;
    level: string;
  };

  // tickers
  tickersText: string;
  tickers: [string];

  // categories
  defaultCategory: [string]; // I see a false need to look into
  categories: [string];

  // type
  type: string;
  public: boolean;
  status: string;
  order: number;
  createdAtWeekday: number;
  extraFeature: boolean;

  // assets
  imageUrl: string;
  pdfUrl: string;
  pdfOnly: boolean;
  interactivePdfUrl: string;

  relationships: {
    publications: [{
      linkedEntity: {
        collection: string;
        key: {
          wordpressId: number;
        }
      }
    }],
    defaultCategory: {
      linkedEntity: {
        collection: string;
        key: {
          wordpressId: number;
        }
      }
    },
    categories: [{
      linkedEntity: {
        collection: string;
        key: {
          wordpressId: number;
        }
      }
    }],
  };

  // dates
  createdAt: Date;
  modifiedAt: Date;
}

export interface IPageModel extends Model<IPageDocument> {
  getAuthor: (cb) => string;
  findById: (id) => any;
  findBySlug: (slug) => object;
  findByWordpressId: (wordpressId) => object;
}

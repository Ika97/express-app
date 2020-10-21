import { Document, Model } from 'mongoose';

export interface ISiteRouteDocument extends Document {
  // identity
  // _id: {type: ObjectId, readonly: true},
  layout: string;
  entryType: string;
  wordpressId: number;
  url: string;

  meta: {
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

  entity: {
    linkedEntity: {
      collection: string;
      key: {
        wordpressId: number;
      }
    }
  };

  entityType: string;
  public: boolean;
  header: {
    title: string;
    showHeader: boolean;
    secondaryHeader: boolean;
    backButton: boolean;
    style: string;
    theme: string;
    showBreadcrumbs: boolean;

    breadcrumbs: [{
      title: string;
      url: string;
    }],
  };

  blocks: [{
    block: {
      linkedEntity: {
        collection: string;
        key: {
          id: string;
          type: string;
        }
      }
    },
    container: {
      width: string;
      bottomGradient: string;
      topPadding: string;
      bottomPadding: string;
      topMargin: string;
      bottomMargin: string;
      wrapperBackground: string;
      contentBackground: string;
    }
  }];

  // dates
  // createdAt: Date;
  // modifiedAt: Date;
}

export interface ISiteRouteModel extends Model<ISiteRouteDocument> {
  findByPath: (path: string) => object;
}

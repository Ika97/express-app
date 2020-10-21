import { model, Schema } from 'mongoose';
import { IPageModel, IPageDocument } from '../interfaces/page';

const Entity = new Schema(
  {
    // _id
    // identity
    wordpressId: {type: Number, readonly: true},
    slug: {type: String, readonly: true},
    title: {type: String, readonly: true},
    path: {type: String, readonly: true},

    // content
    content: {type: String, readonly: true},
    contentText: {type: String, readonly: true},
    excerpt: {type: String, readonly: true},

    // meta - same as Route:meta
    seo: {
      title: {type: String, readonly: true},
      description: {type: String, readonly: true},
      keywords: {type: String, readonly: true},
      featuredImage: {type: String, readonly: true},
      openGraph: {
        'og:title': {type: String, readonly: true},
        'og:description': {type: String, readonly: true},
        'og:type': {type: String, readonly: true}
      }
    },

    // publications
    publications: [{
      publicationCode: { type: String, readonly: true },
      level: { type: String, readonly: true }
    }],

    defaultPublication: {
      publicationCode: { type: String, readonly: true },
      level: { type: String, readonly: true }
    },

    // tickers
    tickersText: {type: String, readonly: true},
    tickers: {type: [String], readonly: true},

    // categories
    defaultCategory: {type: [String], readonly: true}, // I see a false need to look into
    categories: {type: [String], readonly: true},

    // type
    type: {type: String, readonly: true},
    public: {type: Boolean, readonly: true},
    status: {type: String, readonly: true},
    order: {type: Number, readonly: true},
    createdAtWeekday: {type: Number, readonly: true},
    extraFeature: {type: Boolean, readonly: true},

    // assets
    imageUrl: {type: String, readonly: true},
    pdfUrl: {type: String, readonly: true},
    pdfOnly: {type: Boolean, readonly: true},
    interactivePdfUrl: {type: String, readonly: true},

    relationships: {
      publications: [{
        linkedEntity: {
          collection: {type: String, readonly: true},
          key: {
            wordpressId: {type: Number, readonly: true},
          }
        }
      }],
      defaultCategory: {
        linkedEntity: {
          collection: {type: String, readonly: true},
          key: {
            wordpressId: {type: Number, readonly: true},
          }
        }
      },
      categories: [{
        linkedEntity: {
          collection: {type: String, readonly: true},
          key: {
            wordpressId: {type: Number, readonly: true},
          }
        }
      }],
    },

    // dates
    createdAt: {type: Date, readonly: true},
    modifiedAt: {type: Date, readonly: true},
  },
  {
    autoIndex: false,
    safe: true,
    collection: 'PagesSIH',
    toObject: {
      virtuals: true
    },
    toJSON: {
      virtuals: true
    }
  }
);

Entity.methods.getAuthor = function(cb): string {
  return 'Author Placeholder';
};

Entity.statics.findById = async function(id): Promise<any> {
  let promise = this.findOne({ _id: id }).exec();
  return promise.then((entity) => {
    return entity;
  });
};

Entity.statics.findBySlug = async function(slug): Promise<object> {
  let promise = this.findOne({ slug: slug }).exec();
  return promise.then((entity) => {
    return entity;
  });
};

Entity.statics.findByWordpressId = async function(wordpressId): Promise<object> {
  let promise = this.findOne({ wordpressId: wordpressId }).exec();
  return promise.then((entity) => {
    return entity;
  });
};

export const Page: IPageModel = model<IPageDocument, IPageModel>('PageSIH', Entity);

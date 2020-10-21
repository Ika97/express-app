import { model, Schema } from 'mongoose';
import { ISiteRouteModel, ISiteRouteDocument } from '../interfaces/site-route';

const Entity = new Schema(
  {
    // identity
    // _id: {type: ObjectId, readonly: true},
    layout: {type: String, readonly: true},
    entryType: {type: String, readonly: true},
    wordpressId: {type: Number, readonly: true},
    url: {type: String, readonly: true},

    meta: {
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

    entity: {
      linkedEntity: {
        collection: {type: String, readonly: true},
        key: {
          wordpressId: {type: Number, readonly: true},
        }
      }
    },

    entityType: {type: String, readonly: true},
    public: {type: Boolean, readonly: true},
    header: {
      title: {type: String, readonly: true},
      showHeader: {type: Boolean, readonly: true},
      secondaryHeader: {type: Boolean, readonly: true},
      backButton: {type: Boolean, readonly: true},
      style: {type: String, readonly: true},
      theme: {type: String, readonly: true},
      showBreadcrumbs: {type: Boolean, readonly: true},

      breadcrumbs: [{
        title: { type: String, readonly: true },
        url: { type: String, readonly: true }
      }],
    },

    blocks: [{
      block: {
        linkedEntity: {
          collection: {type: String, readonly: true},
          key: {
            id: {type: String, readonly: true},
            type: {type: String, readonly: true},
          }
        }
      },
      container: {
        width: {type: String, readonly: true},
        bottomGradient: {type: String, readonly: true},
        topPadding: {type: String, readonly: true},
        bottomPadding: {type: String, readonly: true},
        topMargin: {type: String, readonly: true},
        bottomMargin: {type: String, readonly: true},
        wrapperBackground: {type: String, readonly: true},
        contentBackground: {type: String, readonly: true},
      }
    }],

    // dates
    // createdAt: {type: Date, readonly: true},
    // modifiedAt: {type: Date, readonly: true},
  },
  {
    autoIndex: false,
    safe: true,
    collection: 'Routes',
    toObject: {
      virtuals: true
    },
    toJSON: {
      virtuals: true
    }
  }
);

Entity.statics.findByPath = function(path): Promise<object> {
  let promise = this.findOne({ url: path }).exec();
  return promise.then((entity) => {
    return entity;
  });
};

export const SiteRoute: ISiteRouteModel = model<ISiteRouteDocument, ISiteRouteModel>('SiteRoute', Entity);

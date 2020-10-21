import { IArticleQuery, IArticleModel, IArticleDocument } from '../interfaces/article';
import * as moment from 'moment-timezone';
import { model, Schema } from 'mongoose';

const standardFields = 'wordpressId slug title path excerpt createdAt defaultCategory categories ' +
                       'inEpisode playerEmbed extraContent episodeNumber mappedPeople';

const Entity = new Schema(
  {
    wordpressId: {type: Number, readonly: true},
    categories: [{type: String, readonly: true}],
    people: [{type: String, readonly: true}],
    defaultCategory: [{type: String, readonly: true}],
    content: {type: String, default: '', readonly: true},
    contentText: {type: String, default: '', readonly: true},
    playerEmbed: {type: String, default: '', readonly: true},
    inEpisode: {type: String, default: '', readonly: true},
    episodeNumber: {type: Number, default: '', readonly: true},
    extraContent: {type: String, default: '', readonly: true},
    excerpt: {type: String, default: '', readonly: true},
    slug: {type: String, default: '', readonly: true},
    title: {type: String, default: '', readonly: true},
    createdAt: {type: Date, readonly: true},
    modifiedAt: {type: Date, readonly: true},
    type: {type: String, readonly: true},
    imageUrl: {type: String, readonly: true},
    order: {type: Number, readonly: true},
    status: {type: String, readonly: true},
    path: {type: String, readonly: true},
    seo: {
      title: {type: String, readonly: true},
      description: {type: String, readonly: true},
      keywords: {type: String, readonly: true},
      featuredImage: {type: String, readonly: true},
      openGraph: {
        'og:title': {type: String, readonly: true},
        'og:description': {type: String, readonly: true},
        'og:type': {type: String, readonly: true},
      }
    },
    thumbnails: {
      full: {type: String, readonly: true},
    },
  },
  {
    autoIndex: false,
    safe: true,
    collection: 'Episodes',
    toObject: {
      virtuals: true
    },
    toJSON: {
      virtuals: true
    }
  }
);

Entity.virtual('createdAtMoment').get(function() {
  let createdAt = this.createdAt;
  return moment(createdAt, 'YYYY-MM-DD HH:mm:ss.SSSZ').tz('America/New_York');
});

Entity.virtual('mappedPeople', {
  ref: 'Person',
  localField: 'people',
  foreignField: 'code',
  justOne: false
});

Entity.methods.hasCategory = function(slug): boolean {
  if (this.categories && this.categories.indexOf(slug) !== -1) {
    return true;
  } else {
    return false;
  }
};

Entity.statics.findById = async function(id): Promise<any> {
  return this.findOne({ _id: id })
    .select(standardFields)
    .exec()
    .then((entity) => {
      return entity;
    })
  ;
};

Entity.statics.findByWordpressId = async function(wordpressId): Promise<object> {
  return this.findOne({ wordpressId: wordpressId })
    .populate('mappedPeople')
    .exec()
    .then((entity) => {
      return entity;
    })
  ;
};

Entity.statics.getNextEpisode = async function(currentEpisodeNumber: number): Promise<object> {
  return this.findOne({ episodeNumber: { $gt: currentEpisodeNumber } })
    .sort({episodeNumber: 1})
    .populate('mappedPeople')
    .exec()
    .then((entity) => {
      return entity;
    })
    ;
};

Entity.statics.findBySlug = async function(slug): Promise<object> {
  return this.findOne({ slug: slug })
    .exec()
    .then((entity) => {
      return entity;
    })
  ;
};

Entity.statics.findAll = async function(): Promise<object[]> {
  return this.find({})
    .sort({createdAt: -1})
    .limit(10)
    .exec()
    .then((articles) => {
      return articles;
    })
  ;
};

Entity.statics.findByYearMonth = async function(year = 2018, month = 12): Promise<object[]> {
  let searchDate: any = moment(`${year} ${month}`, 'YYYY M');
  return this.find({})
    .where('createdAt')
    .gte(searchDate.toDate())
    .lte(searchDate.add(1, 'months').toDate())
    .select(standardFields)
    .limit(100)
    .sort({createdAt: -1})
    .exec()
    .then((articles) => {
      return articles;
    })
  ;
};

Entity.statics.search = async function(query: IArticleQuery): Promise<{totalCount: number, results: object[]}> {
  let searchQuery: any = {};

  if (query.dateFrom !== undefined || query.dateTo !== undefined) {
    searchQuery.createdAt = {};
  }

  if (query.dateFrom !== undefined) {
    searchQuery.createdAt.$gte = query.dateFrom.toDate();
  }

  if (query.dateTo !== undefined) {
    searchQuery.createdAt.$lte = query.dateTo.toDate();
  }

  if (query.keywords !== undefined) {
    searchQuery.$text = {
      $search: query.keywords
    };
  }

  if (query.person !== undefined) {
    searchQuery.people = {
      $in: [
        query.person
      ]
    };
  }

  if (query.categories !== undefined) {
    searchQuery.categories = {
      $in: query.categories
    };
  }

  let builtQuery = this.find(searchQuery);

  if (query.order !== undefined) {
    switch (query.order) {
      case 'createdAt:asc':
        builtQuery.sort({createdAt: 1});
        break;
      case 'createdAt:desc':
      default:
        builtQuery.sort({createdAt: -1});
    }
  } else {
    builtQuery.sort({createdAt: -1});
  }

  builtQuery.limit(query.limit).skip((query.page - 1) * query.limit);

  let result = await Promise.all([this.find(searchQuery).count(), builtQuery.populate('mappedPeople').exec()]);

  return {
    totalCount: result[0],
    results: result[1]
  };
};

Entity.statics.getAvailablePeopleCodes = async function(): Promise<string[]> {
  return this.find().distinct('people');
};

Entity.statics.getFeaturedByCode = async function(code: string): Promise<object[]> {
  return this.find({
    people: code
  }).populate('mappedPeople').exec();
};

export const Article: IArticleModel = model<IArticleDocument, IArticleModel>('Episode', Entity);

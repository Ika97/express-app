import { model, Schema } from 'mongoose';
import { IPersonQuery, IPersonModel, IPersonDocument } from '../interfaces/person';

const Entity = new Schema(
  {
    wordpressId: {type: Number, readonly: true},
    code: {type: String, readonly: true},
    name: {type: String, readonly: true},
    title: {type: String, readonly: true},
    description: {type: String, readonly: true},
    imageUrl: {type: String, readonly: true},
    bio: {type: String, readonly: true},
    role: {type: String, readonly: true},
  },
  {
    autoIndex: false,
    safe: true,
    collection: 'People',
    toObject: {
      virtuals: true
    },
    toJSON: {
      virtuals: true
    }
  }
);

Entity.statics.findByRole = async function(role: string): Promise<object[]> {
  return this.find({
    role: {
      $eq: role
    }
  }).exec();
};

Entity.statics.findByCodes = async function(codes: string[]): Promise<object[]> {
  return this.find({
    code: {
      $in: codes
    }
  }).exec();
};

Entity.statics.findByCode = async function(code: string): Promise<object> {
  return this.findOne({
    code: code
  }).exec();
};

Entity.statics.search = async function(query: IPersonQuery): Promise<{totalCount: number, results: object[]}> {
  let searchQuery: any = {};

  if (query.role !== undefined) {
    searchQuery.role = {
      $eq: query.role
    };
  }

  let builtQuery = this.find(searchQuery);

  if (query.order !== undefined) {
    switch (query.order) {
      case 'createdAt':
        builtQuery.sort({_id: 1});
        break;
      case 'name':
      default:
        builtQuery.sort({name: 1});
    }
  } else {
    builtQuery.sort({_id: -1});
  }
  builtQuery.limit(query.limit).skip((query.page - 1) * query.limit);

  let result = await Promise.all([this.find(searchQuery).count(), builtQuery.exec()]);

  return {
    totalCount: result[0],
    results: result[1]
  };
};

export const Person: IPersonModel = model<IPersonDocument, IPersonModel>('Person', Entity);

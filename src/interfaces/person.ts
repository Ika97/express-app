// import { Moment } from 'moment';
import { Document, Model } from 'mongoose';

export interface IPersonDocument extends Document {
  wordpressId: number;
  code: string;
  name: string;
  title: string;
  description: string;
  imageUrl: string;
  bio: string;
  role: string;
}

export interface IPersonModel extends Model<IPersonDocument> {
  findByRole: (role: string) => object[];
  findByCodes: (codes: string[]) => object[];
  findByCode: (code: string) => object;
  search: (query: IPersonQuery) => {totalCount: number, results: object[]};
}

export interface IPersonQuery {
  order?: string;
  limit: number;
  page: number;
  role: string;
  haveCriteria: boolean;
}

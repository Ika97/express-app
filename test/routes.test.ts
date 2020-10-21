import * as supertest from 'supertest';
import { app } from '../src/app';

console.log(process.env.COOKIE_SECRET);
describe('GET /', () => {
  it('should return 200 OK', () => {
    supertest(app).get('/').expect(200);
  });
});

import { Person } from '../../models/person.model';
import { logger } from '../../utils/logger';
import { IPersonQuery } from '../../interfaces/person';

export class PeopleHelper {
  private static _instance: PeopleHelper;

  public static getInstance(): PeopleHelper {
    if (!this._instance) {
      this._instance = new PeopleHelper();
    }

    return this._instance;
  }

  public getPeopleByRole = async (role: string) => {
    let people = await Person.findByRole(role);
    if (people && people.length > 0) {
      return people;
    } else {
      logger.error(`No people, role: "${role}"`);
      throw new Error('NO_ROLE');
    }
  }

  public getPeopleByCodes = async (codes: string[]) => {
    let people = await Person.findByCodes(codes);
    if (people && people.length > 0) {
      return people;
    } else {
      logger.error(`No people, codes: "${codes}"`);
      throw new Error('NO_CODES');
    }
  }

  public getPersonByCode = async (code: string) => {
    let person = await Person.findByCode(code);
    if (person) {
      return person;
    } else {
      throw new Error(`No person with code ${code}`);
    }
  }

  public search = async (query: IPersonQuery): Promise<{
    totalCount: number,
    results: object[],
  }> => {
    return Person.search(query);
  }
}

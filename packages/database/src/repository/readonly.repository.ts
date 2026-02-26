import {
  FindManyOptions,
  FindOneOptions,
  FindOptionsWhere,
  ObjectLiteral,
  Repository,
} from 'typeorm';

export class ReadOnlyRepository<T extends ObjectLiteral> {
  constructor(private readonly repo: Repository<T>) {}

  find(options?: FindManyOptions<T>): Promise<T[]> {
    return this.repo.find(options);
  }

  findOne(options: FindOneOptions<T>): Promise<T | null> {
    return this.repo.findOne(options);
  }

  findBy(where: FindOptionsWhere<T>): Promise<T[]> {
    return this.repo.findBy(where);
  }

  findOneBy(where: FindOptionsWhere<T>): Promise<T | null> {
    return this.repo.findOneBy(where);
  }

  count(options?: FindManyOptions<T>): Promise<number> {
    return this.repo.count(options);
  }

  createQueryBuilder(alias: string) {
    return this.repo.createQueryBuilder(alias);
  }
}

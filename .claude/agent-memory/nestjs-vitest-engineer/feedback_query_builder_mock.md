---
name: TypeORM createQueryBuilder mock pattern
description: How to mock TypeORM createQueryBuilder chains in this codebase — which methods to include and how to wire them
type: feedback
---

Always match the stub methods exactly to what the generator calls. The `makeQueryBuilder` factory returns an object where every chained method is `vi.fn().mockReturnThis()` and the terminal `getMany` is `vi.fn().mockResolvedValue(rows)`.

For `MvpPoolGenerator` the chain is: `innerJoin`, `innerJoinAndSelect`, `where`, `orderBy`, `getMany`.

For `FranchisePoolGenerator` the chain is: `innerJoinAndSelect`, `where`, `andWhere`, `orderBy`, `addOrderBy`, `getMany`.

The `mockSeasonRepository` is typed as `{ createQueryBuilder: ReturnType<typeof vi.fn> }` and cast `as any` when passed to `useValue`. Individual tests override it with `mockSeasonRepository.createQueryBuilder.mockReturnValue(makeQueryBuilder(rows))` — the module-level `beforeEach` wires a default so tests that only care about shape don't need to re-stub.

**Why:** Matching the stub shape to the exact call chain prevents silent `undefined` returns when a new method is called but not stubbed.

**How to apply:** Before writing a new generator spec, read the implementation and enumerate every chained QBuilder method call. Add exactly those methods (and no others) to `makeQueryBuilder`.

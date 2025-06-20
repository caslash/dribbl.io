// This file was overwritten by prisma-json-types-generator
// Report any issues to https://github.com/arthurfiorette/prisma-json-types-generator

declare global {
  namespace PrismaJson {
    // This namespace will always be empty. Definitions should be done by
    // you manually, and merged automatically by typescript. Make sure that
    // your declaration merging file is included in your tsconfig.json
    //
    // Learn more: https://github.com/arthurfiorette/prisma-json-types-generator/issues/143
    // Declaration Merging: https://www.typescriptlang.org/docs/handbook/declaration-merging.html
  }
}

/** A filter to be used against nullable List types. */
export type NullableListFilter<T> = {
  equals?: T | T[] | null;
  has?: T | null;
  hasEvery?: T[];
  hasSome?: T[];
  isEmpty?: boolean;
};

/** A type to determine how to update a json field */
export type UpdateInput<T> = T extends object ? { [P in keyof T]?: UpdateInput<T[P]> } : T;

/** A type to determine how to update a json[] field */
export type UpdateManyInput<T> = T | T[] | { set?: T[]; push?: T | T[] };

/** A type to determine how to create a json[] input */
export type CreateManyInput<T> = T | T[] | { set?: T[] };

/**
 * A typed version of NestedStringFilter, allowing narrowing of string types to
 * discriminated unions.
 */
export type TypedNestedStringFilter<S extends string> =
  //@ts-ignore - When Prisma.StringFilter is not present, this type is not used
  Prisma.StringFilter & {
    equals?: S;
    in?: S[];
    notIn?: S[];
    not?: TypedNestedStringFilter<S> | S;
  };

/**
 * A typed version of StringFilter, allowing narrowing of string types to discriminated
 * unions.
 */
export type TypedStringFilter<S extends string> =
  //@ts-ignore - When Prisma.StringFilter is not present, this type is not used
  Prisma.StringFilter & {
    equals?: S;
    in?: S[];
    notIn?: S[];
    not?: TypedNestedStringFilter<S> | S;
  };

/**
 * A typed version of NestedStringNullableFilter, allowing narrowing of string types to
 * discriminated unions.
 */
export type TypedNestedStringNullableFilter<S extends string> =
  //@ts-ignore - When Prisma.StringNullableFilter is not present, this type is not used
  Prisma.StringNullableFilter & {
    equals?: S | null;
    in?: S[] | null;
    notIn?: S[] | null;
    not?: TypedNestedStringNullableFilter<S> | S | null;
  };

/**
 * A typed version of StringNullableFilter, allowing narrowing of string types to
 * discriminated unions.
 */
export type TypedStringNullableFilter<S extends string> =
  //@ts-ignore - When Prisma.StringNullableFilter is not present, this type is not used
  Prisma.StringNullableFilter & {
    equals?: S | null;
    in?: S[] | null;
    notIn?: S[] | null;
    not?: TypedNestedStringNullableFilter<S> | S | null;
  };

/**
 * A typed version of NestedStringWithAggregatesFilter, allowing narrowing of string types
 * to discriminated unions.
 */
export type TypedNestedStringWithAggregatesFilter<S extends string> =
  //@ts-ignore - When Prisma.NestedStringWithAggregatesFilter is not present, this type is not used
  Prisma.NestedStringWithAggregatesFilter & {
    equals?: S;
    in?: S[];
    notIn?: S[];
    not?: TypedNestedStringWithAggregatesFilter<S> | S;
  };

/**
 * A typed version of StringWithAggregatesFilter, allowing narrowing of string types to
 * discriminated unions.
 */
export type TypedStringWithAggregatesFilter<S extends string> =
  //@ts-ignore - When Prisma.StringWithAggregatesFilter is not present, this type is not used
  Prisma.StringWithAggregatesFilter & {
    equals?: S;
    in?: S[];
    notIn?: S[];
    not?: TypedNestedStringWithAggregatesFilter<S> | S;
  };

/**
 * A typed version of NestedStringNullableWithAggregatesFilter, allowing narrowing of
 * string types to discriminated unions.
 */
export type TypedNestedStringNullableWithAggregatesFilter<S extends string> =
  //@ts-ignore - When Prisma.NestedStringNullableWithAggregatesFilter is not present, this type is not used
  Prisma.NestedStringNullableWithAggregatesFilter & {
    equals?: S | null;
    in?: S[] | null;
    notIn?: S[] | null;
    not?: TypedNestedStringNullableWithAggregatesFilter<S> | S | null;
  };

/**
 * A typed version of StringNullableWithAggregatesFilter, allowing narrowing of string
 * types to discriminated unions.
 */
export type TypedStringNullableWithAggregatesFilter<S extends string> =
  //@ts-ignore - When Prisma.StringNullableWithAggregatesFilter is not present, this type is not used
  Prisma.StringNullableWithAggregatesFilter & {
    equals?: S | null;
    in?: S[] | null;
    notIn?: S[] | null;
    not?: TypedNestedStringNullableWithAggregatesFilter<S> | S | null;
  };

/**
 * A typed version of StringFieldUpdateOperationsInput, allowing narrowing of string types
 * to discriminated unions.
 */
export type TypedStringFieldUpdateOperationsInput<S extends string> =
  //@ts-ignore - When Prisma.StringFieldUpdateOperationsInput is not present, this type is not used
  Prisma.StringFieldUpdateOperationsInput & {
    set?: S;
  };

/**
 * A typed version of NullableStringFieldUpdateOperationsInput, allowing narrowing of
 * string types to discriminated unions.
 */
export type TypedNullableStringFieldUpdateOperationsInput<S extends string> =
  //@ts-ignore - When Prisma.NullableStringFieldUpdateOperationsInput is not present, this type is not used
  Prisma.NullableStringFieldUpdateOperationsInput & {
    set?: S | null;
  };

/**
 * A typed version of StringNullableListFilter, allowing narrowing of string types to
 * discriminated unions.
 */
export type TypedStringNullableListFilter<S extends string> =
  //@ts-ignore - When Prisma.StringNullableListFilter is not present, this type is not used
  Prisma.StringNullableListFilter & {
    equals?: S[] | null;
    has?: S | null;
    hasEvery?: S[];
    hasSome?: S[];
  };

/**
 * A typed version of the input type to update a string[] field, allowing narrowing of
 * string types to discriminated unions.
 */
export type UpdateStringArrayInput<S extends string> = {
  set?: S[];
  push?: S | S[];
};

/**
 * A typed version of the input type to create a string[] field, allowing narrowing of
 * string types to discriminated unions.
 */
export type CreateStringArrayInput<S extends string> = {
  set?: S[];
};

/**
 * Client
**/

import * as runtime from './runtime/library.js';
import $Types = runtime.Types // general types
import $Public = runtime.Types.Public
import $Utils = runtime.Types.Utils
import $Extensions = runtime.Types.Extensions
import $Result = runtime.Types.Result

export type PrismaPromise<T> = $Public.PrismaPromise<T>


/**
 * Model Player
 * 
 */
export type Player = $Result.DefaultSelection<Prisma.$PlayerPayload>
/**
 * Model player_accolades
 * 
 */
export type player_accolades = $Result.DefaultSelection<Prisma.$player_accoladesPayload>

/**
 * ##  Prisma Client ʲˢ
 *
 * Type-safe database client for TypeScript & Node.js
 * @example
 * ```
 * const prisma = new PrismaClient()
 * // Fetch zero or more Players
 * const players = await prisma.player.findMany()
 * ```
 *
 *
 * Read more in our [docs](https://www.prisma.io/docs/reference/tools-and-interfaces/prisma-client).
 */
export class PrismaClient<
  ClientOptions extends Prisma.PrismaClientOptions = Prisma.PrismaClientOptions,
  U = 'log' extends keyof ClientOptions ? ClientOptions['log'] extends Array<Prisma.LogLevel | Prisma.LogDefinition> ? Prisma.GetEvents<ClientOptions['log']> : never : never,
  ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs
> {
  [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['other'] }

    /**
   * ##  Prisma Client ʲˢ
   *
   * Type-safe database client for TypeScript & Node.js
   * @example
   * ```
   * const prisma = new PrismaClient()
   * // Fetch zero or more Players
   * const players = await prisma.player.findMany()
   * ```
   *
   *
   * Read more in our [docs](https://www.prisma.io/docs/reference/tools-and-interfaces/prisma-client).
   */

  constructor(optionsArg ?: Prisma.Subset<ClientOptions, Prisma.PrismaClientOptions>);
  $on<V extends U>(eventType: V, callback: (event: V extends 'query' ? Prisma.QueryEvent : Prisma.LogEvent) => void): PrismaClient;

  /**
   * Connect with the database
   */
  $connect(): $Utils.JsPromise<void>;

  /**
   * Disconnect from the database
   */
  $disconnect(): $Utils.JsPromise<void>;

  /**
   * Add a middleware
   * @deprecated since 4.16.0. For new code, prefer client extensions instead.
   * @see https://pris.ly/d/extensions
   */
  $use(cb: Prisma.Middleware): void

/**
   * Executes a prepared raw query and returns the number of affected rows.
   * @example
   * ```
   * const result = await prisma.$executeRaw`UPDATE User SET cool = ${true} WHERE email = ${'user@email.com'};`
   * ```
   *
   * Read more in our [docs](https://www.prisma.io/docs/reference/tools-and-interfaces/prisma-client/raw-database-access).
   */
  $executeRaw<T = unknown>(query: TemplateStringsArray | Prisma.Sql, ...values: any[]): Prisma.PrismaPromise<number>;

  /**
   * Executes a raw query and returns the number of affected rows.
   * Susceptible to SQL injections, see documentation.
   * @example
   * ```
   * const result = await prisma.$executeRawUnsafe('UPDATE User SET cool = $1 WHERE email = $2 ;', true, 'user@email.com')
   * ```
   *
   * Read more in our [docs](https://www.prisma.io/docs/reference/tools-and-interfaces/prisma-client/raw-database-access).
   */
  $executeRawUnsafe<T = unknown>(query: string, ...values: any[]): Prisma.PrismaPromise<number>;

  /**
   * Performs a prepared raw query and returns the `SELECT` data.
   * @example
   * ```
   * const result = await prisma.$queryRaw`SELECT * FROM User WHERE id = ${1} OR email = ${'user@email.com'};`
   * ```
   *
   * Read more in our [docs](https://www.prisma.io/docs/reference/tools-and-interfaces/prisma-client/raw-database-access).
   */
  $queryRaw<T = unknown>(query: TemplateStringsArray | Prisma.Sql, ...values: any[]): Prisma.PrismaPromise<T>;

  /**
   * Performs a raw query and returns the `SELECT` data.
   * Susceptible to SQL injections, see documentation.
   * @example
   * ```
   * const result = await prisma.$queryRawUnsafe('SELECT * FROM User WHERE id = $1 OR email = $2;', 1, 'user@email.com')
   * ```
   *
   * Read more in our [docs](https://www.prisma.io/docs/reference/tools-and-interfaces/prisma-client/raw-database-access).
   */
  $queryRawUnsafe<T = unknown>(query: string, ...values: any[]): Prisma.PrismaPromise<T>;


  /**
   * Allows the running of a sequence of read/write operations that are guaranteed to either succeed or fail as a whole.
   * @example
   * ```
   * const [george, bob, alice] = await prisma.$transaction([
   *   prisma.user.create({ data: { name: 'George' } }),
   *   prisma.user.create({ data: { name: 'Bob' } }),
   *   prisma.user.create({ data: { name: 'Alice' } }),
   * ])
   * ```
   * 
   * Read more in our [docs](https://www.prisma.io/docs/concepts/components/prisma-client/transactions).
   */
  $transaction<P extends Prisma.PrismaPromise<any>[]>(arg: [...P], options?: { isolationLevel?: Prisma.TransactionIsolationLevel }): $Utils.JsPromise<runtime.Types.Utils.UnwrapTuple<P>>

  $transaction<R>(fn: (prisma: Omit<PrismaClient, runtime.ITXClientDenyList>) => $Utils.JsPromise<R>, options?: { maxWait?: number, timeout?: number, isolationLevel?: Prisma.TransactionIsolationLevel }): $Utils.JsPromise<R>


  $extends: $Extensions.ExtendsHook<"extends", Prisma.TypeMapCb<ClientOptions>, ExtArgs, $Utils.Call<Prisma.TypeMapCb<ClientOptions>, {
    extArgs: ExtArgs
  }>>

      /**
   * `prisma.player`: Exposes CRUD operations for the **Player** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more Players
    * const players = await prisma.player.findMany()
    * ```
    */
  get player(): Prisma.PlayerDelegate<ExtArgs, ClientOptions>;

  /**
   * `prisma.player_accolades`: Exposes CRUD operations for the **player_accolades** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more Player_accolades
    * const player_accolades = await prisma.player_accolades.findMany()
    * ```
    */
  get player_accolades(): Prisma.player_accoladesDelegate<ExtArgs, ClientOptions>;
}

export namespace Prisma {
  export import DMMF = runtime.DMMF

  export type PrismaPromise<T> = $Public.PrismaPromise<T>

  /**
   * Validator
   */
  export import validator = runtime.Public.validator

  /**
   * Prisma Errors
   */
  export import PrismaClientKnownRequestError = runtime.PrismaClientKnownRequestError
  export import PrismaClientUnknownRequestError = runtime.PrismaClientUnknownRequestError
  export import PrismaClientRustPanicError = runtime.PrismaClientRustPanicError
  export import PrismaClientInitializationError = runtime.PrismaClientInitializationError
  export import PrismaClientValidationError = runtime.PrismaClientValidationError

  /**
   * Re-export of sql-template-tag
   */
  export import sql = runtime.sqltag
  export import empty = runtime.empty
  export import join = runtime.join
  export import raw = runtime.raw
  export import Sql = runtime.Sql



  /**
   * Decimal.js
   */
  export import Decimal = runtime.Decimal

  export type DecimalJsLike = runtime.DecimalJsLike

  /**
   * Metrics
   */
  export type Metrics = runtime.Metrics
  export type Metric<T> = runtime.Metric<T>
  export type MetricHistogram = runtime.MetricHistogram
  export type MetricHistogramBucket = runtime.MetricHistogramBucket

  /**
  * Extensions
  */
  export import Extension = $Extensions.UserArgs
  export import getExtensionContext = runtime.Extensions.getExtensionContext
  export import Args = $Public.Args
  export import Payload = $Public.Payload
  export import Result = $Public.Result
  export import Exact = $Public.Exact

  /**
   * Prisma Client JS version: 6.7.0
   * Query Engine version: 3cff47a7f5d65c3ea74883f1d736e41d68ce91ed
   */
  export type PrismaVersion = {
    client: string
  }

  export const prismaVersion: PrismaVersion

  /**
   * Utility Types
   */


  export import JsonObject = runtime.JsonObject
  export import JsonArray = runtime.JsonArray
  export import JsonValue = runtime.JsonValue
  export import InputJsonObject = runtime.InputJsonObject
  export import InputJsonArray = runtime.InputJsonArray
  export import InputJsonValue = runtime.InputJsonValue

  /**
   * Types of the values used to represent different kinds of `null` values when working with JSON fields.
   *
   * @see https://www.prisma.io/docs/concepts/components/prisma-client/working-with-fields/working-with-json-fields#filtering-on-a-json-field
   */
  namespace NullTypes {
    /**
    * Type of `Prisma.DbNull`.
    *
    * You cannot use other instances of this class. Please use the `Prisma.DbNull` value.
    *
    * @see https://www.prisma.io/docs/concepts/components/prisma-client/working-with-fields/working-with-json-fields#filtering-on-a-json-field
    */
    class DbNull {
      private DbNull: never
      private constructor()
    }

    /**
    * Type of `Prisma.JsonNull`.
    *
    * You cannot use other instances of this class. Please use the `Prisma.JsonNull` value.
    *
    * @see https://www.prisma.io/docs/concepts/components/prisma-client/working-with-fields/working-with-json-fields#filtering-on-a-json-field
    */
    class JsonNull {
      private JsonNull: never
      private constructor()
    }

    /**
    * Type of `Prisma.AnyNull`.
    *
    * You cannot use other instances of this class. Please use the `Prisma.AnyNull` value.
    *
    * @see https://www.prisma.io/docs/concepts/components/prisma-client/working-with-fields/working-with-json-fields#filtering-on-a-json-field
    */
    class AnyNull {
      private AnyNull: never
      private constructor()
    }
  }

  /**
   * Helper for filtering JSON entries that have `null` on the database (empty on the db)
   *
   * @see https://www.prisma.io/docs/concepts/components/prisma-client/working-with-fields/working-with-json-fields#filtering-on-a-json-field
   */
  export const DbNull: NullTypes.DbNull

  /**
   * Helper for filtering JSON entries that have JSON `null` values (not empty on the db)
   *
   * @see https://www.prisma.io/docs/concepts/components/prisma-client/working-with-fields/working-with-json-fields#filtering-on-a-json-field
   */
  export const JsonNull: NullTypes.JsonNull

  /**
   * Helper for filtering JSON entries that are `Prisma.DbNull` or `Prisma.JsonNull`
   *
   * @see https://www.prisma.io/docs/concepts/components/prisma-client/working-with-fields/working-with-json-fields#filtering-on-a-json-field
   */
  export const AnyNull: NullTypes.AnyNull

  type SelectAndInclude = {
    select: any
    include: any
  }

  type SelectAndOmit = {
    select: any
    omit: any
  }

  /**
   * Get the type of the value, that the Promise holds.
   */
  export type PromiseType<T extends PromiseLike<any>> = T extends PromiseLike<infer U> ? U : T;

  /**
   * Get the return type of a function which returns a Promise.
   */
  export type PromiseReturnType<T extends (...args: any) => $Utils.JsPromise<any>> = PromiseType<ReturnType<T>>

  /**
   * From T, pick a set of properties whose keys are in the union K
   */
  type Prisma__Pick<T, K extends keyof T> = {
      [P in K]: T[P];
  };


  export type Enumerable<T> = T | Array<T>;

  export type RequiredKeys<T> = {
    [K in keyof T]-?: {} extends Prisma__Pick<T, K> ? never : K
  }[keyof T]

  export type TruthyKeys<T> = keyof {
    [K in keyof T as T[K] extends false | undefined | null ? never : K]: K
  }

  export type TrueKeys<T> = TruthyKeys<Prisma__Pick<T, RequiredKeys<T>>>

  /**
   * Subset
   * @desc From `T` pick properties that exist in `U`. Simple version of Intersection
   */
  export type Subset<T, U> = {
    [key in keyof T]: key extends keyof U ? T[key] : never;
  };

  /**
   * SelectSubset
   * @desc From `T` pick properties that exist in `U`. Simple version of Intersection.
   * Additionally, it validates, if both select and include are present. If the case, it errors.
   */
  export type SelectSubset<T, U> = {
    [key in keyof T]: key extends keyof U ? T[key] : never
  } &
    (T extends SelectAndInclude
      ? 'Please either choose `select` or `include`.'
      : T extends SelectAndOmit
        ? 'Please either choose `select` or `omit`.'
        : {})

  /**
   * Subset + Intersection
   * @desc From `T` pick properties that exist in `U` and intersect `K`
   */
  export type SubsetIntersection<T, U, K> = {
    [key in keyof T]: key extends keyof U ? T[key] : never
  } &
    K

  type Without<T, U> = { [P in Exclude<keyof T, keyof U>]?: never };

  /**
   * XOR is needed to have a real mutually exclusive union type
   * https://stackoverflow.com/questions/42123407/does-typescript-support-mutually-exclusive-types
   */
  type XOR<T, U> =
    T extends object ?
    U extends object ?
      (Without<T, U> & U) | (Without<U, T> & T)
    : U : T


  /**
   * Is T a Record?
   */
  type IsObject<T extends any> = T extends Array<any>
  ? False
  : T extends Date
  ? False
  : T extends Uint8Array
  ? False
  : T extends BigInt
  ? False
  : T extends object
  ? True
  : False


  /**
   * If it's T[], return T
   */
  export type UnEnumerate<T extends unknown> = T extends Array<infer U> ? U : T

  /**
   * From ts-toolbelt
   */

  type __Either<O extends object, K extends Key> = Omit<O, K> &
    {
      // Merge all but K
      [P in K]: Prisma__Pick<O, P & keyof O> // With K possibilities
    }[K]

  type EitherStrict<O extends object, K extends Key> = Strict<__Either<O, K>>

  type EitherLoose<O extends object, K extends Key> = ComputeRaw<__Either<O, K>>

  type _Either<
    O extends object,
    K extends Key,
    strict extends Boolean
  > = {
    1: EitherStrict<O, K>
    0: EitherLoose<O, K>
  }[strict]

  type Either<
    O extends object,
    K extends Key,
    strict extends Boolean = 1
  > = O extends unknown ? _Either<O, K, strict> : never

  export type Union = any

  type PatchUndefined<O extends object, O1 extends object> = {
    [K in keyof O]: O[K] extends undefined ? At<O1, K> : O[K]
  } & {}

  /** Helper Types for "Merge" **/
  export type IntersectOf<U extends Union> = (
    U extends unknown ? (k: U) => void : never
  ) extends (k: infer I) => void
    ? I
    : never

  export type Overwrite<O extends object, O1 extends object> = {
      [K in keyof O]: K extends keyof O1 ? O1[K] : O[K];
  } & {};

  type _Merge<U extends object> = IntersectOf<Overwrite<U, {
      [K in keyof U]-?: At<U, K>;
  }>>;

  type Key = string | number | symbol;
  type AtBasic<O extends object, K extends Key> = K extends keyof O ? O[K] : never;
  type AtStrict<O extends object, K extends Key> = O[K & keyof O];
  type AtLoose<O extends object, K extends Key> = O extends unknown ? AtStrict<O, K> : never;
  export type At<O extends object, K extends Key, strict extends Boolean = 1> = {
      1: AtStrict<O, K>;
      0: AtLoose<O, K>;
  }[strict];

  export type ComputeRaw<A extends any> = A extends Function ? A : {
    [K in keyof A]: A[K];
  } & {};

  export type OptionalFlat<O> = {
    [K in keyof O]?: O[K];
  } & {};

  type _Record<K extends keyof any, T> = {
    [P in K]: T;
  };

  // cause typescript not to expand types and preserve names
  type NoExpand<T> = T extends unknown ? T : never;

  // this type assumes the passed object is entirely optional
  type AtLeast<O extends object, K extends string> = NoExpand<
    O extends unknown
    ? | (K extends keyof O ? { [P in K]: O[P] } & O : O)
      | {[P in keyof O as P extends K ? P : never]-?: O[P]} & O
    : never>;

  type _Strict<U, _U = U> = U extends unknown ? U & OptionalFlat<_Record<Exclude<Keys<_U>, keyof U>, never>> : never;

  export type Strict<U extends object> = ComputeRaw<_Strict<U>>;
  /** End Helper Types for "Merge" **/

  export type Merge<U extends object> = ComputeRaw<_Merge<Strict<U>>>;

  /**
  A [[Boolean]]
  */
  export type Boolean = True | False

  // /**
  // 1
  // */
  export type True = 1

  /**
  0
  */
  export type False = 0

  export type Not<B extends Boolean> = {
    0: 1
    1: 0
  }[B]

  export type Extends<A1 extends any, A2 extends any> = [A1] extends [never]
    ? 0 // anything `never` is false
    : A1 extends A2
    ? 1
    : 0

  export type Has<U extends Union, U1 extends Union> = Not<
    Extends<Exclude<U1, U>, U1>
  >

  export type Or<B1 extends Boolean, B2 extends Boolean> = {
    0: {
      0: 0
      1: 1
    }
    1: {
      0: 1
      1: 1
    }
  }[B1][B2]

  export type Keys<U extends Union> = U extends unknown ? keyof U : never

  type Cast<A, B> = A extends B ? A : B;

  export const type: unique symbol;



  /**
   * Used by group by
   */

  export type GetScalarType<T, O> = O extends object ? {
    [P in keyof T]: P extends keyof O
      ? O[P]
      : never
  } : never

  type FieldPaths<
    T,
    U = Omit<T, '_avg' | '_sum' | '_count' | '_min' | '_max'>
  > = IsObject<T> extends True ? U : T

  type GetHavingFields<T> = {
    [K in keyof T]: Or<
      Or<Extends<'OR', K>, Extends<'AND', K>>,
      Extends<'NOT', K>
    > extends True
      ? // infer is only needed to not hit TS limit
        // based on the brilliant idea of Pierre-Antoine Mills
        // https://github.com/microsoft/TypeScript/issues/30188#issuecomment-478938437
        T[K] extends infer TK
        ? GetHavingFields<UnEnumerate<TK> extends object ? Merge<UnEnumerate<TK>> : never>
        : never
      : {} extends FieldPaths<T[K]>
      ? never
      : K
  }[keyof T]

  /**
   * Convert tuple to union
   */
  type _TupleToUnion<T> = T extends (infer E)[] ? E : never
  type TupleToUnion<K extends readonly any[]> = _TupleToUnion<K>
  type MaybeTupleToUnion<T> = T extends any[] ? TupleToUnion<T> : T

  /**
   * Like `Pick`, but additionally can also accept an array of keys
   */
  type PickEnumerable<T, K extends Enumerable<keyof T> | keyof T> = Prisma__Pick<T, MaybeTupleToUnion<K>>

  /**
   * Exclude all keys with underscores
   */
  type ExcludeUnderscoreKeys<T extends string> = T extends `_${string}` ? never : T


  export type FieldRef<Model, FieldType> = runtime.FieldRef<Model, FieldType>

  type FieldRefInputType<Model, FieldType> = Model extends never ? never : FieldRef<Model, FieldType>


  export const ModelName: {
    Player: 'Player',
    player_accolades: 'player_accolades'
  };

  export type ModelName = (typeof ModelName)[keyof typeof ModelName]


  export type Datasources = {
    db?: Datasource
  }

  interface TypeMapCb<ClientOptions = {}> extends $Utils.Fn<{extArgs: $Extensions.InternalArgs }, $Utils.Record<string, any>> {
    returns: Prisma.TypeMap<this['params']['extArgs'], ClientOptions extends { omit: infer OmitOptions } ? OmitOptions : {}>
  }

  export type TypeMap<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> = {
    globalOmitOptions: {
      omit: GlobalOmitOptions
    }
    meta: {
      modelProps: "player" | "player_accolades"
      txIsolationLevel: Prisma.TransactionIsolationLevel
    }
    model: {
      Player: {
        payload: Prisma.$PlayerPayload<ExtArgs>
        fields: Prisma.PlayerFieldRefs
        operations: {
          findUnique: {
            args: Prisma.PlayerFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$PlayerPayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.PlayerFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$PlayerPayload>
          }
          findFirst: {
            args: Prisma.PlayerFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$PlayerPayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.PlayerFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$PlayerPayload>
          }
          findMany: {
            args: Prisma.PlayerFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$PlayerPayload>[]
          }
          create: {
            args: Prisma.PlayerCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$PlayerPayload>
          }
          createMany: {
            args: Prisma.PlayerCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          createManyAndReturn: {
            args: Prisma.PlayerCreateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$PlayerPayload>[]
          }
          delete: {
            args: Prisma.PlayerDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$PlayerPayload>
          }
          update: {
            args: Prisma.PlayerUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$PlayerPayload>
          }
          deleteMany: {
            args: Prisma.PlayerDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.PlayerUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateManyAndReturn: {
            args: Prisma.PlayerUpdateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$PlayerPayload>[]
          }
          upsert: {
            args: Prisma.PlayerUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$PlayerPayload>
          }
          aggregate: {
            args: Prisma.PlayerAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregatePlayer>
          }
          groupBy: {
            args: Prisma.PlayerGroupByArgs<ExtArgs>
            result: $Utils.Optional<PlayerGroupByOutputType>[]
          }
          count: {
            args: Prisma.PlayerCountArgs<ExtArgs>
            result: $Utils.Optional<PlayerCountAggregateOutputType> | number
          }
        }
      }
      player_accolades: {
        payload: Prisma.$player_accoladesPayload<ExtArgs>
        fields: Prisma.player_accoladesFieldRefs
        operations: {
          findUnique: {
            args: Prisma.player_accoladesFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$player_accoladesPayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.player_accoladesFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$player_accoladesPayload>
          }
          findFirst: {
            args: Prisma.player_accoladesFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$player_accoladesPayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.player_accoladesFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$player_accoladesPayload>
          }
          findMany: {
            args: Prisma.player_accoladesFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$player_accoladesPayload>[]
          }
          create: {
            args: Prisma.player_accoladesCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$player_accoladesPayload>
          }
          createMany: {
            args: Prisma.player_accoladesCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          createManyAndReturn: {
            args: Prisma.player_accoladesCreateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$player_accoladesPayload>[]
          }
          delete: {
            args: Prisma.player_accoladesDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$player_accoladesPayload>
          }
          update: {
            args: Prisma.player_accoladesUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$player_accoladesPayload>
          }
          deleteMany: {
            args: Prisma.player_accoladesDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.player_accoladesUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateManyAndReturn: {
            args: Prisma.player_accoladesUpdateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$player_accoladesPayload>[]
          }
          upsert: {
            args: Prisma.player_accoladesUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$player_accoladesPayload>
          }
          aggregate: {
            args: Prisma.Player_accoladesAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregatePlayer_accolades>
          }
          groupBy: {
            args: Prisma.player_accoladesGroupByArgs<ExtArgs>
            result: $Utils.Optional<Player_accoladesGroupByOutputType>[]
          }
          count: {
            args: Prisma.player_accoladesCountArgs<ExtArgs>
            result: $Utils.Optional<Player_accoladesCountAggregateOutputType> | number
          }
        }
      }
    }
  } & {
    other: {
      payload: any
      operations: {
        $executeRaw: {
          args: [query: TemplateStringsArray | Prisma.Sql, ...values: any[]],
          result: any
        }
        $executeRawUnsafe: {
          args: [query: string, ...values: any[]],
          result: any
        }
        $queryRaw: {
          args: [query: TemplateStringsArray | Prisma.Sql, ...values: any[]],
          result: any
        }
        $queryRawUnsafe: {
          args: [query: string, ...values: any[]],
          result: any
        }
      }
    }
  }
  export const defineExtension: $Extensions.ExtendsHook<"define", Prisma.TypeMapCb, $Extensions.DefaultArgs>
  export type DefaultPrismaClient = PrismaClient
  export type ErrorFormat = 'pretty' | 'colorless' | 'minimal'
  export interface PrismaClientOptions {
    /**
     * Overwrites the datasource url from your schema.prisma file
     */
    datasources?: Datasources
    /**
     * Overwrites the datasource url from your schema.prisma file
     */
    datasourceUrl?: string
    /**
     * @default "colorless"
     */
    errorFormat?: ErrorFormat
    /**
     * @example
     * ```
     * // Defaults to stdout
     * log: ['query', 'info', 'warn', 'error']
     * 
     * // Emit as events
     * log: [
     *   { emit: 'stdout', level: 'query' },
     *   { emit: 'stdout', level: 'info' },
     *   { emit: 'stdout', level: 'warn' }
     *   { emit: 'stdout', level: 'error' }
     * ]
     * ```
     * Read more in our [docs](https://www.prisma.io/docs/reference/tools-and-interfaces/prisma-client/logging#the-log-option).
     */
    log?: (LogLevel | LogDefinition)[]
    /**
     * The default values for transactionOptions
     * maxWait ?= 2000
     * timeout ?= 5000
     */
    transactionOptions?: {
      maxWait?: number
      timeout?: number
      isolationLevel?: Prisma.TransactionIsolationLevel
    }
    /**
     * Global configuration for omitting model fields by default.
     * 
     * @example
     * ```
     * const prisma = new PrismaClient({
     *   omit: {
     *     user: {
     *       password: true
     *     }
     *   }
     * })
     * ```
     */
    omit?: Prisma.GlobalOmitConfig
  }
  export type GlobalOmitConfig = {
    player?: PlayerOmit
    player_accolades?: player_accoladesOmit
  }

  /* Types for Logging */
  export type LogLevel = 'info' | 'query' | 'warn' | 'error'
  export type LogDefinition = {
    level: LogLevel
    emit: 'stdout' | 'event'
  }

  export type GetLogType<T extends LogLevel | LogDefinition> = T extends LogDefinition ? T['emit'] extends 'event' ? T['level'] : never : never
  export type GetEvents<T extends any> = T extends Array<LogLevel | LogDefinition> ?
    GetLogType<T[0]> | GetLogType<T[1]> | GetLogType<T[2]> | GetLogType<T[3]>
    : never

  export type QueryEvent = {
    timestamp: Date
    query: string
    params: string
    duration: number
    target: string
  }

  export type LogEvent = {
    timestamp: Date
    message: string
    target: string
  }
  /* End Types for Logging */


  export type PrismaAction =
    | 'findUnique'
    | 'findUniqueOrThrow'
    | 'findMany'
    | 'findFirst'
    | 'findFirstOrThrow'
    | 'create'
    | 'createMany'
    | 'createManyAndReturn'
    | 'update'
    | 'updateMany'
    | 'updateManyAndReturn'
    | 'upsert'
    | 'delete'
    | 'deleteMany'
    | 'executeRaw'
    | 'queryRaw'
    | 'aggregate'
    | 'count'
    | 'runCommandRaw'
    | 'findRaw'
    | 'groupBy'

  /**
   * These options are being passed into the middleware as "params"
   */
  export type MiddlewareParams = {
    model?: ModelName
    action: PrismaAction
    args: any
    dataPath: string[]
    runInTransaction: boolean
  }

  /**
   * The `T` type makes sure, that the `return proceed` is not forgotten in the middleware implementation
   */
  export type Middleware<T = any> = (
    params: MiddlewareParams,
    next: (params: MiddlewareParams) => $Utils.JsPromise<T>,
  ) => $Utils.JsPromise<T>

  // tested in getLogLevel.test.ts
  export function getLogLevel(log: Array<LogLevel | LogDefinition>): LogLevel | undefined;

  /**
   * `PrismaClient` proxy available in interactive transactions.
   */
  export type TransactionClient = Omit<Prisma.DefaultPrismaClient, runtime.ITXClientDenyList>

  export type Datasource = {
    url?: string
  }

  /**
   * Count Types
   */



  /**
   * Models
   */

  /**
   * Model Player
   */

  export type AggregatePlayer = {
    _count: PlayerCountAggregateOutputType | null
    _avg: PlayerAvgAggregateOutputType | null
    _sum: PlayerSumAggregateOutputType | null
    _min: PlayerMinAggregateOutputType | null
    _max: PlayerMaxAggregateOutputType | null
  }

  export type PlayerAvgAggregateOutputType = {
    id: number | null
    season_exp: number | null
    from_year: number | null
    to_year: number | null
    total_games_played: number | null
  }

  export type PlayerSumAggregateOutputType = {
    id: number | null
    season_exp: number | null
    from_year: number | null
    to_year: number | null
    total_games_played: number | null
  }

  export type PlayerMinAggregateOutputType = {
    id: number | null
    first_name: string | null
    last_name: string | null
    display_first_last: string | null
    display_fi_last: string | null
    birthdate: Date | null
    school: string | null
    country: string | null
    height: string | null
    weight: string | null
    season_exp: number | null
    jersey: string | null
    position: string | null
    team_history: string | null
    is_active: boolean | null
    from_year: number | null
    to_year: number | null
    total_games_played: number | null
    draft_round: string | null
    draft_number: string | null
    draft_year: string | null
  }

  export type PlayerMaxAggregateOutputType = {
    id: number | null
    first_name: string | null
    last_name: string | null
    display_first_last: string | null
    display_fi_last: string | null
    birthdate: Date | null
    school: string | null
    country: string | null
    height: string | null
    weight: string | null
    season_exp: number | null
    jersey: string | null
    position: string | null
    team_history: string | null
    is_active: boolean | null
    from_year: number | null
    to_year: number | null
    total_games_played: number | null
    draft_round: string | null
    draft_number: string | null
    draft_year: string | null
  }

  export type PlayerCountAggregateOutputType = {
    id: number
    first_name: number
    last_name: number
    display_first_last: number
    display_fi_last: number
    birthdate: number
    school: number
    country: number
    height: number
    weight: number
    season_exp: number
    jersey: number
    position: number
    team_history: number
    is_active: number
    from_year: number
    to_year: number
    total_games_played: number
    draft_round: number
    draft_number: number
    draft_year: number
    _all: number
  }


  export type PlayerAvgAggregateInputType = {
    id?: true
    season_exp?: true
    from_year?: true
    to_year?: true
    total_games_played?: true
  }

  export type PlayerSumAggregateInputType = {
    id?: true
    season_exp?: true
    from_year?: true
    to_year?: true
    total_games_played?: true
  }

  export type PlayerMinAggregateInputType = {
    id?: true
    first_name?: true
    last_name?: true
    display_first_last?: true
    display_fi_last?: true
    birthdate?: true
    school?: true
    country?: true
    height?: true
    weight?: true
    season_exp?: true
    jersey?: true
    position?: true
    team_history?: true
    is_active?: true
    from_year?: true
    to_year?: true
    total_games_played?: true
    draft_round?: true
    draft_number?: true
    draft_year?: true
  }

  export type PlayerMaxAggregateInputType = {
    id?: true
    first_name?: true
    last_name?: true
    display_first_last?: true
    display_fi_last?: true
    birthdate?: true
    school?: true
    country?: true
    height?: true
    weight?: true
    season_exp?: true
    jersey?: true
    position?: true
    team_history?: true
    is_active?: true
    from_year?: true
    to_year?: true
    total_games_played?: true
    draft_round?: true
    draft_number?: true
    draft_year?: true
  }

  export type PlayerCountAggregateInputType = {
    id?: true
    first_name?: true
    last_name?: true
    display_first_last?: true
    display_fi_last?: true
    birthdate?: true
    school?: true
    country?: true
    height?: true
    weight?: true
    season_exp?: true
    jersey?: true
    position?: true
    team_history?: true
    is_active?: true
    from_year?: true
    to_year?: true
    total_games_played?: true
    draft_round?: true
    draft_number?: true
    draft_year?: true
    _all?: true
  }

  export type PlayerAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which Player to aggregate.
     */
    where?: PlayerWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Players to fetch.
     */
    orderBy?: PlayerOrderByWithRelationInput | PlayerOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: PlayerWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Players from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Players.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned Players
    **/
    _count?: true | PlayerCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to average
    **/
    _avg?: PlayerAvgAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to sum
    **/
    _sum?: PlayerSumAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: PlayerMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: PlayerMaxAggregateInputType
  }

  export type GetPlayerAggregateType<T extends PlayerAggregateArgs> = {
        [P in keyof T & keyof AggregatePlayer]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregatePlayer[P]>
      : GetScalarType<T[P], AggregatePlayer[P]>
  }




  export type PlayerGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: PlayerWhereInput
    orderBy?: PlayerOrderByWithAggregationInput | PlayerOrderByWithAggregationInput[]
    by: PlayerScalarFieldEnum[] | PlayerScalarFieldEnum
    having?: PlayerScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: PlayerCountAggregateInputType | true
    _avg?: PlayerAvgAggregateInputType
    _sum?: PlayerSumAggregateInputType
    _min?: PlayerMinAggregateInputType
    _max?: PlayerMaxAggregateInputType
  }

  export type PlayerGroupByOutputType = {
    id: number
    first_name: string | null
    last_name: string | null
    display_first_last: string | null
    display_fi_last: string | null
    birthdate: Date | null
    school: string | null
    country: string | null
    height: string | null
    weight: string | null
    season_exp: number | null
    jersey: string | null
    position: string | null
    team_history: string | null
    is_active: boolean | null
    from_year: number | null
    to_year: number | null
    total_games_played: number | null
    draft_round: string | null
    draft_number: string | null
    draft_year: string | null
    _count: PlayerCountAggregateOutputType | null
    _avg: PlayerAvgAggregateOutputType | null
    _sum: PlayerSumAggregateOutputType | null
    _min: PlayerMinAggregateOutputType | null
    _max: PlayerMaxAggregateOutputType | null
  }

  type GetPlayerGroupByPayload<T extends PlayerGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<PlayerGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof PlayerGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], PlayerGroupByOutputType[P]>
            : GetScalarType<T[P], PlayerGroupByOutputType[P]>
        }
      >
    >


  export type PlayerSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    first_name?: boolean
    last_name?: boolean
    display_first_last?: boolean
    display_fi_last?: boolean
    birthdate?: boolean
    school?: boolean
    country?: boolean
    height?: boolean
    weight?: boolean
    season_exp?: boolean
    jersey?: boolean
    position?: boolean
    team_history?: boolean
    is_active?: boolean
    from_year?: boolean
    to_year?: boolean
    total_games_played?: boolean
    draft_round?: boolean
    draft_number?: boolean
    draft_year?: boolean
    player_accolades?: boolean | Player$player_accoladesArgs<ExtArgs>
  }, ExtArgs["result"]["player"]>

  export type PlayerSelectCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    first_name?: boolean
    last_name?: boolean
    display_first_last?: boolean
    display_fi_last?: boolean
    birthdate?: boolean
    school?: boolean
    country?: boolean
    height?: boolean
    weight?: boolean
    season_exp?: boolean
    jersey?: boolean
    position?: boolean
    team_history?: boolean
    is_active?: boolean
    from_year?: boolean
    to_year?: boolean
    total_games_played?: boolean
    draft_round?: boolean
    draft_number?: boolean
    draft_year?: boolean
  }, ExtArgs["result"]["player"]>

  export type PlayerSelectUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    first_name?: boolean
    last_name?: boolean
    display_first_last?: boolean
    display_fi_last?: boolean
    birthdate?: boolean
    school?: boolean
    country?: boolean
    height?: boolean
    weight?: boolean
    season_exp?: boolean
    jersey?: boolean
    position?: boolean
    team_history?: boolean
    is_active?: boolean
    from_year?: boolean
    to_year?: boolean
    total_games_played?: boolean
    draft_round?: boolean
    draft_number?: boolean
    draft_year?: boolean
  }, ExtArgs["result"]["player"]>

  export type PlayerSelectScalar = {
    id?: boolean
    first_name?: boolean
    last_name?: boolean
    display_first_last?: boolean
    display_fi_last?: boolean
    birthdate?: boolean
    school?: boolean
    country?: boolean
    height?: boolean
    weight?: boolean
    season_exp?: boolean
    jersey?: boolean
    position?: boolean
    team_history?: boolean
    is_active?: boolean
    from_year?: boolean
    to_year?: boolean
    total_games_played?: boolean
    draft_round?: boolean
    draft_number?: boolean
    draft_year?: boolean
  }

  export type PlayerOmit<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetOmit<"id" | "first_name" | "last_name" | "display_first_last" | "display_fi_last" | "birthdate" | "school" | "country" | "height" | "weight" | "season_exp" | "jersey" | "position" | "team_history" | "is_active" | "from_year" | "to_year" | "total_games_played" | "draft_round" | "draft_number" | "draft_year", ExtArgs["result"]["player"]>
  export type PlayerInclude<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    player_accolades?: boolean | Player$player_accoladesArgs<ExtArgs>
  }
  export type PlayerIncludeCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {}
  export type PlayerIncludeUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {}

  export type $PlayerPayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "Player"
    objects: {
      player_accolades: Prisma.$player_accoladesPayload<ExtArgs> | null
    }
    scalars: $Extensions.GetPayloadResult<{
      id: number
      first_name: string | null
      last_name: string | null
      display_first_last: string | null
      display_fi_last: string | null
      birthdate: Date | null
      school: string | null
      country: string | null
      height: string | null
      weight: string | null
      season_exp: number | null
      jersey: string | null
      position: string | null
      team_history: string | null
      is_active: boolean | null
      from_year: number | null
      to_year: number | null
      total_games_played: number | null
      draft_round: string | null
      draft_number: string | null
      draft_year: string | null
    }, ExtArgs["result"]["player"]>
    composites: {}
  }

  type PlayerGetPayload<S extends boolean | null | undefined | PlayerDefaultArgs> = $Result.GetResult<Prisma.$PlayerPayload, S>

  type PlayerCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> =
    Omit<PlayerFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
      select?: PlayerCountAggregateInputType | true
    }

  export interface PlayerDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['Player'], meta: { name: 'Player' } }
    /**
     * Find zero or one Player that matches the filter.
     * @param {PlayerFindUniqueArgs} args - Arguments to find a Player
     * @example
     * // Get one Player
     * const player = await prisma.player.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends PlayerFindUniqueArgs>(args: SelectSubset<T, PlayerFindUniqueArgs<ExtArgs>>): Prisma__PlayerClient<$Result.GetResult<Prisma.$PlayerPayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find one Player that matches the filter or throw an error with `error.code='P2025'`
     * if no matches were found.
     * @param {PlayerFindUniqueOrThrowArgs} args - Arguments to find a Player
     * @example
     * // Get one Player
     * const player = await prisma.player.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends PlayerFindUniqueOrThrowArgs>(args: SelectSubset<T, PlayerFindUniqueOrThrowArgs<ExtArgs>>): Prisma__PlayerClient<$Result.GetResult<Prisma.$PlayerPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first Player that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {PlayerFindFirstArgs} args - Arguments to find a Player
     * @example
     * // Get one Player
     * const player = await prisma.player.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends PlayerFindFirstArgs>(args?: SelectSubset<T, PlayerFindFirstArgs<ExtArgs>>): Prisma__PlayerClient<$Result.GetResult<Prisma.$PlayerPayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first Player that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {PlayerFindFirstOrThrowArgs} args - Arguments to find a Player
     * @example
     * // Get one Player
     * const player = await prisma.player.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends PlayerFindFirstOrThrowArgs>(args?: SelectSubset<T, PlayerFindFirstOrThrowArgs<ExtArgs>>): Prisma__PlayerClient<$Result.GetResult<Prisma.$PlayerPayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find zero or more Players that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {PlayerFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all Players
     * const players = await prisma.player.findMany()
     * 
     * // Get first 10 Players
     * const players = await prisma.player.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const playerWithIdOnly = await prisma.player.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends PlayerFindManyArgs>(args?: SelectSubset<T, PlayerFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$PlayerPayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>

    /**
     * Create a Player.
     * @param {PlayerCreateArgs} args - Arguments to create a Player.
     * @example
     * // Create one Player
     * const Player = await prisma.player.create({
     *   data: {
     *     // ... data to create a Player
     *   }
     * })
     * 
     */
    create<T extends PlayerCreateArgs>(args: SelectSubset<T, PlayerCreateArgs<ExtArgs>>): Prisma__PlayerClient<$Result.GetResult<Prisma.$PlayerPayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Create many Players.
     * @param {PlayerCreateManyArgs} args - Arguments to create many Players.
     * @example
     * // Create many Players
     * const player = await prisma.player.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends PlayerCreateManyArgs>(args?: SelectSubset<T, PlayerCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create many Players and returns the data saved in the database.
     * @param {PlayerCreateManyAndReturnArgs} args - Arguments to create many Players.
     * @example
     * // Create many Players
     * const player = await prisma.player.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Create many Players and only return the `id`
     * const playerWithIdOnly = await prisma.player.createManyAndReturn({
     *   select: { id: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    createManyAndReturn<T extends PlayerCreateManyAndReturnArgs>(args?: SelectSubset<T, PlayerCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$PlayerPayload<ExtArgs>, T, "createManyAndReturn", GlobalOmitOptions>>

    /**
     * Delete a Player.
     * @param {PlayerDeleteArgs} args - Arguments to delete one Player.
     * @example
     * // Delete one Player
     * const Player = await prisma.player.delete({
     *   where: {
     *     // ... filter to delete one Player
     *   }
     * })
     * 
     */
    delete<T extends PlayerDeleteArgs>(args: SelectSubset<T, PlayerDeleteArgs<ExtArgs>>): Prisma__PlayerClient<$Result.GetResult<Prisma.$PlayerPayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Update one Player.
     * @param {PlayerUpdateArgs} args - Arguments to update one Player.
     * @example
     * // Update one Player
     * const player = await prisma.player.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends PlayerUpdateArgs>(args: SelectSubset<T, PlayerUpdateArgs<ExtArgs>>): Prisma__PlayerClient<$Result.GetResult<Prisma.$PlayerPayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Delete zero or more Players.
     * @param {PlayerDeleteManyArgs} args - Arguments to filter Players to delete.
     * @example
     * // Delete a few Players
     * const { count } = await prisma.player.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends PlayerDeleteManyArgs>(args?: SelectSubset<T, PlayerDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more Players.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {PlayerUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many Players
     * const player = await prisma.player.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends PlayerUpdateManyArgs>(args: SelectSubset<T, PlayerUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more Players and returns the data updated in the database.
     * @param {PlayerUpdateManyAndReturnArgs} args - Arguments to update many Players.
     * @example
     * // Update many Players
     * const player = await prisma.player.updateManyAndReturn({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Update zero or more Players and only return the `id`
     * const playerWithIdOnly = await prisma.player.updateManyAndReturn({
     *   select: { id: true },
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    updateManyAndReturn<T extends PlayerUpdateManyAndReturnArgs>(args: SelectSubset<T, PlayerUpdateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$PlayerPayload<ExtArgs>, T, "updateManyAndReturn", GlobalOmitOptions>>

    /**
     * Create or update one Player.
     * @param {PlayerUpsertArgs} args - Arguments to update or create a Player.
     * @example
     * // Update or create a Player
     * const player = await prisma.player.upsert({
     *   create: {
     *     // ... data to create a Player
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the Player we want to update
     *   }
     * })
     */
    upsert<T extends PlayerUpsertArgs>(args: SelectSubset<T, PlayerUpsertArgs<ExtArgs>>): Prisma__PlayerClient<$Result.GetResult<Prisma.$PlayerPayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>


    /**
     * Count the number of Players.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {PlayerCountArgs} args - Arguments to filter Players to count.
     * @example
     * // Count the number of Players
     * const count = await prisma.player.count({
     *   where: {
     *     // ... the filter for the Players we want to count
     *   }
     * })
    **/
    count<T extends PlayerCountArgs>(
      args?: Subset<T, PlayerCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], PlayerCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a Player.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {PlayerAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
     * @example
     * // Ordered by age ascending
     * // Where email contains prisma.io
     * // Limited to the 10 users
     * const aggregations = await prisma.user.aggregate({
     *   _avg: {
     *     age: true,
     *   },
     *   where: {
     *     email: {
     *       contains: "prisma.io",
     *     },
     *   },
     *   orderBy: {
     *     age: "asc",
     *   },
     *   take: 10,
     * })
    **/
    aggregate<T extends PlayerAggregateArgs>(args: Subset<T, PlayerAggregateArgs>): Prisma.PrismaPromise<GetPlayerAggregateType<T>>

    /**
     * Group by Player.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {PlayerGroupByArgs} args - Group by arguments.
     * @example
     * // Group by city, order by createdAt, get count
     * const result = await prisma.user.groupBy({
     *   by: ['city', 'createdAt'],
     *   orderBy: {
     *     createdAt: true
     *   },
     *   _count: {
     *     _all: true
     *   },
     * })
     * 
    **/
    groupBy<
      T extends PlayerGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: PlayerGroupByArgs['orderBy'] }
        : { orderBy?: PlayerGroupByArgs['orderBy'] },
      OrderFields extends ExcludeUnderscoreKeys<Keys<MaybeTupleToUnion<T['orderBy']>>>,
      ByFields extends MaybeTupleToUnion<T['by']>,
      ByValid extends Has<ByFields, OrderFields>,
      HavingFields extends GetHavingFields<T['having']>,
      HavingValid extends Has<ByFields, HavingFields>,
      ByEmpty extends T['by'] extends never[] ? True : False,
      InputErrors extends ByEmpty extends True
      ? `Error: "by" must not be empty.`
      : HavingValid extends False
      ? {
          [P in HavingFields]: P extends ByFields
            ? never
            : P extends string
            ? `Error: Field "${P}" used in "having" needs to be provided in "by".`
            : [
                Error,
                'Field ',
                P,
                ` in "having" needs to be provided in "by"`,
              ]
        }[HavingFields]
      : 'take' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "take", you also need to provide "orderBy"'
      : 'skip' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "skip", you also need to provide "orderBy"'
      : ByValid extends True
      ? {}
      : {
          [P in OrderFields]: P extends ByFields
            ? never
            : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
        }[OrderFields]
    >(args: SubsetIntersection<T, PlayerGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetPlayerGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the Player model
   */
  readonly fields: PlayerFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for Player.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__PlayerClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    player_accolades<T extends Player$player_accoladesArgs<ExtArgs> = {}>(args?: Subset<T, Player$player_accoladesArgs<ExtArgs>>): Prisma__player_accoladesClient<$Result.GetResult<Prisma.$player_accoladesPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>
    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): $Utils.JsPromise<TResult1 | TResult2>
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): $Utils.JsPromise<T | TResult>
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | undefined | null): $Utils.JsPromise<T>
  }




  /**
   * Fields of the Player model
   */
  interface PlayerFieldRefs {
    readonly id: FieldRef<"Player", 'Int'>
    readonly first_name: FieldRef<"Player", 'String'>
    readonly last_name: FieldRef<"Player", 'String'>
    readonly display_first_last: FieldRef<"Player", 'String'>
    readonly display_fi_last: FieldRef<"Player", 'String'>
    readonly birthdate: FieldRef<"Player", 'DateTime'>
    readonly school: FieldRef<"Player", 'String'>
    readonly country: FieldRef<"Player", 'String'>
    readonly height: FieldRef<"Player", 'String'>
    readonly weight: FieldRef<"Player", 'String'>
    readonly season_exp: FieldRef<"Player", 'Int'>
    readonly jersey: FieldRef<"Player", 'String'>
    readonly position: FieldRef<"Player", 'String'>
    readonly team_history: FieldRef<"Player", 'String'>
    readonly is_active: FieldRef<"Player", 'Boolean'>
    readonly from_year: FieldRef<"Player", 'Int'>
    readonly to_year: FieldRef<"Player", 'Int'>
    readonly total_games_played: FieldRef<"Player", 'Int'>
    readonly draft_round: FieldRef<"Player", 'String'>
    readonly draft_number: FieldRef<"Player", 'String'>
    readonly draft_year: FieldRef<"Player", 'String'>
  }
    

  // Custom InputTypes
  /**
   * Player findUnique
   */
  export type PlayerFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Player
     */
    select?: PlayerSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Player
     */
    omit?: PlayerOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: PlayerInclude<ExtArgs> | null
    /**
     * Filter, which Player to fetch.
     */
    where: PlayerWhereUniqueInput
  }

  /**
   * Player findUniqueOrThrow
   */
  export type PlayerFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Player
     */
    select?: PlayerSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Player
     */
    omit?: PlayerOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: PlayerInclude<ExtArgs> | null
    /**
     * Filter, which Player to fetch.
     */
    where: PlayerWhereUniqueInput
  }

  /**
   * Player findFirst
   */
  export type PlayerFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Player
     */
    select?: PlayerSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Player
     */
    omit?: PlayerOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: PlayerInclude<ExtArgs> | null
    /**
     * Filter, which Player to fetch.
     */
    where?: PlayerWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Players to fetch.
     */
    orderBy?: PlayerOrderByWithRelationInput | PlayerOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for Players.
     */
    cursor?: PlayerWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Players from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Players.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Players.
     */
    distinct?: PlayerScalarFieldEnum | PlayerScalarFieldEnum[]
  }

  /**
   * Player findFirstOrThrow
   */
  export type PlayerFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Player
     */
    select?: PlayerSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Player
     */
    omit?: PlayerOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: PlayerInclude<ExtArgs> | null
    /**
     * Filter, which Player to fetch.
     */
    where?: PlayerWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Players to fetch.
     */
    orderBy?: PlayerOrderByWithRelationInput | PlayerOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for Players.
     */
    cursor?: PlayerWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Players from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Players.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Players.
     */
    distinct?: PlayerScalarFieldEnum | PlayerScalarFieldEnum[]
  }

  /**
   * Player findMany
   */
  export type PlayerFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Player
     */
    select?: PlayerSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Player
     */
    omit?: PlayerOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: PlayerInclude<ExtArgs> | null
    /**
     * Filter, which Players to fetch.
     */
    where?: PlayerWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Players to fetch.
     */
    orderBy?: PlayerOrderByWithRelationInput | PlayerOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing Players.
     */
    cursor?: PlayerWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Players from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Players.
     */
    skip?: number
    distinct?: PlayerScalarFieldEnum | PlayerScalarFieldEnum[]
  }

  /**
   * Player create
   */
  export type PlayerCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Player
     */
    select?: PlayerSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Player
     */
    omit?: PlayerOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: PlayerInclude<ExtArgs> | null
    /**
     * The data needed to create a Player.
     */
    data: XOR<PlayerCreateInput, PlayerUncheckedCreateInput>
  }

  /**
   * Player createMany
   */
  export type PlayerCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many Players.
     */
    data: PlayerCreateManyInput | PlayerCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * Player createManyAndReturn
   */
  export type PlayerCreateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Player
     */
    select?: PlayerSelectCreateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the Player
     */
    omit?: PlayerOmit<ExtArgs> | null
    /**
     * The data used to create many Players.
     */
    data: PlayerCreateManyInput | PlayerCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * Player update
   */
  export type PlayerUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Player
     */
    select?: PlayerSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Player
     */
    omit?: PlayerOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: PlayerInclude<ExtArgs> | null
    /**
     * The data needed to update a Player.
     */
    data: XOR<PlayerUpdateInput, PlayerUncheckedUpdateInput>
    /**
     * Choose, which Player to update.
     */
    where: PlayerWhereUniqueInput
  }

  /**
   * Player updateMany
   */
  export type PlayerUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update Players.
     */
    data: XOR<PlayerUpdateManyMutationInput, PlayerUncheckedUpdateManyInput>
    /**
     * Filter which Players to update
     */
    where?: PlayerWhereInput
    /**
     * Limit how many Players to update.
     */
    limit?: number
  }

  /**
   * Player updateManyAndReturn
   */
  export type PlayerUpdateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Player
     */
    select?: PlayerSelectUpdateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the Player
     */
    omit?: PlayerOmit<ExtArgs> | null
    /**
     * The data used to update Players.
     */
    data: XOR<PlayerUpdateManyMutationInput, PlayerUncheckedUpdateManyInput>
    /**
     * Filter which Players to update
     */
    where?: PlayerWhereInput
    /**
     * Limit how many Players to update.
     */
    limit?: number
  }

  /**
   * Player upsert
   */
  export type PlayerUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Player
     */
    select?: PlayerSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Player
     */
    omit?: PlayerOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: PlayerInclude<ExtArgs> | null
    /**
     * The filter to search for the Player to update in case it exists.
     */
    where: PlayerWhereUniqueInput
    /**
     * In case the Player found by the `where` argument doesn't exist, create a new Player with this data.
     */
    create: XOR<PlayerCreateInput, PlayerUncheckedCreateInput>
    /**
     * In case the Player was found with the provided `where` argument, update it with this data.
     */
    update: XOR<PlayerUpdateInput, PlayerUncheckedUpdateInput>
  }

  /**
   * Player delete
   */
  export type PlayerDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Player
     */
    select?: PlayerSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Player
     */
    omit?: PlayerOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: PlayerInclude<ExtArgs> | null
    /**
     * Filter which Player to delete.
     */
    where: PlayerWhereUniqueInput
  }

  /**
   * Player deleteMany
   */
  export type PlayerDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which Players to delete
     */
    where?: PlayerWhereInput
    /**
     * Limit how many Players to delete.
     */
    limit?: number
  }

  /**
   * Player.player_accolades
   */
  export type Player$player_accoladesArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the player_accolades
     */
    select?: player_accoladesSelect<ExtArgs> | null
    /**
     * Omit specific fields from the player_accolades
     */
    omit?: player_accoladesOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: player_accoladesInclude<ExtArgs> | null
    where?: player_accoladesWhereInput
  }

  /**
   * Player without action
   */
  export type PlayerDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Player
     */
    select?: PlayerSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Player
     */
    omit?: PlayerOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: PlayerInclude<ExtArgs> | null
  }


  /**
   * Model player_accolades
   */

  export type AggregatePlayer_accolades = {
    _count: Player_accoladesCountAggregateOutputType | null
    _avg: Player_accoladesAvgAggregateOutputType | null
    _sum: Player_accoladesSumAggregateOutputType | null
    _min: Player_accoladesMinAggregateOutputType | null
    _max: Player_accoladesMaxAggregateOutputType | null
  }

  export type Player_accoladesAvgAggregateOutputType = {
    player_id: number | null
  }

  export type Player_accoladesSumAggregateOutputType = {
    player_id: number | null
  }

  export type Player_accoladesMinAggregateOutputType = {
    player_id: number | null
  }

  export type Player_accoladesMaxAggregateOutputType = {
    player_id: number | null
  }

  export type Player_accoladesCountAggregateOutputType = {
    player_id: number
    accolades: number
    _all: number
  }


  export type Player_accoladesAvgAggregateInputType = {
    player_id?: true
  }

  export type Player_accoladesSumAggregateInputType = {
    player_id?: true
  }

  export type Player_accoladesMinAggregateInputType = {
    player_id?: true
  }

  export type Player_accoladesMaxAggregateInputType = {
    player_id?: true
  }

  export type Player_accoladesCountAggregateInputType = {
    player_id?: true
    accolades?: true
    _all?: true
  }

  export type Player_accoladesAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which player_accolades to aggregate.
     */
    where?: player_accoladesWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of player_accolades to fetch.
     */
    orderBy?: player_accoladesOrderByWithRelationInput | player_accoladesOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: player_accoladesWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` player_accolades from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` player_accolades.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned player_accolades
    **/
    _count?: true | Player_accoladesCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to average
    **/
    _avg?: Player_accoladesAvgAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to sum
    **/
    _sum?: Player_accoladesSumAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: Player_accoladesMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: Player_accoladesMaxAggregateInputType
  }

  export type GetPlayer_accoladesAggregateType<T extends Player_accoladesAggregateArgs> = {
        [P in keyof T & keyof AggregatePlayer_accolades]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregatePlayer_accolades[P]>
      : GetScalarType<T[P], AggregatePlayer_accolades[P]>
  }




  export type player_accoladesGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: player_accoladesWhereInput
    orderBy?: player_accoladesOrderByWithAggregationInput | player_accoladesOrderByWithAggregationInput[]
    by: Player_accoladesScalarFieldEnum[] | Player_accoladesScalarFieldEnum
    having?: player_accoladesScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: Player_accoladesCountAggregateInputType | true
    _avg?: Player_accoladesAvgAggregateInputType
    _sum?: Player_accoladesSumAggregateInputType
    _min?: Player_accoladesMinAggregateInputType
    _max?: Player_accoladesMaxAggregateInputType
  }

  export type Player_accoladesGroupByOutputType = {
    player_id: number
    accolades: JsonValue | null
    _count: Player_accoladesCountAggregateOutputType | null
    _avg: Player_accoladesAvgAggregateOutputType | null
    _sum: Player_accoladesSumAggregateOutputType | null
    _min: Player_accoladesMinAggregateOutputType | null
    _max: Player_accoladesMaxAggregateOutputType | null
  }

  type GetPlayer_accoladesGroupByPayload<T extends player_accoladesGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<Player_accoladesGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof Player_accoladesGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], Player_accoladesGroupByOutputType[P]>
            : GetScalarType<T[P], Player_accoladesGroupByOutputType[P]>
        }
      >
    >


  export type player_accoladesSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    player_id?: boolean
    accolades?: boolean
    player?: boolean | PlayerDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["player_accolades"]>

  export type player_accoladesSelectCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    player_id?: boolean
    accolades?: boolean
    player?: boolean | PlayerDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["player_accolades"]>

  export type player_accoladesSelectUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    player_id?: boolean
    accolades?: boolean
    player?: boolean | PlayerDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["player_accolades"]>

  export type player_accoladesSelectScalar = {
    player_id?: boolean
    accolades?: boolean
  }

  export type player_accoladesOmit<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetOmit<"player_id" | "accolades", ExtArgs["result"]["player_accolades"]>
  export type player_accoladesInclude<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    player?: boolean | PlayerDefaultArgs<ExtArgs>
  }
  export type player_accoladesIncludeCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    player?: boolean | PlayerDefaultArgs<ExtArgs>
  }
  export type player_accoladesIncludeUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    player?: boolean | PlayerDefaultArgs<ExtArgs>
  }

  export type $player_accoladesPayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "player_accolades"
    objects: {
      player: Prisma.$PlayerPayload<ExtArgs>
    }
    scalars: $Extensions.GetPayloadResult<{
      player_id: number
      /**
       * [PlayerAccoladeList]
       */
      accolades: PrismaJson.PlayerAccoladeList | null
    }, ExtArgs["result"]["player_accolades"]>
    composites: {}
  }

  type player_accoladesGetPayload<S extends boolean | null | undefined | player_accoladesDefaultArgs> = $Result.GetResult<Prisma.$player_accoladesPayload, S>

  type player_accoladesCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> =
    Omit<player_accoladesFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
      select?: Player_accoladesCountAggregateInputType | true
    }

  export interface player_accoladesDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['player_accolades'], meta: { name: 'player_accolades' } }
    /**
     * Find zero or one Player_accolades that matches the filter.
     * @param {player_accoladesFindUniqueArgs} args - Arguments to find a Player_accolades
     * @example
     * // Get one Player_accolades
     * const player_accolades = await prisma.player_accolades.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends player_accoladesFindUniqueArgs>(args: SelectSubset<T, player_accoladesFindUniqueArgs<ExtArgs>>): Prisma__player_accoladesClient<$Result.GetResult<Prisma.$player_accoladesPayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find one Player_accolades that matches the filter or throw an error with `error.code='P2025'`
     * if no matches were found.
     * @param {player_accoladesFindUniqueOrThrowArgs} args - Arguments to find a Player_accolades
     * @example
     * // Get one Player_accolades
     * const player_accolades = await prisma.player_accolades.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends player_accoladesFindUniqueOrThrowArgs>(args: SelectSubset<T, player_accoladesFindUniqueOrThrowArgs<ExtArgs>>): Prisma__player_accoladesClient<$Result.GetResult<Prisma.$player_accoladesPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first Player_accolades that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {player_accoladesFindFirstArgs} args - Arguments to find a Player_accolades
     * @example
     * // Get one Player_accolades
     * const player_accolades = await prisma.player_accolades.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends player_accoladesFindFirstArgs>(args?: SelectSubset<T, player_accoladesFindFirstArgs<ExtArgs>>): Prisma__player_accoladesClient<$Result.GetResult<Prisma.$player_accoladesPayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first Player_accolades that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {player_accoladesFindFirstOrThrowArgs} args - Arguments to find a Player_accolades
     * @example
     * // Get one Player_accolades
     * const player_accolades = await prisma.player_accolades.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends player_accoladesFindFirstOrThrowArgs>(args?: SelectSubset<T, player_accoladesFindFirstOrThrowArgs<ExtArgs>>): Prisma__player_accoladesClient<$Result.GetResult<Prisma.$player_accoladesPayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find zero or more Player_accolades that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {player_accoladesFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all Player_accolades
     * const player_accolades = await prisma.player_accolades.findMany()
     * 
     * // Get first 10 Player_accolades
     * const player_accolades = await prisma.player_accolades.findMany({ take: 10 })
     * 
     * // Only select the `player_id`
     * const player_accoladesWithPlayer_idOnly = await prisma.player_accolades.findMany({ select: { player_id: true } })
     * 
     */
    findMany<T extends player_accoladesFindManyArgs>(args?: SelectSubset<T, player_accoladesFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$player_accoladesPayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>

    /**
     * Create a Player_accolades.
     * @param {player_accoladesCreateArgs} args - Arguments to create a Player_accolades.
     * @example
     * // Create one Player_accolades
     * const Player_accolades = await prisma.player_accolades.create({
     *   data: {
     *     // ... data to create a Player_accolades
     *   }
     * })
     * 
     */
    create<T extends player_accoladesCreateArgs>(args: SelectSubset<T, player_accoladesCreateArgs<ExtArgs>>): Prisma__player_accoladesClient<$Result.GetResult<Prisma.$player_accoladesPayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Create many Player_accolades.
     * @param {player_accoladesCreateManyArgs} args - Arguments to create many Player_accolades.
     * @example
     * // Create many Player_accolades
     * const player_accolades = await prisma.player_accolades.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends player_accoladesCreateManyArgs>(args?: SelectSubset<T, player_accoladesCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create many Player_accolades and returns the data saved in the database.
     * @param {player_accoladesCreateManyAndReturnArgs} args - Arguments to create many Player_accolades.
     * @example
     * // Create many Player_accolades
     * const player_accolades = await prisma.player_accolades.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Create many Player_accolades and only return the `player_id`
     * const player_accoladesWithPlayer_idOnly = await prisma.player_accolades.createManyAndReturn({
     *   select: { player_id: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    createManyAndReturn<T extends player_accoladesCreateManyAndReturnArgs>(args?: SelectSubset<T, player_accoladesCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$player_accoladesPayload<ExtArgs>, T, "createManyAndReturn", GlobalOmitOptions>>

    /**
     * Delete a Player_accolades.
     * @param {player_accoladesDeleteArgs} args - Arguments to delete one Player_accolades.
     * @example
     * // Delete one Player_accolades
     * const Player_accolades = await prisma.player_accolades.delete({
     *   where: {
     *     // ... filter to delete one Player_accolades
     *   }
     * })
     * 
     */
    delete<T extends player_accoladesDeleteArgs>(args: SelectSubset<T, player_accoladesDeleteArgs<ExtArgs>>): Prisma__player_accoladesClient<$Result.GetResult<Prisma.$player_accoladesPayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Update one Player_accolades.
     * @param {player_accoladesUpdateArgs} args - Arguments to update one Player_accolades.
     * @example
     * // Update one Player_accolades
     * const player_accolades = await prisma.player_accolades.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends player_accoladesUpdateArgs>(args: SelectSubset<T, player_accoladesUpdateArgs<ExtArgs>>): Prisma__player_accoladesClient<$Result.GetResult<Prisma.$player_accoladesPayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Delete zero or more Player_accolades.
     * @param {player_accoladesDeleteManyArgs} args - Arguments to filter Player_accolades to delete.
     * @example
     * // Delete a few Player_accolades
     * const { count } = await prisma.player_accolades.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends player_accoladesDeleteManyArgs>(args?: SelectSubset<T, player_accoladesDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more Player_accolades.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {player_accoladesUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many Player_accolades
     * const player_accolades = await prisma.player_accolades.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends player_accoladesUpdateManyArgs>(args: SelectSubset<T, player_accoladesUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more Player_accolades and returns the data updated in the database.
     * @param {player_accoladesUpdateManyAndReturnArgs} args - Arguments to update many Player_accolades.
     * @example
     * // Update many Player_accolades
     * const player_accolades = await prisma.player_accolades.updateManyAndReturn({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Update zero or more Player_accolades and only return the `player_id`
     * const player_accoladesWithPlayer_idOnly = await prisma.player_accolades.updateManyAndReturn({
     *   select: { player_id: true },
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    updateManyAndReturn<T extends player_accoladesUpdateManyAndReturnArgs>(args: SelectSubset<T, player_accoladesUpdateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$player_accoladesPayload<ExtArgs>, T, "updateManyAndReturn", GlobalOmitOptions>>

    /**
     * Create or update one Player_accolades.
     * @param {player_accoladesUpsertArgs} args - Arguments to update or create a Player_accolades.
     * @example
     * // Update or create a Player_accolades
     * const player_accolades = await prisma.player_accolades.upsert({
     *   create: {
     *     // ... data to create a Player_accolades
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the Player_accolades we want to update
     *   }
     * })
     */
    upsert<T extends player_accoladesUpsertArgs>(args: SelectSubset<T, player_accoladesUpsertArgs<ExtArgs>>): Prisma__player_accoladesClient<$Result.GetResult<Prisma.$player_accoladesPayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>


    /**
     * Count the number of Player_accolades.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {player_accoladesCountArgs} args - Arguments to filter Player_accolades to count.
     * @example
     * // Count the number of Player_accolades
     * const count = await prisma.player_accolades.count({
     *   where: {
     *     // ... the filter for the Player_accolades we want to count
     *   }
     * })
    **/
    count<T extends player_accoladesCountArgs>(
      args?: Subset<T, player_accoladesCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], Player_accoladesCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a Player_accolades.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {Player_accoladesAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
     * @example
     * // Ordered by age ascending
     * // Where email contains prisma.io
     * // Limited to the 10 users
     * const aggregations = await prisma.user.aggregate({
     *   _avg: {
     *     age: true,
     *   },
     *   where: {
     *     email: {
     *       contains: "prisma.io",
     *     },
     *   },
     *   orderBy: {
     *     age: "asc",
     *   },
     *   take: 10,
     * })
    **/
    aggregate<T extends Player_accoladesAggregateArgs>(args: Subset<T, Player_accoladesAggregateArgs>): Prisma.PrismaPromise<GetPlayer_accoladesAggregateType<T>>

    /**
     * Group by Player_accolades.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {player_accoladesGroupByArgs} args - Group by arguments.
     * @example
     * // Group by city, order by createdAt, get count
     * const result = await prisma.user.groupBy({
     *   by: ['city', 'createdAt'],
     *   orderBy: {
     *     createdAt: true
     *   },
     *   _count: {
     *     _all: true
     *   },
     * })
     * 
    **/
    groupBy<
      T extends player_accoladesGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: player_accoladesGroupByArgs['orderBy'] }
        : { orderBy?: player_accoladesGroupByArgs['orderBy'] },
      OrderFields extends ExcludeUnderscoreKeys<Keys<MaybeTupleToUnion<T['orderBy']>>>,
      ByFields extends MaybeTupleToUnion<T['by']>,
      ByValid extends Has<ByFields, OrderFields>,
      HavingFields extends GetHavingFields<T['having']>,
      HavingValid extends Has<ByFields, HavingFields>,
      ByEmpty extends T['by'] extends never[] ? True : False,
      InputErrors extends ByEmpty extends True
      ? `Error: "by" must not be empty.`
      : HavingValid extends False
      ? {
          [P in HavingFields]: P extends ByFields
            ? never
            : P extends string
            ? `Error: Field "${P}" used in "having" needs to be provided in "by".`
            : [
                Error,
                'Field ',
                P,
                ` in "having" needs to be provided in "by"`,
              ]
        }[HavingFields]
      : 'take' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "take", you also need to provide "orderBy"'
      : 'skip' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "skip", you also need to provide "orderBy"'
      : ByValid extends True
      ? {}
      : {
          [P in OrderFields]: P extends ByFields
            ? never
            : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
        }[OrderFields]
    >(args: SubsetIntersection<T, player_accoladesGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetPlayer_accoladesGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the player_accolades model
   */
  readonly fields: player_accoladesFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for player_accolades.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__player_accoladesClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    player<T extends PlayerDefaultArgs<ExtArgs> = {}>(args?: Subset<T, PlayerDefaultArgs<ExtArgs>>): Prisma__PlayerClient<$Result.GetResult<Prisma.$PlayerPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions> | Null, Null, ExtArgs, GlobalOmitOptions>
    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): $Utils.JsPromise<TResult1 | TResult2>
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): $Utils.JsPromise<T | TResult>
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | undefined | null): $Utils.JsPromise<T>
  }




  /**
   * Fields of the player_accolades model
   */
  interface player_accoladesFieldRefs {
    readonly player_id: FieldRef<"player_accolades", 'Int'>
    readonly accolades: FieldRef<"player_accolades", 'Json'>
  }
    

  // Custom InputTypes
  /**
   * player_accolades findUnique
   */
  export type player_accoladesFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the player_accolades
     */
    select?: player_accoladesSelect<ExtArgs> | null
    /**
     * Omit specific fields from the player_accolades
     */
    omit?: player_accoladesOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: player_accoladesInclude<ExtArgs> | null
    /**
     * Filter, which player_accolades to fetch.
     */
    where: player_accoladesWhereUniqueInput
  }

  /**
   * player_accolades findUniqueOrThrow
   */
  export type player_accoladesFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the player_accolades
     */
    select?: player_accoladesSelect<ExtArgs> | null
    /**
     * Omit specific fields from the player_accolades
     */
    omit?: player_accoladesOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: player_accoladesInclude<ExtArgs> | null
    /**
     * Filter, which player_accolades to fetch.
     */
    where: player_accoladesWhereUniqueInput
  }

  /**
   * player_accolades findFirst
   */
  export type player_accoladesFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the player_accolades
     */
    select?: player_accoladesSelect<ExtArgs> | null
    /**
     * Omit specific fields from the player_accolades
     */
    omit?: player_accoladesOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: player_accoladesInclude<ExtArgs> | null
    /**
     * Filter, which player_accolades to fetch.
     */
    where?: player_accoladesWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of player_accolades to fetch.
     */
    orderBy?: player_accoladesOrderByWithRelationInput | player_accoladesOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for player_accolades.
     */
    cursor?: player_accoladesWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` player_accolades from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` player_accolades.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of player_accolades.
     */
    distinct?: Player_accoladesScalarFieldEnum | Player_accoladesScalarFieldEnum[]
  }

  /**
   * player_accolades findFirstOrThrow
   */
  export type player_accoladesFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the player_accolades
     */
    select?: player_accoladesSelect<ExtArgs> | null
    /**
     * Omit specific fields from the player_accolades
     */
    omit?: player_accoladesOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: player_accoladesInclude<ExtArgs> | null
    /**
     * Filter, which player_accolades to fetch.
     */
    where?: player_accoladesWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of player_accolades to fetch.
     */
    orderBy?: player_accoladesOrderByWithRelationInput | player_accoladesOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for player_accolades.
     */
    cursor?: player_accoladesWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` player_accolades from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` player_accolades.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of player_accolades.
     */
    distinct?: Player_accoladesScalarFieldEnum | Player_accoladesScalarFieldEnum[]
  }

  /**
   * player_accolades findMany
   */
  export type player_accoladesFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the player_accolades
     */
    select?: player_accoladesSelect<ExtArgs> | null
    /**
     * Omit specific fields from the player_accolades
     */
    omit?: player_accoladesOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: player_accoladesInclude<ExtArgs> | null
    /**
     * Filter, which player_accolades to fetch.
     */
    where?: player_accoladesWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of player_accolades to fetch.
     */
    orderBy?: player_accoladesOrderByWithRelationInput | player_accoladesOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing player_accolades.
     */
    cursor?: player_accoladesWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` player_accolades from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` player_accolades.
     */
    skip?: number
    distinct?: Player_accoladesScalarFieldEnum | Player_accoladesScalarFieldEnum[]
  }

  /**
   * player_accolades create
   */
  export type player_accoladesCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the player_accolades
     */
    select?: player_accoladesSelect<ExtArgs> | null
    /**
     * Omit specific fields from the player_accolades
     */
    omit?: player_accoladesOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: player_accoladesInclude<ExtArgs> | null
    /**
     * The data needed to create a player_accolades.
     */
    data: XOR<player_accoladesCreateInput, player_accoladesUncheckedCreateInput>
  }

  /**
   * player_accolades createMany
   */
  export type player_accoladesCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many player_accolades.
     */
    data: player_accoladesCreateManyInput | player_accoladesCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * player_accolades createManyAndReturn
   */
  export type player_accoladesCreateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the player_accolades
     */
    select?: player_accoladesSelectCreateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the player_accolades
     */
    omit?: player_accoladesOmit<ExtArgs> | null
    /**
     * The data used to create many player_accolades.
     */
    data: player_accoladesCreateManyInput | player_accoladesCreateManyInput[]
    skipDuplicates?: boolean
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: player_accoladesIncludeCreateManyAndReturn<ExtArgs> | null
  }

  /**
   * player_accolades update
   */
  export type player_accoladesUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the player_accolades
     */
    select?: player_accoladesSelect<ExtArgs> | null
    /**
     * Omit specific fields from the player_accolades
     */
    omit?: player_accoladesOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: player_accoladesInclude<ExtArgs> | null
    /**
     * The data needed to update a player_accolades.
     */
    data: XOR<player_accoladesUpdateInput, player_accoladesUncheckedUpdateInput>
    /**
     * Choose, which player_accolades to update.
     */
    where: player_accoladesWhereUniqueInput
  }

  /**
   * player_accolades updateMany
   */
  export type player_accoladesUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update player_accolades.
     */
    data: XOR<player_accoladesUpdateManyMutationInput, player_accoladesUncheckedUpdateManyInput>
    /**
     * Filter which player_accolades to update
     */
    where?: player_accoladesWhereInput
    /**
     * Limit how many player_accolades to update.
     */
    limit?: number
  }

  /**
   * player_accolades updateManyAndReturn
   */
  export type player_accoladesUpdateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the player_accolades
     */
    select?: player_accoladesSelectUpdateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the player_accolades
     */
    omit?: player_accoladesOmit<ExtArgs> | null
    /**
     * The data used to update player_accolades.
     */
    data: XOR<player_accoladesUpdateManyMutationInput, player_accoladesUncheckedUpdateManyInput>
    /**
     * Filter which player_accolades to update
     */
    where?: player_accoladesWhereInput
    /**
     * Limit how many player_accolades to update.
     */
    limit?: number
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: player_accoladesIncludeUpdateManyAndReturn<ExtArgs> | null
  }

  /**
   * player_accolades upsert
   */
  export type player_accoladesUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the player_accolades
     */
    select?: player_accoladesSelect<ExtArgs> | null
    /**
     * Omit specific fields from the player_accolades
     */
    omit?: player_accoladesOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: player_accoladesInclude<ExtArgs> | null
    /**
     * The filter to search for the player_accolades to update in case it exists.
     */
    where: player_accoladesWhereUniqueInput
    /**
     * In case the player_accolades found by the `where` argument doesn't exist, create a new player_accolades with this data.
     */
    create: XOR<player_accoladesCreateInput, player_accoladesUncheckedCreateInput>
    /**
     * In case the player_accolades was found with the provided `where` argument, update it with this data.
     */
    update: XOR<player_accoladesUpdateInput, player_accoladesUncheckedUpdateInput>
  }

  /**
   * player_accolades delete
   */
  export type player_accoladesDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the player_accolades
     */
    select?: player_accoladesSelect<ExtArgs> | null
    /**
     * Omit specific fields from the player_accolades
     */
    omit?: player_accoladesOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: player_accoladesInclude<ExtArgs> | null
    /**
     * Filter which player_accolades to delete.
     */
    where: player_accoladesWhereUniqueInput
  }

  /**
   * player_accolades deleteMany
   */
  export type player_accoladesDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which player_accolades to delete
     */
    where?: player_accoladesWhereInput
    /**
     * Limit how many player_accolades to delete.
     */
    limit?: number
  }

  /**
   * player_accolades without action
   */
  export type player_accoladesDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the player_accolades
     */
    select?: player_accoladesSelect<ExtArgs> | null
    /**
     * Omit specific fields from the player_accolades
     */
    omit?: player_accoladesOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: player_accoladesInclude<ExtArgs> | null
  }


  /**
   * Enums
   */

  export const TransactionIsolationLevel: {
    ReadUncommitted: 'ReadUncommitted',
    ReadCommitted: 'ReadCommitted',
    RepeatableRead: 'RepeatableRead',
    Serializable: 'Serializable'
  };

  export type TransactionIsolationLevel = (typeof TransactionIsolationLevel)[keyof typeof TransactionIsolationLevel]


  export const PlayerScalarFieldEnum: {
    id: 'id',
    first_name: 'first_name',
    last_name: 'last_name',
    display_first_last: 'display_first_last',
    display_fi_last: 'display_fi_last',
    birthdate: 'birthdate',
    school: 'school',
    country: 'country',
    height: 'height',
    weight: 'weight',
    season_exp: 'season_exp',
    jersey: 'jersey',
    position: 'position',
    team_history: 'team_history',
    is_active: 'is_active',
    from_year: 'from_year',
    to_year: 'to_year',
    total_games_played: 'total_games_played',
    draft_round: 'draft_round',
    draft_number: 'draft_number',
    draft_year: 'draft_year'
  };

  export type PlayerScalarFieldEnum = (typeof PlayerScalarFieldEnum)[keyof typeof PlayerScalarFieldEnum]


  export const Player_accoladesScalarFieldEnum: {
    player_id: 'player_id',
    accolades: 'accolades'
  };

  export type Player_accoladesScalarFieldEnum = (typeof Player_accoladesScalarFieldEnum)[keyof typeof Player_accoladesScalarFieldEnum]


  export const SortOrder: {
    asc: 'asc',
    desc: 'desc'
  };

  export type SortOrder = (typeof SortOrder)[keyof typeof SortOrder]


  export const NullableJsonNullValueInput: {
    DbNull: typeof DbNull,
    JsonNull: typeof JsonNull
  };

  export type NullableJsonNullValueInput = (typeof NullableJsonNullValueInput)[keyof typeof NullableJsonNullValueInput]


  export const QueryMode: {
    default: 'default',
    insensitive: 'insensitive'
  };

  export type QueryMode = (typeof QueryMode)[keyof typeof QueryMode]


  export const NullsOrder: {
    first: 'first',
    last: 'last'
  };

  export type NullsOrder = (typeof NullsOrder)[keyof typeof NullsOrder]


  export const JsonNullValueFilter: {
    DbNull: typeof DbNull,
    JsonNull: typeof JsonNull,
    AnyNull: typeof AnyNull
  };

  export type JsonNullValueFilter = (typeof JsonNullValueFilter)[keyof typeof JsonNullValueFilter]


  /**
   * Field references
   */


  /**
   * Reference to a field of type 'Int'
   */
  export type IntFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'Int'>
    


  /**
   * Reference to a field of type 'Int[]'
   */
  export type ListIntFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'Int[]'>
    


  /**
   * Reference to a field of type 'String'
   */
  export type StringFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'String'>
    


  /**
   * Reference to a field of type 'String[]'
   */
  export type ListStringFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'String[]'>
    


  /**
   * Reference to a field of type 'DateTime'
   */
  export type DateTimeFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'DateTime'>
    


  /**
   * Reference to a field of type 'DateTime[]'
   */
  export type ListDateTimeFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'DateTime[]'>
    


  /**
   * Reference to a field of type 'Boolean'
   */
  export type BooleanFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'Boolean'>
    


  /**
   * Reference to a field of type 'Json'
   */
  export type JsonFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'Json'>
    


  /**
   * Reference to a field of type 'QueryMode'
   */
  export type EnumQueryModeFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'QueryMode'>
    


  /**
   * Reference to a field of type 'Float'
   */
  export type FloatFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'Float'>
    


  /**
   * Reference to a field of type 'Float[]'
   */
  export type ListFloatFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'Float[]'>
    
  /**
   * Deep Input Types
   */


  export type PlayerWhereInput = {
    AND?: PlayerWhereInput | PlayerWhereInput[]
    OR?: PlayerWhereInput[]
    NOT?: PlayerWhereInput | PlayerWhereInput[]
    id?: IntFilter<"Player"> | number
    first_name?: StringNullableFilter<"Player"> | string | null
    last_name?: StringNullableFilter<"Player"> | string | null
    display_first_last?: StringNullableFilter<"Player"> | string | null
    display_fi_last?: StringNullableFilter<"Player"> | string | null
    birthdate?: DateTimeNullableFilter<"Player"> | Date | string | null
    school?: StringNullableFilter<"Player"> | string | null
    country?: StringNullableFilter<"Player"> | string | null
    height?: StringNullableFilter<"Player"> | string | null
    weight?: StringNullableFilter<"Player"> | string | null
    season_exp?: IntNullableFilter<"Player"> | number | null
    jersey?: StringNullableFilter<"Player"> | string | null
    position?: StringNullableFilter<"Player"> | string | null
    team_history?: StringNullableFilter<"Player"> | string | null
    is_active?: BoolNullableFilter<"Player"> | boolean | null
    from_year?: IntNullableFilter<"Player"> | number | null
    to_year?: IntNullableFilter<"Player"> | number | null
    total_games_played?: IntNullableFilter<"Player"> | number | null
    draft_round?: StringNullableFilter<"Player"> | string | null
    draft_number?: StringNullableFilter<"Player"> | string | null
    draft_year?: StringNullableFilter<"Player"> | string | null
    player_accolades?: XOR<Player_accoladesNullableScalarRelationFilter, player_accoladesWhereInput> | null
  }

  export type PlayerOrderByWithRelationInput = {
    id?: SortOrder
    first_name?: SortOrderInput | SortOrder
    last_name?: SortOrderInput | SortOrder
    display_first_last?: SortOrderInput | SortOrder
    display_fi_last?: SortOrderInput | SortOrder
    birthdate?: SortOrderInput | SortOrder
    school?: SortOrderInput | SortOrder
    country?: SortOrderInput | SortOrder
    height?: SortOrderInput | SortOrder
    weight?: SortOrderInput | SortOrder
    season_exp?: SortOrderInput | SortOrder
    jersey?: SortOrderInput | SortOrder
    position?: SortOrderInput | SortOrder
    team_history?: SortOrderInput | SortOrder
    is_active?: SortOrderInput | SortOrder
    from_year?: SortOrderInput | SortOrder
    to_year?: SortOrderInput | SortOrder
    total_games_played?: SortOrderInput | SortOrder
    draft_round?: SortOrderInput | SortOrder
    draft_number?: SortOrderInput | SortOrder
    draft_year?: SortOrderInput | SortOrder
    player_accolades?: player_accoladesOrderByWithRelationInput
  }

  export type PlayerWhereUniqueInput = Prisma.AtLeast<{
    id?: number
    AND?: PlayerWhereInput | PlayerWhereInput[]
    OR?: PlayerWhereInput[]
    NOT?: PlayerWhereInput | PlayerWhereInput[]
    first_name?: StringNullableFilter<"Player"> | string | null
    last_name?: StringNullableFilter<"Player"> | string | null
    display_first_last?: StringNullableFilter<"Player"> | string | null
    display_fi_last?: StringNullableFilter<"Player"> | string | null
    birthdate?: DateTimeNullableFilter<"Player"> | Date | string | null
    school?: StringNullableFilter<"Player"> | string | null
    country?: StringNullableFilter<"Player"> | string | null
    height?: StringNullableFilter<"Player"> | string | null
    weight?: StringNullableFilter<"Player"> | string | null
    season_exp?: IntNullableFilter<"Player"> | number | null
    jersey?: StringNullableFilter<"Player"> | string | null
    position?: StringNullableFilter<"Player"> | string | null
    team_history?: StringNullableFilter<"Player"> | string | null
    is_active?: BoolNullableFilter<"Player"> | boolean | null
    from_year?: IntNullableFilter<"Player"> | number | null
    to_year?: IntNullableFilter<"Player"> | number | null
    total_games_played?: IntNullableFilter<"Player"> | number | null
    draft_round?: StringNullableFilter<"Player"> | string | null
    draft_number?: StringNullableFilter<"Player"> | string | null
    draft_year?: StringNullableFilter<"Player"> | string | null
    player_accolades?: XOR<Player_accoladesNullableScalarRelationFilter, player_accoladesWhereInput> | null
  }, "id">

  export type PlayerOrderByWithAggregationInput = {
    id?: SortOrder
    first_name?: SortOrderInput | SortOrder
    last_name?: SortOrderInput | SortOrder
    display_first_last?: SortOrderInput | SortOrder
    display_fi_last?: SortOrderInput | SortOrder
    birthdate?: SortOrderInput | SortOrder
    school?: SortOrderInput | SortOrder
    country?: SortOrderInput | SortOrder
    height?: SortOrderInput | SortOrder
    weight?: SortOrderInput | SortOrder
    season_exp?: SortOrderInput | SortOrder
    jersey?: SortOrderInput | SortOrder
    position?: SortOrderInput | SortOrder
    team_history?: SortOrderInput | SortOrder
    is_active?: SortOrderInput | SortOrder
    from_year?: SortOrderInput | SortOrder
    to_year?: SortOrderInput | SortOrder
    total_games_played?: SortOrderInput | SortOrder
    draft_round?: SortOrderInput | SortOrder
    draft_number?: SortOrderInput | SortOrder
    draft_year?: SortOrderInput | SortOrder
    _count?: PlayerCountOrderByAggregateInput
    _avg?: PlayerAvgOrderByAggregateInput
    _max?: PlayerMaxOrderByAggregateInput
    _min?: PlayerMinOrderByAggregateInput
    _sum?: PlayerSumOrderByAggregateInput
  }

  export type PlayerScalarWhereWithAggregatesInput = {
    AND?: PlayerScalarWhereWithAggregatesInput | PlayerScalarWhereWithAggregatesInput[]
    OR?: PlayerScalarWhereWithAggregatesInput[]
    NOT?: PlayerScalarWhereWithAggregatesInput | PlayerScalarWhereWithAggregatesInput[]
    id?: IntWithAggregatesFilter<"Player"> | number
    first_name?: StringNullableWithAggregatesFilter<"Player"> | string | null
    last_name?: StringNullableWithAggregatesFilter<"Player"> | string | null
    display_first_last?: StringNullableWithAggregatesFilter<"Player"> | string | null
    display_fi_last?: StringNullableWithAggregatesFilter<"Player"> | string | null
    birthdate?: DateTimeNullableWithAggregatesFilter<"Player"> | Date | string | null
    school?: StringNullableWithAggregatesFilter<"Player"> | string | null
    country?: StringNullableWithAggregatesFilter<"Player"> | string | null
    height?: StringNullableWithAggregatesFilter<"Player"> | string | null
    weight?: StringNullableWithAggregatesFilter<"Player"> | string | null
    season_exp?: IntNullableWithAggregatesFilter<"Player"> | number | null
    jersey?: StringNullableWithAggregatesFilter<"Player"> | string | null
    position?: StringNullableWithAggregatesFilter<"Player"> | string | null
    team_history?: StringNullableWithAggregatesFilter<"Player"> | string | null
    is_active?: BoolNullableWithAggregatesFilter<"Player"> | boolean | null
    from_year?: IntNullableWithAggregatesFilter<"Player"> | number | null
    to_year?: IntNullableWithAggregatesFilter<"Player"> | number | null
    total_games_played?: IntNullableWithAggregatesFilter<"Player"> | number | null
    draft_round?: StringNullableWithAggregatesFilter<"Player"> | string | null
    draft_number?: StringNullableWithAggregatesFilter<"Player"> | string | null
    draft_year?: StringNullableWithAggregatesFilter<"Player"> | string | null
  }

  export type player_accoladesWhereInput = {
    AND?: player_accoladesWhereInput | player_accoladesWhereInput[]
    OR?: player_accoladesWhereInput[]
    NOT?: player_accoladesWhereInput | player_accoladesWhereInput[]
    player_id?: IntFilter<"player_accolades"> | number
    accolades?: JsonNullableFilter<"player_accolades">
    player?: XOR<PlayerScalarRelationFilter, PlayerWhereInput>
  }

  export type player_accoladesOrderByWithRelationInput = {
    player_id?: SortOrder
    accolades?: SortOrderInput | SortOrder
    player?: PlayerOrderByWithRelationInput
  }

  export type player_accoladesWhereUniqueInput = Prisma.AtLeast<{
    player_id?: number
    AND?: player_accoladesWhereInput | player_accoladesWhereInput[]
    OR?: player_accoladesWhereInput[]
    NOT?: player_accoladesWhereInput | player_accoladesWhereInput[]
    accolades?: JsonNullableFilter<"player_accolades">
    player?: XOR<PlayerScalarRelationFilter, PlayerWhereInput>
  }, "player_id">

  export type player_accoladesOrderByWithAggregationInput = {
    player_id?: SortOrder
    accolades?: SortOrderInput | SortOrder
    _count?: player_accoladesCountOrderByAggregateInput
    _avg?: player_accoladesAvgOrderByAggregateInput
    _max?: player_accoladesMaxOrderByAggregateInput
    _min?: player_accoladesMinOrderByAggregateInput
    _sum?: player_accoladesSumOrderByAggregateInput
  }

  export type player_accoladesScalarWhereWithAggregatesInput = {
    AND?: player_accoladesScalarWhereWithAggregatesInput | player_accoladesScalarWhereWithAggregatesInput[]
    OR?: player_accoladesScalarWhereWithAggregatesInput[]
    NOT?: player_accoladesScalarWhereWithAggregatesInput | player_accoladesScalarWhereWithAggregatesInput[]
    player_id?: IntWithAggregatesFilter<"player_accolades"> | number
    accolades?: JsonNullableWithAggregatesFilter<"player_accolades">
  }

  export type PlayerCreateInput = {
    id: number
    first_name?: string | null
    last_name?: string | null
    display_first_last?: string | null
    display_fi_last?: string | null
    birthdate?: Date | string | null
    school?: string | null
    country?: string | null
    height?: string | null
    weight?: string | null
    season_exp?: number | null
    jersey?: string | null
    position?: string | null
    team_history?: string | null
    is_active?: boolean | null
    from_year?: number | null
    to_year?: number | null
    total_games_played?: number | null
    draft_round?: string | null
    draft_number?: string | null
    draft_year?: string | null
    player_accolades?: player_accoladesCreateNestedOneWithoutPlayerInput
  }

  export type PlayerUncheckedCreateInput = {
    id: number
    first_name?: string | null
    last_name?: string | null
    display_first_last?: string | null
    display_fi_last?: string | null
    birthdate?: Date | string | null
    school?: string | null
    country?: string | null
    height?: string | null
    weight?: string | null
    season_exp?: number | null
    jersey?: string | null
    position?: string | null
    team_history?: string | null
    is_active?: boolean | null
    from_year?: number | null
    to_year?: number | null
    total_games_played?: number | null
    draft_round?: string | null
    draft_number?: string | null
    draft_year?: string | null
    player_accolades?: player_accoladesUncheckedCreateNestedOneWithoutPlayerInput
  }

  export type PlayerUpdateInput = {
    id?: IntFieldUpdateOperationsInput | number
    first_name?: NullableStringFieldUpdateOperationsInput | string | null
    last_name?: NullableStringFieldUpdateOperationsInput | string | null
    display_first_last?: NullableStringFieldUpdateOperationsInput | string | null
    display_fi_last?: NullableStringFieldUpdateOperationsInput | string | null
    birthdate?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    school?: NullableStringFieldUpdateOperationsInput | string | null
    country?: NullableStringFieldUpdateOperationsInput | string | null
    height?: NullableStringFieldUpdateOperationsInput | string | null
    weight?: NullableStringFieldUpdateOperationsInput | string | null
    season_exp?: NullableIntFieldUpdateOperationsInput | number | null
    jersey?: NullableStringFieldUpdateOperationsInput | string | null
    position?: NullableStringFieldUpdateOperationsInput | string | null
    team_history?: NullableStringFieldUpdateOperationsInput | string | null
    is_active?: NullableBoolFieldUpdateOperationsInput | boolean | null
    from_year?: NullableIntFieldUpdateOperationsInput | number | null
    to_year?: NullableIntFieldUpdateOperationsInput | number | null
    total_games_played?: NullableIntFieldUpdateOperationsInput | number | null
    draft_round?: NullableStringFieldUpdateOperationsInput | string | null
    draft_number?: NullableStringFieldUpdateOperationsInput | string | null
    draft_year?: NullableStringFieldUpdateOperationsInput | string | null
    player_accolades?: player_accoladesUpdateOneWithoutPlayerNestedInput
  }

  export type PlayerUncheckedUpdateInput = {
    id?: IntFieldUpdateOperationsInput | number
    first_name?: NullableStringFieldUpdateOperationsInput | string | null
    last_name?: NullableStringFieldUpdateOperationsInput | string | null
    display_first_last?: NullableStringFieldUpdateOperationsInput | string | null
    display_fi_last?: NullableStringFieldUpdateOperationsInput | string | null
    birthdate?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    school?: NullableStringFieldUpdateOperationsInput | string | null
    country?: NullableStringFieldUpdateOperationsInput | string | null
    height?: NullableStringFieldUpdateOperationsInput | string | null
    weight?: NullableStringFieldUpdateOperationsInput | string | null
    season_exp?: NullableIntFieldUpdateOperationsInput | number | null
    jersey?: NullableStringFieldUpdateOperationsInput | string | null
    position?: NullableStringFieldUpdateOperationsInput | string | null
    team_history?: NullableStringFieldUpdateOperationsInput | string | null
    is_active?: NullableBoolFieldUpdateOperationsInput | boolean | null
    from_year?: NullableIntFieldUpdateOperationsInput | number | null
    to_year?: NullableIntFieldUpdateOperationsInput | number | null
    total_games_played?: NullableIntFieldUpdateOperationsInput | number | null
    draft_round?: NullableStringFieldUpdateOperationsInput | string | null
    draft_number?: NullableStringFieldUpdateOperationsInput | string | null
    draft_year?: NullableStringFieldUpdateOperationsInput | string | null
    player_accolades?: player_accoladesUncheckedUpdateOneWithoutPlayerNestedInput
  }

  export type PlayerCreateManyInput = {
    id: number
    first_name?: string | null
    last_name?: string | null
    display_first_last?: string | null
    display_fi_last?: string | null
    birthdate?: Date | string | null
    school?: string | null
    country?: string | null
    height?: string | null
    weight?: string | null
    season_exp?: number | null
    jersey?: string | null
    position?: string | null
    team_history?: string | null
    is_active?: boolean | null
    from_year?: number | null
    to_year?: number | null
    total_games_played?: number | null
    draft_round?: string | null
    draft_number?: string | null
    draft_year?: string | null
  }

  export type PlayerUpdateManyMutationInput = {
    id?: IntFieldUpdateOperationsInput | number
    first_name?: NullableStringFieldUpdateOperationsInput | string | null
    last_name?: NullableStringFieldUpdateOperationsInput | string | null
    display_first_last?: NullableStringFieldUpdateOperationsInput | string | null
    display_fi_last?: NullableStringFieldUpdateOperationsInput | string | null
    birthdate?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    school?: NullableStringFieldUpdateOperationsInput | string | null
    country?: NullableStringFieldUpdateOperationsInput | string | null
    height?: NullableStringFieldUpdateOperationsInput | string | null
    weight?: NullableStringFieldUpdateOperationsInput | string | null
    season_exp?: NullableIntFieldUpdateOperationsInput | number | null
    jersey?: NullableStringFieldUpdateOperationsInput | string | null
    position?: NullableStringFieldUpdateOperationsInput | string | null
    team_history?: NullableStringFieldUpdateOperationsInput | string | null
    is_active?: NullableBoolFieldUpdateOperationsInput | boolean | null
    from_year?: NullableIntFieldUpdateOperationsInput | number | null
    to_year?: NullableIntFieldUpdateOperationsInput | number | null
    total_games_played?: NullableIntFieldUpdateOperationsInput | number | null
    draft_round?: NullableStringFieldUpdateOperationsInput | string | null
    draft_number?: NullableStringFieldUpdateOperationsInput | string | null
    draft_year?: NullableStringFieldUpdateOperationsInput | string | null
  }

  export type PlayerUncheckedUpdateManyInput = {
    id?: IntFieldUpdateOperationsInput | number
    first_name?: NullableStringFieldUpdateOperationsInput | string | null
    last_name?: NullableStringFieldUpdateOperationsInput | string | null
    display_first_last?: NullableStringFieldUpdateOperationsInput | string | null
    display_fi_last?: NullableStringFieldUpdateOperationsInput | string | null
    birthdate?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    school?: NullableStringFieldUpdateOperationsInput | string | null
    country?: NullableStringFieldUpdateOperationsInput | string | null
    height?: NullableStringFieldUpdateOperationsInput | string | null
    weight?: NullableStringFieldUpdateOperationsInput | string | null
    season_exp?: NullableIntFieldUpdateOperationsInput | number | null
    jersey?: NullableStringFieldUpdateOperationsInput | string | null
    position?: NullableStringFieldUpdateOperationsInput | string | null
    team_history?: NullableStringFieldUpdateOperationsInput | string | null
    is_active?: NullableBoolFieldUpdateOperationsInput | boolean | null
    from_year?: NullableIntFieldUpdateOperationsInput | number | null
    to_year?: NullableIntFieldUpdateOperationsInput | number | null
    total_games_played?: NullableIntFieldUpdateOperationsInput | number | null
    draft_round?: NullableStringFieldUpdateOperationsInput | string | null
    draft_number?: NullableStringFieldUpdateOperationsInput | string | null
    draft_year?: NullableStringFieldUpdateOperationsInput | string | null
  }

  export type player_accoladesCreateInput = {
    accolades?: PrismaJson.PlayerAccoladeList | NullableJsonNullValueInput
    player: PlayerCreateNestedOneWithoutPlayer_accoladesInput
  }

  export type player_accoladesUncheckedCreateInput = {
    player_id: number
    accolades?: PrismaJson.PlayerAccoladeList | NullableJsonNullValueInput
  }

  export type player_accoladesUpdateInput = {
    accolades?: PrismaJson.PlayerAccoladeList | NullableJsonNullValueInput
    player?: PlayerUpdateOneRequiredWithoutPlayer_accoladesNestedInput
  }

  export type player_accoladesUncheckedUpdateInput = {
    player_id?: IntFieldUpdateOperationsInput | number
    accolades?: PrismaJson.PlayerAccoladeList | NullableJsonNullValueInput
  }

  export type player_accoladesCreateManyInput = {
    player_id: number
    accolades?: PrismaJson.PlayerAccoladeList | NullableJsonNullValueInput
  }

  export type player_accoladesUpdateManyMutationInput = {
    accolades?: PrismaJson.PlayerAccoladeList | NullableJsonNullValueInput
  }

  export type player_accoladesUncheckedUpdateManyInput = {
    player_id?: IntFieldUpdateOperationsInput | number
    accolades?: PrismaJson.PlayerAccoladeList | NullableJsonNullValueInput
  }

  export type IntFilter<$PrismaModel = never> = {
    equals?: number | IntFieldRefInput<$PrismaModel>
    in?: number[] | ListIntFieldRefInput<$PrismaModel>
    notIn?: number[] | ListIntFieldRefInput<$PrismaModel>
    lt?: number | IntFieldRefInput<$PrismaModel>
    lte?: number | IntFieldRefInput<$PrismaModel>
    gt?: number | IntFieldRefInput<$PrismaModel>
    gte?: number | IntFieldRefInput<$PrismaModel>
    not?: NestedIntFilter<$PrismaModel> | number
  }

  export type StringNullableFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel> | null
    in?: string[] | ListStringFieldRefInput<$PrismaModel> | null
    notIn?: string[] | ListStringFieldRefInput<$PrismaModel> | null
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    contains?: string | StringFieldRefInput<$PrismaModel>
    startsWith?: string | StringFieldRefInput<$PrismaModel>
    endsWith?: string | StringFieldRefInput<$PrismaModel>
    mode?: QueryMode
    not?: NestedStringNullableFilter<$PrismaModel> | string | null
  }

  export type DateTimeNullableFilter<$PrismaModel = never> = {
    equals?: Date | string | DateTimeFieldRefInput<$PrismaModel> | null
    in?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel> | null
    notIn?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel> | null
    lt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    lte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    not?: NestedDateTimeNullableFilter<$PrismaModel> | Date | string | null
  }

  export type IntNullableFilter<$PrismaModel = never> = {
    equals?: number | IntFieldRefInput<$PrismaModel> | null
    in?: number[] | ListIntFieldRefInput<$PrismaModel> | null
    notIn?: number[] | ListIntFieldRefInput<$PrismaModel> | null
    lt?: number | IntFieldRefInput<$PrismaModel>
    lte?: number | IntFieldRefInput<$PrismaModel>
    gt?: number | IntFieldRefInput<$PrismaModel>
    gte?: number | IntFieldRefInput<$PrismaModel>
    not?: NestedIntNullableFilter<$PrismaModel> | number | null
  }

  export type BoolNullableFilter<$PrismaModel = never> = {
    equals?: boolean | BooleanFieldRefInput<$PrismaModel> | null
    not?: NestedBoolNullableFilter<$PrismaModel> | boolean | null
  }

  export type Player_accoladesNullableScalarRelationFilter = {
    is?: player_accoladesWhereInput | null
    isNot?: player_accoladesWhereInput | null
  }

  export type SortOrderInput = {
    sort: SortOrder
    nulls?: NullsOrder
  }

  export type PlayerCountOrderByAggregateInput = {
    id?: SortOrder
    first_name?: SortOrder
    last_name?: SortOrder
    display_first_last?: SortOrder
    display_fi_last?: SortOrder
    birthdate?: SortOrder
    school?: SortOrder
    country?: SortOrder
    height?: SortOrder
    weight?: SortOrder
    season_exp?: SortOrder
    jersey?: SortOrder
    position?: SortOrder
    team_history?: SortOrder
    is_active?: SortOrder
    from_year?: SortOrder
    to_year?: SortOrder
    total_games_played?: SortOrder
    draft_round?: SortOrder
    draft_number?: SortOrder
    draft_year?: SortOrder
  }

  export type PlayerAvgOrderByAggregateInput = {
    id?: SortOrder
    season_exp?: SortOrder
    from_year?: SortOrder
    to_year?: SortOrder
    total_games_played?: SortOrder
  }

  export type PlayerMaxOrderByAggregateInput = {
    id?: SortOrder
    first_name?: SortOrder
    last_name?: SortOrder
    display_first_last?: SortOrder
    display_fi_last?: SortOrder
    birthdate?: SortOrder
    school?: SortOrder
    country?: SortOrder
    height?: SortOrder
    weight?: SortOrder
    season_exp?: SortOrder
    jersey?: SortOrder
    position?: SortOrder
    team_history?: SortOrder
    is_active?: SortOrder
    from_year?: SortOrder
    to_year?: SortOrder
    total_games_played?: SortOrder
    draft_round?: SortOrder
    draft_number?: SortOrder
    draft_year?: SortOrder
  }

  export type PlayerMinOrderByAggregateInput = {
    id?: SortOrder
    first_name?: SortOrder
    last_name?: SortOrder
    display_first_last?: SortOrder
    display_fi_last?: SortOrder
    birthdate?: SortOrder
    school?: SortOrder
    country?: SortOrder
    height?: SortOrder
    weight?: SortOrder
    season_exp?: SortOrder
    jersey?: SortOrder
    position?: SortOrder
    team_history?: SortOrder
    is_active?: SortOrder
    from_year?: SortOrder
    to_year?: SortOrder
    total_games_played?: SortOrder
    draft_round?: SortOrder
    draft_number?: SortOrder
    draft_year?: SortOrder
  }

  export type PlayerSumOrderByAggregateInput = {
    id?: SortOrder
    season_exp?: SortOrder
    from_year?: SortOrder
    to_year?: SortOrder
    total_games_played?: SortOrder
  }

  export type IntWithAggregatesFilter<$PrismaModel = never> = {
    equals?: number | IntFieldRefInput<$PrismaModel>
    in?: number[] | ListIntFieldRefInput<$PrismaModel>
    notIn?: number[] | ListIntFieldRefInput<$PrismaModel>
    lt?: number | IntFieldRefInput<$PrismaModel>
    lte?: number | IntFieldRefInput<$PrismaModel>
    gt?: number | IntFieldRefInput<$PrismaModel>
    gte?: number | IntFieldRefInput<$PrismaModel>
    not?: NestedIntWithAggregatesFilter<$PrismaModel> | number
    _count?: NestedIntFilter<$PrismaModel>
    _avg?: NestedFloatFilter<$PrismaModel>
    _sum?: NestedIntFilter<$PrismaModel>
    _min?: NestedIntFilter<$PrismaModel>
    _max?: NestedIntFilter<$PrismaModel>
  }

  export type StringNullableWithAggregatesFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel> | null
    in?: string[] | ListStringFieldRefInput<$PrismaModel> | null
    notIn?: string[] | ListStringFieldRefInput<$PrismaModel> | null
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    contains?: string | StringFieldRefInput<$PrismaModel>
    startsWith?: string | StringFieldRefInput<$PrismaModel>
    endsWith?: string | StringFieldRefInput<$PrismaModel>
    mode?: QueryMode
    not?: NestedStringNullableWithAggregatesFilter<$PrismaModel> | string | null
    _count?: NestedIntNullableFilter<$PrismaModel>
    _min?: NestedStringNullableFilter<$PrismaModel>
    _max?: NestedStringNullableFilter<$PrismaModel>
  }

  export type DateTimeNullableWithAggregatesFilter<$PrismaModel = never> = {
    equals?: Date | string | DateTimeFieldRefInput<$PrismaModel> | null
    in?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel> | null
    notIn?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel> | null
    lt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    lte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    not?: NestedDateTimeNullableWithAggregatesFilter<$PrismaModel> | Date | string | null
    _count?: NestedIntNullableFilter<$PrismaModel>
    _min?: NestedDateTimeNullableFilter<$PrismaModel>
    _max?: NestedDateTimeNullableFilter<$PrismaModel>
  }

  export type IntNullableWithAggregatesFilter<$PrismaModel = never> = {
    equals?: number | IntFieldRefInput<$PrismaModel> | null
    in?: number[] | ListIntFieldRefInput<$PrismaModel> | null
    notIn?: number[] | ListIntFieldRefInput<$PrismaModel> | null
    lt?: number | IntFieldRefInput<$PrismaModel>
    lte?: number | IntFieldRefInput<$PrismaModel>
    gt?: number | IntFieldRefInput<$PrismaModel>
    gte?: number | IntFieldRefInput<$PrismaModel>
    not?: NestedIntNullableWithAggregatesFilter<$PrismaModel> | number | null
    _count?: NestedIntNullableFilter<$PrismaModel>
    _avg?: NestedFloatNullableFilter<$PrismaModel>
    _sum?: NestedIntNullableFilter<$PrismaModel>
    _min?: NestedIntNullableFilter<$PrismaModel>
    _max?: NestedIntNullableFilter<$PrismaModel>
  }

  export type BoolNullableWithAggregatesFilter<$PrismaModel = never> = {
    equals?: boolean | BooleanFieldRefInput<$PrismaModel> | null
    not?: NestedBoolNullableWithAggregatesFilter<$PrismaModel> | boolean | null
    _count?: NestedIntNullableFilter<$PrismaModel>
    _min?: NestedBoolNullableFilter<$PrismaModel>
    _max?: NestedBoolNullableFilter<$PrismaModel>
  }
  export type JsonNullableFilter<$PrismaModel = never> =
    | PatchUndefined<
        Either<Required<JsonNullableFilterBase<$PrismaModel>>, Exclude<keyof Required<JsonNullableFilterBase<$PrismaModel>>, 'path'>>,
        Required<JsonNullableFilterBase<$PrismaModel>>
      >
    | OptionalFlat<Omit<Required<JsonNullableFilterBase<$PrismaModel>>, 'path'>>

  export type JsonNullableFilterBase<$PrismaModel = never> = {
    equals?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | JsonNullValueFilter
    path?: string[]
    mode?: QueryMode | EnumQueryModeFieldRefInput<$PrismaModel>
    string_contains?: string | StringFieldRefInput<$PrismaModel>
    string_starts_with?: string | StringFieldRefInput<$PrismaModel>
    string_ends_with?: string | StringFieldRefInput<$PrismaModel>
    array_starts_with?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | null
    array_ends_with?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | null
    array_contains?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | null
    lt?: InputJsonValue | JsonFieldRefInput<$PrismaModel>
    lte?: InputJsonValue | JsonFieldRefInput<$PrismaModel>
    gt?: InputJsonValue | JsonFieldRefInput<$PrismaModel>
    gte?: InputJsonValue | JsonFieldRefInput<$PrismaModel>
    not?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | JsonNullValueFilter
  }

  export type PlayerScalarRelationFilter = {
    is?: PlayerWhereInput
    isNot?: PlayerWhereInput
  }

  export type player_accoladesCountOrderByAggregateInput = {
    player_id?: SortOrder
    accolades?: SortOrder
  }

  export type player_accoladesAvgOrderByAggregateInput = {
    player_id?: SortOrder
  }

  export type player_accoladesMaxOrderByAggregateInput = {
    player_id?: SortOrder
  }

  export type player_accoladesMinOrderByAggregateInput = {
    player_id?: SortOrder
  }

  export type player_accoladesSumOrderByAggregateInput = {
    player_id?: SortOrder
  }
  export type JsonNullableWithAggregatesFilter<$PrismaModel = never> =
    | PatchUndefined<
        Either<Required<JsonNullableWithAggregatesFilterBase<$PrismaModel>>, Exclude<keyof Required<JsonNullableWithAggregatesFilterBase<$PrismaModel>>, 'path'>>,
        Required<JsonNullableWithAggregatesFilterBase<$PrismaModel>>
      >
    | OptionalFlat<Omit<Required<JsonNullableWithAggregatesFilterBase<$PrismaModel>>, 'path'>>

  export type JsonNullableWithAggregatesFilterBase<$PrismaModel = never> = {
    equals?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | JsonNullValueFilter
    path?: string[]
    mode?: QueryMode | EnumQueryModeFieldRefInput<$PrismaModel>
    string_contains?: string | StringFieldRefInput<$PrismaModel>
    string_starts_with?: string | StringFieldRefInput<$PrismaModel>
    string_ends_with?: string | StringFieldRefInput<$PrismaModel>
    array_starts_with?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | null
    array_ends_with?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | null
    array_contains?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | null
    lt?: InputJsonValue | JsonFieldRefInput<$PrismaModel>
    lte?: InputJsonValue | JsonFieldRefInput<$PrismaModel>
    gt?: InputJsonValue | JsonFieldRefInput<$PrismaModel>
    gte?: InputJsonValue | JsonFieldRefInput<$PrismaModel>
    not?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | JsonNullValueFilter
    _count?: NestedIntNullableFilter<$PrismaModel>
    _min?: NestedJsonNullableFilter<$PrismaModel>
    _max?: NestedJsonNullableFilter<$PrismaModel>
  }

  export type player_accoladesCreateNestedOneWithoutPlayerInput = {
    create?: XOR<player_accoladesCreateWithoutPlayerInput, player_accoladesUncheckedCreateWithoutPlayerInput>
    connectOrCreate?: player_accoladesCreateOrConnectWithoutPlayerInput
    connect?: player_accoladesWhereUniqueInput
  }

  export type player_accoladesUncheckedCreateNestedOneWithoutPlayerInput = {
    create?: XOR<player_accoladesCreateWithoutPlayerInput, player_accoladesUncheckedCreateWithoutPlayerInput>
    connectOrCreate?: player_accoladesCreateOrConnectWithoutPlayerInput
    connect?: player_accoladesWhereUniqueInput
  }

  export type IntFieldUpdateOperationsInput = {
    set?: number
    increment?: number
    decrement?: number
    multiply?: number
    divide?: number
  }

  export type NullableStringFieldUpdateOperationsInput = {
    set?: string | null
  }

  export type NullableDateTimeFieldUpdateOperationsInput = {
    set?: Date | string | null
  }

  export type NullableIntFieldUpdateOperationsInput = {
    set?: number | null
    increment?: number
    decrement?: number
    multiply?: number
    divide?: number
  }

  export type NullableBoolFieldUpdateOperationsInput = {
    set?: boolean | null
  }

  export type player_accoladesUpdateOneWithoutPlayerNestedInput = {
    create?: XOR<player_accoladesCreateWithoutPlayerInput, player_accoladesUncheckedCreateWithoutPlayerInput>
    connectOrCreate?: player_accoladesCreateOrConnectWithoutPlayerInput
    upsert?: player_accoladesUpsertWithoutPlayerInput
    disconnect?: player_accoladesWhereInput | boolean
    delete?: player_accoladesWhereInput | boolean
    connect?: player_accoladesWhereUniqueInput
    update?: XOR<XOR<player_accoladesUpdateToOneWithWhereWithoutPlayerInput, player_accoladesUpdateWithoutPlayerInput>, player_accoladesUncheckedUpdateWithoutPlayerInput>
  }

  export type player_accoladesUncheckedUpdateOneWithoutPlayerNestedInput = {
    create?: XOR<player_accoladesCreateWithoutPlayerInput, player_accoladesUncheckedCreateWithoutPlayerInput>
    connectOrCreate?: player_accoladesCreateOrConnectWithoutPlayerInput
    upsert?: player_accoladesUpsertWithoutPlayerInput
    disconnect?: player_accoladesWhereInput | boolean
    delete?: player_accoladesWhereInput | boolean
    connect?: player_accoladesWhereUniqueInput
    update?: XOR<XOR<player_accoladesUpdateToOneWithWhereWithoutPlayerInput, player_accoladesUpdateWithoutPlayerInput>, player_accoladesUncheckedUpdateWithoutPlayerInput>
  }

  export type PlayerCreateNestedOneWithoutPlayer_accoladesInput = {
    create?: XOR<PlayerCreateWithoutPlayer_accoladesInput, PlayerUncheckedCreateWithoutPlayer_accoladesInput>
    connectOrCreate?: PlayerCreateOrConnectWithoutPlayer_accoladesInput
    connect?: PlayerWhereUniqueInput
  }

  export type PlayerUpdateOneRequiredWithoutPlayer_accoladesNestedInput = {
    create?: XOR<PlayerCreateWithoutPlayer_accoladesInput, PlayerUncheckedCreateWithoutPlayer_accoladesInput>
    connectOrCreate?: PlayerCreateOrConnectWithoutPlayer_accoladesInput
    upsert?: PlayerUpsertWithoutPlayer_accoladesInput
    connect?: PlayerWhereUniqueInput
    update?: XOR<XOR<PlayerUpdateToOneWithWhereWithoutPlayer_accoladesInput, PlayerUpdateWithoutPlayer_accoladesInput>, PlayerUncheckedUpdateWithoutPlayer_accoladesInput>
  }

  export type NestedIntFilter<$PrismaModel = never> = {
    equals?: number | IntFieldRefInput<$PrismaModel>
    in?: number[] | ListIntFieldRefInput<$PrismaModel>
    notIn?: number[] | ListIntFieldRefInput<$PrismaModel>
    lt?: number | IntFieldRefInput<$PrismaModel>
    lte?: number | IntFieldRefInput<$PrismaModel>
    gt?: number | IntFieldRefInput<$PrismaModel>
    gte?: number | IntFieldRefInput<$PrismaModel>
    not?: NestedIntFilter<$PrismaModel> | number
  }

  export type NestedStringNullableFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel> | null
    in?: string[] | ListStringFieldRefInput<$PrismaModel> | null
    notIn?: string[] | ListStringFieldRefInput<$PrismaModel> | null
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    contains?: string | StringFieldRefInput<$PrismaModel>
    startsWith?: string | StringFieldRefInput<$PrismaModel>
    endsWith?: string | StringFieldRefInput<$PrismaModel>
    not?: NestedStringNullableFilter<$PrismaModel> | string | null
  }

  export type NestedDateTimeNullableFilter<$PrismaModel = never> = {
    equals?: Date | string | DateTimeFieldRefInput<$PrismaModel> | null
    in?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel> | null
    notIn?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel> | null
    lt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    lte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    not?: NestedDateTimeNullableFilter<$PrismaModel> | Date | string | null
  }

  export type NestedIntNullableFilter<$PrismaModel = never> = {
    equals?: number | IntFieldRefInput<$PrismaModel> | null
    in?: number[] | ListIntFieldRefInput<$PrismaModel> | null
    notIn?: number[] | ListIntFieldRefInput<$PrismaModel> | null
    lt?: number | IntFieldRefInput<$PrismaModel>
    lte?: number | IntFieldRefInput<$PrismaModel>
    gt?: number | IntFieldRefInput<$PrismaModel>
    gte?: number | IntFieldRefInput<$PrismaModel>
    not?: NestedIntNullableFilter<$PrismaModel> | number | null
  }

  export type NestedBoolNullableFilter<$PrismaModel = never> = {
    equals?: boolean | BooleanFieldRefInput<$PrismaModel> | null
    not?: NestedBoolNullableFilter<$PrismaModel> | boolean | null
  }

  export type NestedIntWithAggregatesFilter<$PrismaModel = never> = {
    equals?: number | IntFieldRefInput<$PrismaModel>
    in?: number[] | ListIntFieldRefInput<$PrismaModel>
    notIn?: number[] | ListIntFieldRefInput<$PrismaModel>
    lt?: number | IntFieldRefInput<$PrismaModel>
    lte?: number | IntFieldRefInput<$PrismaModel>
    gt?: number | IntFieldRefInput<$PrismaModel>
    gte?: number | IntFieldRefInput<$PrismaModel>
    not?: NestedIntWithAggregatesFilter<$PrismaModel> | number
    _count?: NestedIntFilter<$PrismaModel>
    _avg?: NestedFloatFilter<$PrismaModel>
    _sum?: NestedIntFilter<$PrismaModel>
    _min?: NestedIntFilter<$PrismaModel>
    _max?: NestedIntFilter<$PrismaModel>
  }

  export type NestedFloatFilter<$PrismaModel = never> = {
    equals?: number | FloatFieldRefInput<$PrismaModel>
    in?: number[] | ListFloatFieldRefInput<$PrismaModel>
    notIn?: number[] | ListFloatFieldRefInput<$PrismaModel>
    lt?: number | FloatFieldRefInput<$PrismaModel>
    lte?: number | FloatFieldRefInput<$PrismaModel>
    gt?: number | FloatFieldRefInput<$PrismaModel>
    gte?: number | FloatFieldRefInput<$PrismaModel>
    not?: NestedFloatFilter<$PrismaModel> | number
  }

  export type NestedStringNullableWithAggregatesFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel> | null
    in?: string[] | ListStringFieldRefInput<$PrismaModel> | null
    notIn?: string[] | ListStringFieldRefInput<$PrismaModel> | null
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    contains?: string | StringFieldRefInput<$PrismaModel>
    startsWith?: string | StringFieldRefInput<$PrismaModel>
    endsWith?: string | StringFieldRefInput<$PrismaModel>
    not?: NestedStringNullableWithAggregatesFilter<$PrismaModel> | string | null
    _count?: NestedIntNullableFilter<$PrismaModel>
    _min?: NestedStringNullableFilter<$PrismaModel>
    _max?: NestedStringNullableFilter<$PrismaModel>
  }

  export type NestedDateTimeNullableWithAggregatesFilter<$PrismaModel = never> = {
    equals?: Date | string | DateTimeFieldRefInput<$PrismaModel> | null
    in?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel> | null
    notIn?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel> | null
    lt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    lte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    not?: NestedDateTimeNullableWithAggregatesFilter<$PrismaModel> | Date | string | null
    _count?: NestedIntNullableFilter<$PrismaModel>
    _min?: NestedDateTimeNullableFilter<$PrismaModel>
    _max?: NestedDateTimeNullableFilter<$PrismaModel>
  }

  export type NestedIntNullableWithAggregatesFilter<$PrismaModel = never> = {
    equals?: number | IntFieldRefInput<$PrismaModel> | null
    in?: number[] | ListIntFieldRefInput<$PrismaModel> | null
    notIn?: number[] | ListIntFieldRefInput<$PrismaModel> | null
    lt?: number | IntFieldRefInput<$PrismaModel>
    lte?: number | IntFieldRefInput<$PrismaModel>
    gt?: number | IntFieldRefInput<$PrismaModel>
    gte?: number | IntFieldRefInput<$PrismaModel>
    not?: NestedIntNullableWithAggregatesFilter<$PrismaModel> | number | null
    _count?: NestedIntNullableFilter<$PrismaModel>
    _avg?: NestedFloatNullableFilter<$PrismaModel>
    _sum?: NestedIntNullableFilter<$PrismaModel>
    _min?: NestedIntNullableFilter<$PrismaModel>
    _max?: NestedIntNullableFilter<$PrismaModel>
  }

  export type NestedFloatNullableFilter<$PrismaModel = never> = {
    equals?: number | FloatFieldRefInput<$PrismaModel> | null
    in?: number[] | ListFloatFieldRefInput<$PrismaModel> | null
    notIn?: number[] | ListFloatFieldRefInput<$PrismaModel> | null
    lt?: number | FloatFieldRefInput<$PrismaModel>
    lte?: number | FloatFieldRefInput<$PrismaModel>
    gt?: number | FloatFieldRefInput<$PrismaModel>
    gte?: number | FloatFieldRefInput<$PrismaModel>
    not?: NestedFloatNullableFilter<$PrismaModel> | number | null
  }

  export type NestedBoolNullableWithAggregatesFilter<$PrismaModel = never> = {
    equals?: boolean | BooleanFieldRefInput<$PrismaModel> | null
    not?: NestedBoolNullableWithAggregatesFilter<$PrismaModel> | boolean | null
    _count?: NestedIntNullableFilter<$PrismaModel>
    _min?: NestedBoolNullableFilter<$PrismaModel>
    _max?: NestedBoolNullableFilter<$PrismaModel>
  }
  export type NestedJsonNullableFilter<$PrismaModel = never> =
    | PatchUndefined<
        Either<Required<NestedJsonNullableFilterBase<$PrismaModel>>, Exclude<keyof Required<NestedJsonNullableFilterBase<$PrismaModel>>, 'path'>>,
        Required<NestedJsonNullableFilterBase<$PrismaModel>>
      >
    | OptionalFlat<Omit<Required<NestedJsonNullableFilterBase<$PrismaModel>>, 'path'>>

  export type NestedJsonNullableFilterBase<$PrismaModel = never> = {
    equals?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | JsonNullValueFilter
    path?: string[]
    mode?: QueryMode | EnumQueryModeFieldRefInput<$PrismaModel>
    string_contains?: string | StringFieldRefInput<$PrismaModel>
    string_starts_with?: string | StringFieldRefInput<$PrismaModel>
    string_ends_with?: string | StringFieldRefInput<$PrismaModel>
    array_starts_with?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | null
    array_ends_with?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | null
    array_contains?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | null
    lt?: InputJsonValue | JsonFieldRefInput<$PrismaModel>
    lte?: InputJsonValue | JsonFieldRefInput<$PrismaModel>
    gt?: InputJsonValue | JsonFieldRefInput<$PrismaModel>
    gte?: InputJsonValue | JsonFieldRefInput<$PrismaModel>
    not?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | JsonNullValueFilter
  }

  export type player_accoladesCreateWithoutPlayerInput = {
    accolades?: PrismaJson.PlayerAccoladeList | NullableJsonNullValueInput
  }

  export type player_accoladesUncheckedCreateWithoutPlayerInput = {
    accolades?: PrismaJson.PlayerAccoladeList | NullableJsonNullValueInput
  }

  export type player_accoladesCreateOrConnectWithoutPlayerInput = {
    where: player_accoladesWhereUniqueInput
    create: XOR<player_accoladesCreateWithoutPlayerInput, player_accoladesUncheckedCreateWithoutPlayerInput>
  }

  export type player_accoladesUpsertWithoutPlayerInput = {
    update: XOR<player_accoladesUpdateWithoutPlayerInput, player_accoladesUncheckedUpdateWithoutPlayerInput>
    create: XOR<player_accoladesCreateWithoutPlayerInput, player_accoladesUncheckedCreateWithoutPlayerInput>
    where?: player_accoladesWhereInput
  }

  export type player_accoladesUpdateToOneWithWhereWithoutPlayerInput = {
    where?: player_accoladesWhereInput
    data: XOR<player_accoladesUpdateWithoutPlayerInput, player_accoladesUncheckedUpdateWithoutPlayerInput>
  }

  export type player_accoladesUpdateWithoutPlayerInput = {
    accolades?: PrismaJson.PlayerAccoladeList | NullableJsonNullValueInput
  }

  export type player_accoladesUncheckedUpdateWithoutPlayerInput = {
    accolades?: PrismaJson.PlayerAccoladeList | NullableJsonNullValueInput
  }

  export type PlayerCreateWithoutPlayer_accoladesInput = {
    id: number
    first_name?: string | null
    last_name?: string | null
    display_first_last?: string | null
    display_fi_last?: string | null
    birthdate?: Date | string | null
    school?: string | null
    country?: string | null
    height?: string | null
    weight?: string | null
    season_exp?: number | null
    jersey?: string | null
    position?: string | null
    team_history?: string | null
    is_active?: boolean | null
    from_year?: number | null
    to_year?: number | null
    total_games_played?: number | null
    draft_round?: string | null
    draft_number?: string | null
    draft_year?: string | null
  }

  export type PlayerUncheckedCreateWithoutPlayer_accoladesInput = {
    id: number
    first_name?: string | null
    last_name?: string | null
    display_first_last?: string | null
    display_fi_last?: string | null
    birthdate?: Date | string | null
    school?: string | null
    country?: string | null
    height?: string | null
    weight?: string | null
    season_exp?: number | null
    jersey?: string | null
    position?: string | null
    team_history?: string | null
    is_active?: boolean | null
    from_year?: number | null
    to_year?: number | null
    total_games_played?: number | null
    draft_round?: string | null
    draft_number?: string | null
    draft_year?: string | null
  }

  export type PlayerCreateOrConnectWithoutPlayer_accoladesInput = {
    where: PlayerWhereUniqueInput
    create: XOR<PlayerCreateWithoutPlayer_accoladesInput, PlayerUncheckedCreateWithoutPlayer_accoladesInput>
  }

  export type PlayerUpsertWithoutPlayer_accoladesInput = {
    update: XOR<PlayerUpdateWithoutPlayer_accoladesInput, PlayerUncheckedUpdateWithoutPlayer_accoladesInput>
    create: XOR<PlayerCreateWithoutPlayer_accoladesInput, PlayerUncheckedCreateWithoutPlayer_accoladesInput>
    where?: PlayerWhereInput
  }

  export type PlayerUpdateToOneWithWhereWithoutPlayer_accoladesInput = {
    where?: PlayerWhereInput
    data: XOR<PlayerUpdateWithoutPlayer_accoladesInput, PlayerUncheckedUpdateWithoutPlayer_accoladesInput>
  }

  export type PlayerUpdateWithoutPlayer_accoladesInput = {
    id?: IntFieldUpdateOperationsInput | number
    first_name?: NullableStringFieldUpdateOperationsInput | string | null
    last_name?: NullableStringFieldUpdateOperationsInput | string | null
    display_first_last?: NullableStringFieldUpdateOperationsInput | string | null
    display_fi_last?: NullableStringFieldUpdateOperationsInput | string | null
    birthdate?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    school?: NullableStringFieldUpdateOperationsInput | string | null
    country?: NullableStringFieldUpdateOperationsInput | string | null
    height?: NullableStringFieldUpdateOperationsInput | string | null
    weight?: NullableStringFieldUpdateOperationsInput | string | null
    season_exp?: NullableIntFieldUpdateOperationsInput | number | null
    jersey?: NullableStringFieldUpdateOperationsInput | string | null
    position?: NullableStringFieldUpdateOperationsInput | string | null
    team_history?: NullableStringFieldUpdateOperationsInput | string | null
    is_active?: NullableBoolFieldUpdateOperationsInput | boolean | null
    from_year?: NullableIntFieldUpdateOperationsInput | number | null
    to_year?: NullableIntFieldUpdateOperationsInput | number | null
    total_games_played?: NullableIntFieldUpdateOperationsInput | number | null
    draft_round?: NullableStringFieldUpdateOperationsInput | string | null
    draft_number?: NullableStringFieldUpdateOperationsInput | string | null
    draft_year?: NullableStringFieldUpdateOperationsInput | string | null
  }

  export type PlayerUncheckedUpdateWithoutPlayer_accoladesInput = {
    id?: IntFieldUpdateOperationsInput | number
    first_name?: NullableStringFieldUpdateOperationsInput | string | null
    last_name?: NullableStringFieldUpdateOperationsInput | string | null
    display_first_last?: NullableStringFieldUpdateOperationsInput | string | null
    display_fi_last?: NullableStringFieldUpdateOperationsInput | string | null
    birthdate?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    school?: NullableStringFieldUpdateOperationsInput | string | null
    country?: NullableStringFieldUpdateOperationsInput | string | null
    height?: NullableStringFieldUpdateOperationsInput | string | null
    weight?: NullableStringFieldUpdateOperationsInput | string | null
    season_exp?: NullableIntFieldUpdateOperationsInput | number | null
    jersey?: NullableStringFieldUpdateOperationsInput | string | null
    position?: NullableStringFieldUpdateOperationsInput | string | null
    team_history?: NullableStringFieldUpdateOperationsInput | string | null
    is_active?: NullableBoolFieldUpdateOperationsInput | boolean | null
    from_year?: NullableIntFieldUpdateOperationsInput | number | null
    to_year?: NullableIntFieldUpdateOperationsInput | number | null
    total_games_played?: NullableIntFieldUpdateOperationsInput | number | null
    draft_round?: NullableStringFieldUpdateOperationsInput | string | null
    draft_number?: NullableStringFieldUpdateOperationsInput | string | null
    draft_year?: NullableStringFieldUpdateOperationsInput | string | null
  }



  /**
   * Batch Payload for updateMany & deleteMany & createMany
   */

  export type BatchPayload = {
    count: number
  }

  /**
   * DMMF
   */
  export const dmmf: runtime.BaseDMMF
}
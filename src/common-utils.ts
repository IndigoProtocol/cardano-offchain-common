import { match, P } from 'ts-pattern';

/**
 * Accept only a single item in the array and return it.
 * When not exclusively a single item, throw an error.
 */
export function matchSingle<T>(xs: T[], mkErr: (xs: T[]) => Error): T {
  return match(xs)
    .with([P.select()], (res) => res as T)
    .otherwise(() => {
      throw mkErr(xs);
    });
}

export function getRandomElement<T>(arr: T[]): T | undefined {
  return arr.length ? arr[Math.floor(Math.random() * arr.length)] : undefined;
}

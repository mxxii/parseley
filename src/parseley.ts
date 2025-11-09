
import type * as Ast from './ast.ts';

export { type Ast };
export { parse, parse1 } from './parser.ts';
export { serialize } from './serializer.ts';
export { normalize } from './normalizer.ts';

/**
 * Compare selectors based on their specificity.
 *
 * Usable as a comparator for sorting.
 *
 * @param a - First selector.
 * @param b - Second selector.
 */
export function compareSelectors (
  a: Ast.SimpleSelector | Ast.CompoundSelector,
  b: Ast.SimpleSelector | Ast.CompoundSelector,
): number {
  return compareSpecificity(a.specificity, b.specificity);
}

/**
 * Compare specificity values without reducing them
 * as arbitrary base numbers.
 *
 * Usable as a comparator for sorting.
 *
 * @param a - First specificity value.
 * @param b - Second specificity value.
 */
export function compareSpecificity (a: Ast.Specificity, b: Ast.Specificity): number {
  if (a[0] !== b[0]) { return a[0] < b[0] ? -1 : 1; }
  if (a[1] !== b[1]) { return a[1] < b[1] ? -1 : 1; }
  return a[2] < b[2] ? -1 : (a[2] > b[2] ? 1 : 0);
}

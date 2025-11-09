
import type * as Ast from './ast.ts';
import { serialize } from './serializer.ts';

/**
 * Modifies the given AST **in place** to have all internal arrays
 * in a stable order. Returns the AST.
 *
 * Intended for consistent processing and normalized `serialize()` output.
 *
 * @param selector - A selector AST object.
 */
export function normalize (selector: Ast.Selector): Ast.Selector {
  if (!selector.type) {
    throw new Error('This is not an AST node.');
  }
  switch (selector.type) {
    case 'compound': {
      selector.list.forEach(normalize);
      selector.list.sort(
        (a, b) => _compareSelectorPriority(_getSelectorPriority(a), _getSelectorPriority(b)),
      );
      break;
    }
    case 'combinator': {
      normalize(selector.left);
      break;
    }
    case 'list': {
      selector.list.forEach(normalize);
      selector.list.sort(
        (a, b) => (serialize(a) < serialize(b)) ? -1 : 1,
      );
      break;
    }
    default:
      // do nothing
      break;
  }
  return selector;
}

function _getSelectorPriority (selector: Ast.SimpleSelector): [number, string?] {
  switch (selector.type) {
    case 'universal':
      return [1];
    case 'tag':
      return [1];
    case 'id':
      return [2];
    case 'class':
      return [3, selector.name];
    case 'attrPresence':
      return [4, serialize(selector)];
    case 'attrValue':
      return [5, serialize(selector)];
    case 'combinator':
      return [15, serialize(selector)];
  }
}

function _compareSelectorPriority (a: [number, string?], b: [number, string?]): number {
  if (a[0] !== b[0]) { return a[0] < b[0] ? -1 : 1; }
  const aStr = a[1];
  const bStr = b[1];
  if (aStr === bStr) { return 0; }
  if (aStr === undefined) { return -1; }
  if (bStr === undefined) { return 1; }
  return (aStr < bStr) ? -1 : 1;
}

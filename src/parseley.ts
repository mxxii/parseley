
import * as Ast from './ast';

export { Ast };
export { parse, parse1 } from './parser';

/**
 * Convert a selector AST back to a string representation.
 *
 * Note: formatting is not preserved in the AST.
 *
 * @param selector - A selector AST object.
 */
export function serialize (selector: Ast.Selector): string {
  if (!selector.type) {
    throw new Error('This is not an AST node.');
  }
  switch (selector.type) {
    case 'universal':
      return _serNs(selector.namespace) + '*';
    case 'tag':
      return _serNs(selector.namespace) + selector.name;
    case 'class':
      return '.' + selector.name;
    case 'id':
      return '#' + selector.name;
    case 'attrPresence':
      return `[${_serNs(selector.namespace)}${selector.name}]`;
    case 'attrValue':
      return `[${_serNs(selector.namespace)}${selector.name}${selector.matcher}${_serStr(selector.value)}${(selector.modifier ? selector.modifier : '')}]`;
    case 'combinator':
      return serialize(selector.left) + selector.combinator;
    case 'compound':
      return selector.list.reduce((acc,node) => {
        if (node.type === 'combinator') {
          return serialize(node) + acc;
        } else {
          return acc + serialize(node);
        }
      }, '');
    case 'list':
      return selector.list.map(serialize).join(',');
  }
}

function _serNs (ns: string | null): string {
  return (ns || ns === '')
    ? ns + '|'
    : '';
}

function _serStr (str: string): string {
  if (str.indexOf('"') === -1) {
    return `"${str}"`;
  } else if (str.indexOf("'") === -1) {
    return `'${str}'`;
  } else {
    return `"${str.replace('"', '\\"')}"`;
  }
}

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
        (a, b) => _compareArrays(_getSelectorPriority(a), _getSelectorPriority(b))
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
        (a, b) => (serialize(a) < serialize(b)) ? -1 : 1
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
  b: Ast.SimpleSelector | Ast.CompoundSelector
): number {
  return _compareArrays(a.specificity, b.specificity);
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
  return _compareArrays(a, b);
}

function _compareArrays (a: unknown[], b: unknown[]): number {
  if (!Array.isArray(a) || !Array.isArray(b)) {
    throw new Error('Arguments must be arrays.');
  }
  const shorter = (a.length < b.length) ? a.length : b.length;
  for (let i = 0; i < shorter; i++) {
    if (a[i] === b[i]) { continue; }
    return (a[i] < b[i]) ? -1 : 1;
  }
  return a.length - b.length;
}

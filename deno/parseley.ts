
import type * as Ast from './ast.ts';

export { type Ast };
export { parse, parse1 } from './parser.ts';

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
      return _serNs(selector.namespace) + _serIdent(selector.name);
    case 'class':
      return '.' + _serIdent(selector.name);
    case 'id':
      return '#' + _serIdent(selector.name);
    case 'attrPresence':
      return `[${_serNs(selector.namespace)}${_serIdent(selector.name)}]`;
    case 'attrValue':
      return `[${_serNs(selector.namespace)}${_serIdent(selector.name)}${selector.matcher}"${_serStr(selector.value)}"${(selector.modifier ? selector.modifier : '')}]`;
    case 'combinator':
      return serialize(selector.left) + selector.combinator;
    case 'compound':
      return selector.list.reduce((acc, node) => {
        return node.type === 'combinator'
          ? serialize(node) + acc
          : acc + serialize(node);
      }, '');
    case 'list':
      return selector.list.map(serialize).join(',');
  }
}

function _serNs (ns: string | null): string {
  return (ns || ns === '')
    ? _serIdent(ns) + '|'
    : '';
}

// https://w3c.github.io/csswg-drafts/cssom/#serialize-an-identifier

function _codePoint (char: string) {
  return `\\${char.codePointAt(0)!.toString(16)} `;
}

function _serIdent (str: string): string {
  return str.replace(
    // eslint-disable-next-line no-control-regex
    /(^[0-9])|(^-[0-9])|(^-$)|([-0-9a-zA-Z_]|[^\x00-\x7F])|(\x00)|([\x01-\x1f]|\x7f)|([\s\S])/g,
    (_m, d1, d2, hy, safe, nl, ctrl, other) =>
      d1 ? _codePoint(d1 as string)
      : d2 ? '-' + _codePoint((d2 as string).slice(1))
      : hy ? '\\-'
      : safe ? safe as string
      : nl ? '\ufffd'
      : ctrl ? _codePoint(ctrl as string)
      : '\\' + (other as string),
  );
}

function _serStr (str: string): string {
  return str.replace(
    // eslint-disable-next-line no-control-regex
    /(")|(\\)|(\x00)|([\x01-\x1f]|\x7f)/g,
    (_m, dq, bs, nl, ctrl) =>
      dq ? '\\"'
      : bs ? '\\\\'
      : nl ? '\ufffd'
      : _codePoint(ctrl as string),
  );
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

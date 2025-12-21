
import type * as Ast from './ast.ts';
import { serialize } from './serializer.ts';

/**
 * Options controlling how `normalize()` canonicalizes a selector AST.
 */
export type NormalizeOptions = {
  /**
   * Case-folding mode.
   *
   * - `html` (default): lowercases element/attribute names and namespace prefixes.
   * - `xml`: preserves case for those parts.
   */
  mode?: 'html' | 'xml';

  /**
   * Attribute names whose *values* should be lowercased by default.
   *
   * Used only for attribute value selectors (`[name="value"]`)
   * with no explicit case-sensitivity modifier (`i` or `s`).
   *
   * Is not affected by the `mode` option.
   */
  attributesWithNormalizedValues?: string[];

  /**
   * When `false` (default), `normalize()` makes missing attribute value modifiers explicit (`i` or `s`).
   * When `true`, missing modifiers remain unspecified.
   *
   * All attribute value selectors are considered case-sensitive (`s`) unless:
   *
   * - they have an explicit `i` modifier, or
   * - their attribute name is listed in `attributesWithNormalizedValues`.
   */
  allowUnspecifiedCaseSensitivityForAttributes?: boolean;
};

/**
 * Modifies the given AST **in place** to a canonical form and stable ordering.
 * Returns the AST.
 *
 * Intended for consistent processing, easy comparison of equivalent selectors,
 * and normalized `serialize()` output.
 *
 * @param selector - A selector AST object.
 * @param options - Normalization options.
 */
export function normalize (
  selector: Ast.Selector,
  options: NormalizeOptions = { mode: 'html' },
): Ast.Selector {
  const mode = options.mode ?? 'html';
  const isHtmlMode = mode === 'html';

  const allowUnspecifiedCaseSensitivityForAttributes
    = options.allowUnspecifiedCaseSensitivityForAttributes ?? false;

  const attributesWithNormalizedValues
    = options.attributesWithNormalizedValues;
  const attributesWithNormalizedValuesSet
    = (attributesWithNormalizedValues?.length)
      ? new Set(attributesWithNormalizedValues.map(a => a.toLowerCase()))
      : null;

  function visit (node: Ast.Selector): void {
    if (!node.type) {
      throw new Error('This is not an AST node.');
    }

    switch (node.type) {
      case 'universal': {
        if (isHtmlMode && node.namespace !== null) {
          node.namespace = node.namespace.toLowerCase();
        }
        break;
      }
      case 'tag': {
        if (isHtmlMode) {
          node.name = node.name.toLowerCase();
        }
        if (isHtmlMode && node.namespace !== null) {
          node.namespace = node.namespace.toLowerCase();
        }
        break;
      }
      case 'attrPresence': {
        if (isHtmlMode) {
          node.name = node.name.toLowerCase();
        }
        if (isHtmlMode && node.namespace !== null) {
          node.namespace = node.namespace.toLowerCase();
        }
        break;
      }
      case 'attrValue': {
        if (isHtmlMode) {
          node.name = node.name.toLowerCase();
        }
        if (isHtmlMode && node.namespace !== null) {
          node.namespace = node.namespace.toLowerCase();
        }

        const isCaseInsensitiveValue
          = node.modifier === 'i'
            || (
              node.modifier === null
              && !!attributesWithNormalizedValuesSet
              && attributesWithNormalizedValuesSet.has(node.name.toLowerCase())
            );

        if (isCaseInsensitiveValue) {
          node.value = node.value.toLowerCase();
        }

        if (!allowUnspecifiedCaseSensitivityForAttributes && node.modifier === null) {
          node.modifier = isCaseInsensitiveValue ? 'i' : 's';
        }
        break;
      }
      case 'pc': {
        node.name = node.name.toLowerCase();
        break;
      }
      case 'fpc:is':
      case 'fpc:where':
      case 'fpc:not': {
        node.name = node.name.toLowerCase();
        node.list.forEach(visit);
        node.list.sort(
          (a, b) => (serialize(a) < serialize(b)) ? -1 : 1,
        );
        break;
      }
      case 'compound': {
        node.list.forEach(visit);
        node.list.sort(
          (a, b) => _compareSelectorPriority(_getSelectorPriority(a), _getSelectorPriority(b)),
        );
        break;
      }
      case 'combinator': {
        visit(node.left);
        break;
      }
      case 'list': {
        node.list.forEach(visit);
        node.list.sort(
          (a, b) => (serialize(a) < serialize(b)) ? -1 : 1,
        );
        break;
      }
      default:
        // do nothing
        break;
    }
  }

  visit(selector);
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
    case 'pc':
      return [6, selector.name];
    case 'fpc:is':
    case 'fpc:where':
    case 'fpc:not':
      return [7, serialize(selector)];
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

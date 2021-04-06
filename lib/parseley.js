const nearley = require('nearley');
const grammar = require('./grammar.js');

// Passing the start argument to a parser or grammar constructor
// doesn't seem to work as expected.
const grammarNoList = { ...grammar, ParserStart: 'mainNoList' };

/**
 * Parse a CSS selector string.
 *
 * This function supports comma-separated selector lists
 * and always returns an AST starting from a node of type `list`.
 *
 * @param { string } str CSS selector string (can contain commas).
 * @returns { object }
 */
function parse (str) {
  return _parse(grammar, str);
}

/**
 * Parse a CSS selector string.
 *
 * This function does not support comma-separated selector lists
 * and always returns an AST starting from a node of type `compound`.
 *
 * @param { string } str CSS selector string (no commas).
 * @returns { object }
 */
function parse1 (str) {
  return _parse(grammarNoList, str);
}

function _parse (grammar, str) {
  const parser = new nearley.Parser(grammar);
  parser.feed(str);
  if (parser.results.length === 0) {
    throw new Error('Failed to parse - input string might be incomplete.');
  }
  return parser.results[0];
}

/**
 * Convert a selector AST back to a string representation.
 *
 * Note: formatting is not preserved in the AST.
 * Output can be considered as normalized.
 *
 * @param { object } ast An AST object.
 * @returns { string }
 */
function serialize (ast) {
  if (!ast.type) {
    throw new Error('This is not an AST node.');
  }
  switch (ast.type) {
    case 'universal':
      return _serNs(ast.namespace) + '*';
    case 'tag':
      return _serNs(ast.namespace) + ast.name;
    case 'class':
      return '.' + ast.name;
    case 'id':
      return '#' + ast.name;
    case 'attrPresence':
      return `[${_serNs(ast.namespace)}${ast.name}]`;
    case 'attrValue':
      return `[${_serNs(ast.namespace)}${ast.name}${ast.matcher}${_serStr(ast.value)}${(ast.modifier ? ast.modifier : '')}]`;
    case 'combinator':
      return serialize(ast.left) + ast.combinator;
    case 'compound':
      return ast.list.reduce((acc,node) => {
        if (node.type === 'combinator') {
          return serialize(node) + acc;
        } else {
          return acc + serialize(node);
        }
      }, '');
    case 'list':
      return ast.list.map(serialize).join(',');
    default:
      throw new Error('Unexpected node type: ' + ast.type);
  }
}

function _serNs (ns) {
  return (ns || ns === '')
    ? ns + '|'
    : '';
}

function _serStr (str) {
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
 * Intended for consitent processing and normalized `serialize()` output.
 *
 * @param { object } ast An AST object.
 * @returns { object }
 */
function sort (ast) {
  if (!ast.type) {
    throw new Error('This is not an AST node.');
  }
  switch (ast.type) {
    case 'compound': {
      ast.list.map(sort);
      ast.list.sort(
        (a, b) => compareArrays(_getSelectorPriority(a), _getSelectorPriority(b))
      );
      break;
    }
    case 'combinator': {
      sort(ast.left);
      break;
    }
    case 'list': {
      ast.list.map(sort);
      ast.list.sort(
        (a, b) => (serialize(a) < serialize(b)) ? -1 : 1
      );
      break;
    }
    default:
      // do nothing
      break;
  }
  return ast;
}

function _getSelectorPriority (ast) {
  switch (ast.type) {
    case 'universal':
      return [1];
    case 'tag':
      return [1];
    case 'id':
      return [2];
    case 'class':
      return [3, ast.name];
    case 'attrPresence':
      return [4, serialize(ast)];
    case 'attrValue':
      return [5, serialize(ast)];
    case 'combinator':
      return [15, serialize(ast)];
    default:
      throw new Error(`Unexpected selector type: ${ast.type}`);
  }
}

/**
 * Comparator function with the following criterion:
 *
 * Array elements with the same index are compared
 * one by one from the beginning.
 * First non-equal result is returned.
 * After the length of the shorter array is reached
 * without finding a difference - array lengths are compared.
 *
 * Can be used to compare specificity values without reducing them
 * as arbitrary base numbers.
 *
 * @param { Array } a First array.
 * @param { Array } b Second array.
 * @returns { number }
 */
function compareArrays (a, b) {
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

module.exports = {
  compareArrays: compareArrays,
  parse: parse,
  parse1: parse1,
  serialize: serialize,
  sort: sort
};

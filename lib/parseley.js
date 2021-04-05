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

module.exports = {
  parse: parse,
  parse1: parse1,
  serialize: serialize
};

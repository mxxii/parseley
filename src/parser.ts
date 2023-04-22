
import { createLexer, Token } from 'leac';
import * as p from 'peberminta';

import * as ast from './ast';


// Lexer / tokenizer

// https://www.w3.org/TR/selectors-3/#lex

const ws = `(?:[ \\t\\r\\n\\f]*)`;
const nl = `(?:\\n|\\r\\n|\\r|\\f)`;
const nonascii = `[^\\x00-\\x7F]`;
const unicode = `(?:\\\\[0-9a-f]{1,6}(?:\\r\\n|[ \\n\\r\\t\\f])?)`;
const escape = `(?:\\\\[^\\n\\r\\f0-9a-f])`;
const nmstart = `(?:[_a-z]|${nonascii}|${unicode}|${escape})`;
const nmchar = `(?:[_a-z0-9-]|${nonascii}|${unicode}|${escape})`;
const name = `(?:${nmchar}+)`;
const ident = `(?:[-]?${nmstart}${nmchar}*)`;
const string1 = `'([^\\n\\r\\f\\\\']|\\\\${nl}|${nonascii}|${unicode}|${escape})*'`;
const string2 = `"([^\\n\\r\\f\\\\"]|\\\\${nl}|${nonascii}|${unicode}|${escape})*"`;

const lexSelector = createLexer([
  { name: 'ws', regex: new RegExp(ws) },
  { name: 'hash', regex: new RegExp(`#${name}`, 'i') },
  { name: 'ident', regex: new RegExp(ident, 'i') },
  { name: 'str1', regex: new RegExp(string1, 'i') },
  { name: 'str2', regex: new RegExp(string2, 'i') },
  { name: '*' },
  { name: '.' },
  { name: ',' },
  { name: '[' },
  { name: ']' },
  { name: '=' },
  { name: '>' },
  { name: '|' },
  { name: '+' },
  { name: '~' },
  { name: '^' },
  { name: '$' },
  // { name: ':' },
  // { name: '(' },
  // { name: ')' },
]);

const lexEscapedString = createLexer([
  { name: 'unicode', regex: new RegExp(unicode, 'i') },
  { name: 'escape', regex: new RegExp(escape, 'i') },
  { name: 'any', regex: new RegExp('[\\s\\S]', 'i') }
]);


function sumSpec (
  [a0, a1, a2]: ast.Specificity,
  [b0, b1, b2]: ast.Specificity
): ast.Specificity {
  return [a0+b0, a1+b1, a2+b2];
}

function sumAllSpec (ss: ast.Specificity[]): ast.Specificity {
  return ss.reduce(sumSpec, [0, 0, 0]);
}


// Build up the escaped string parser

const unicodeEscapedSequence_: p.Parser<Token,unknown,string>
  = p.token((t) => t.name === 'unicode' ? String.fromCodePoint(parseInt(t.text.slice(1), 16)) : undefined);

const escapedSequence_: p.Parser<Token,unknown,string>
  = p.token((t) => t.name === 'escape' ? t.text.slice(1) : undefined);

const anyChar_: p.Parser<Token,unknown,string>
  = p.token((t) => t.name === 'any' ? t.text : undefined);

const escapedString_: p.Matcher<Token,unknown,string> = p.map(
  p.many(p.or(unicodeEscapedSequence_, escapedSequence_, anyChar_)),
  (cs) => cs.join('')
);

function unescape (escapedString: string): string {
  const lexerResult = lexEscapedString(escapedString);
  const result = escapedString_({ tokens: lexerResult.tokens, options: undefined }, 0);
  return result.value;
}


// Build up the selector parser

function literal (name: string): p.Parser<Token,unknown,true> {
  return p.token((t) => t.name === name ? true : undefined);
}

const whitespace_: p.Parser<Token,unknown,null>
  = p.token((t) => t.name === 'ws' ? null : undefined);

const optionalWhitespace_ = p.option(whitespace_, null);

function optionallySpaced<TValue> (parser: p.Parser<Token,unknown,TValue>) {
  return p.middle(optionalWhitespace_, parser, optionalWhitespace_);
}

const identifier_: p.Parser<Token,unknown,string>
  = p.token((t) => t.name === 'ident' ? unescape(t.text) : undefined);

const hashId_: p.Parser<Token,unknown,string>
  = p.token((t) => t.name === 'hash' ? unescape(t.text.slice(1)) : undefined);

const string_: p.Parser<Token,unknown,string>
  = p.token((t) => t.name.startsWith('str') ? unescape(t.text.slice(1, -1)) : undefined);

const namespace_: p.Parser<Token,unknown,string> = p.left(
  p.option(identifier_, ''),
  literal('|')
);

const qualifiedName_: p.Parser<Token,unknown,{ name: string, namespace: string | null }> = p.eitherOr(
  p.ab(
    namespace_,
    identifier_,
    (ns, name) => ({ name: name, namespace: ns })
  ),
  p.map(
    identifier_,
    (name) => ({ name: name, namespace: null })
  )
);

const uniSelector_: p.Parser<Token,unknown,ast.UniversalSelector> = p.eitherOr(
  p.ab(
    namespace_,
    literal('*'),
    (ns) => ({ type: 'universal', namespace: ns, specificity: [0, 0, 0] })
  ),
  p.map(
    literal('*'),
    () => ({ type: 'universal', namespace: null, specificity: [0, 0, 0] })
  )
);

const tagSelector_: p.Parser<Token,unknown,ast.TagSelector> = p.map(
  qualifiedName_,
  ({ name, namespace }) => ({
    type: 'tag',
    name: name,
    namespace: namespace,
    specificity: [0, 0, 1]
  })
);

const classSelector_: p.Parser<Token,unknown,ast.ClassSelector> = p.ab(
  literal('.'),
  identifier_,
  (fullstop, name) => ({
    type: 'class',
    name: name,
    specificity: [0, 1, 0]
  })
);

const idSelector_: p.Parser<Token,unknown,ast.IdSelector> = p.map(
  hashId_,
  (name) => ({
    type: 'id',
    name: name,
    specificity: [1, 0, 0]
  })
);

const attrModifier_: p.Parser<Token,unknown,'i'|'s'>
  = p.token((t) => {
    if (t.name === 'ident') {
      if (t.text === 'i' || t.text === 'I') { return 'i'; }
      if (t.text === 's' || t.text === 'S') { return 's'; }
    }
    return undefined;
  });

const attrValue_: p.Parser<Token,unknown,{ value: string, modifier: 'i' | 's' | null }> = p.eitherOr(
  p.ab(
    string_,
    p.option(
      p.right(optionalWhitespace_, attrModifier_),
      null
    ),
    (v, mod) => ({ value: v, modifier: mod })
  ),
  p.ab(
    identifier_,
    p.option(
      p.right(whitespace_, attrModifier_),
      null
    ),
    (v, mod) => ({ value: v, modifier: mod })
  )
);

const attrMatcher_: p.Parser<Token,unknown,'=' | '~=' | '|=' | '^=' | '$=' | '*='> = p.choice(
  p.map(literal('='), () => '='),
  p.ab(literal('~'), literal('='), () => '~='),
  p.ab(literal('|'), literal('='), () => '|='),
  p.ab(literal('^'), literal('='), () => '^='),
  p.ab(literal('$'), literal('='), () => '$='),
  p.ab(literal('*'), literal('='), () => '*=')
);

const attrPresenceSelector_: p.Parser<Token,unknown,ast.AttributePresenceSelector> = p.abc(
  literal('['),
  optionallySpaced(qualifiedName_),
  literal(']'),
  (lbr, { name, namespace }) => ({
    type: 'attrPresence',
    name: name,
    namespace: namespace,
    specificity: [0,1,0]
  })
);

const attrValueSelector_: p.Parser<Token,unknown,ast.AttributeValueSelector> = p.middle(
  literal('['),
  p.abc(
    optionallySpaced(qualifiedName_),
    attrMatcher_,
    optionallySpaced(attrValue_),
    ({ name, namespace }, matcher, { value, modifier }) => ({
      type: 'attrValue',
      name: name,
      namespace: namespace,
      matcher: matcher,
      value: value,
      modifier: modifier,
      specificity: [0,1,0]
    })
  ),
  literal(']')
);

const attrSelector_ = p.eitherOr(
  attrPresenceSelector_,
  attrValueSelector_
);

const typeSelector_ = p.eitherOr(
  uniSelector_,
  tagSelector_
);

const subclassSelector_ = p.choice(
  idSelector_ as p.Parser<Token,unknown,ast.SimpleSelector>,
  classSelector_,
  attrSelector_
);

const compoundSelector_: p.Parser<Token,unknown,ast.CompoundSelector> = p.map(
  p.eitherOr(
    p.flatten(typeSelector_, p.many(subclassSelector_)),
    p.many1(subclassSelector_)
  ),
  (ss) => {
    return {
      type: 'compound',
      list: ss,
      specificity: sumAllSpec(ss.map(s => s.specificity))
    };
  }
);

const combinator_: p.Parser<Token,unknown,'>' | '+' | '~' | '||'> = p.choice(
  p.map(literal('>'), () => '>'),
  p.map(literal('+'), () => '+'),
  p.map(literal('~'), () => '~'),
  p.ab(literal('|'), literal('|'), () => '||')
);

const combinatorSeparator_: p.Parser<Token,unknown,' ' | '>' | '+' | '~' | '||'> = p.eitherOr(
  optionallySpaced(combinator_),
  p.map(whitespace_, () => ' ')
);

const complexSelector_: p.Parser<Token,unknown,ast.CompoundSelector> = p.leftAssoc2(
  compoundSelector_,
  p.map(combinatorSeparator_, (c) => (left, right) => ({
    type:        'compound',
    list:        [...right.list, { type:'combinator', combinator: c, left:left, specificity:left.specificity }],
    specificity: sumSpec(left.specificity, right.specificity)
  })),
  compoundSelector_
);

const listSelector_: p.Parser<Token,unknown,ast.ListSelector> = p.leftAssoc2(
  p.map(complexSelector_, (s) => ({ type: 'list', list: [s] })),
  p.map(
    optionallySpaced(literal(',')),
    () => (acc, next) => ({ type:'list', list: [...acc.list, next] })
  ),
  complexSelector_
);


// Complete parser

function parse_<TValue> (parser: p.Parser<Token,unknown,TValue>, str: string): TValue {
  if (!(typeof str === 'string' || (str as unknown) instanceof String)) {
    throw new Error('Expected a selector string. Actual input is not a string!');
  }
  const lexerResult = lexSelector(str);
  if (!lexerResult.complete) {
    throw new Error(
      `The input "${str}" was only partially tokenized, stopped at offset ${lexerResult.offset}!\n` +
      prettyPrintPosition(str, lexerResult.offset)
    );
  }
  const result = optionallySpaced(parser)({ tokens: lexerResult.tokens, options: undefined }, 0);
  if (!result.matched) {
    throw new Error(`No match for "${str}" input!`);
  }
  if (result.position < lexerResult.tokens.length) {
    const token = lexerResult.tokens[result.position];
    throw new Error(
      `The input "${str}" was only partially parsed, stopped at offset ${token.offset}!\n` +
      prettyPrintPosition(str, token.offset, token.len)
    );
  }
  return result.value;
}

function prettyPrintPosition(str: string, offset: number, len = 1) {
  return `${str.replace(/(\t)|(\r)|(\n)/g, (m,t,r) => t ? '\u2409' : r ? '\u240d' : '\u240a')}\n${''.padEnd(offset)}${'^'.repeat(len)}`;
}

/**
 * Parse a CSS selector string.
 *
 * This function supports comma-separated selector lists
 * and always returns an AST starting from a node of type `list`.
 *
 * @param str - CSS selector string (can contain commas).
 */
export function parse (str: string): ast.ListSelector {
  return parse_(listSelector_, str);
}

/**
 * Parse a CSS selector string.
 *
 * This function does not support comma-separated selector lists
 * and always returns an AST starting from a node of type `compound`.
 *
 * @param str - CSS selector string (no commas).
 */
export function parse1 (str: string): ast.CompoundSelector {
  return parse_(complexSelector_, str);
}

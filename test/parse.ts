import test from 'ava';
import { type AttributeValueSelector } from '../src/ast.ts';

import { parse, parse1 } from '../src/parseley.ts';

test('should produce equal AST inside a list and without a list', (t) => {
  const input = 'p > a';
  const ast1 = parse(input);
  const ast2 = parse1(input);
  t.is(ast1.list.length, 1);
  t.deepEqual(ast1.list[0], ast2);
});

test('should throw when parsing commas with parse1', (t) => {
  const input = 'a,b , p';
  const ast1 = parse(input);
  t.is(ast1.list.length, 3);
  t.throws(
    () => { parse1(input); },
    { message: 'The input "a,b , p" was only partially parsed, stopped at offset 1!\na,b , p\n ^' },
  );
});

test('should reject reserved functional pseudo-classes without parentheses', (t) => {
  t.throws(
    () => { parse1(':is'); },
    { message: 'Expected opening parenthesis in :is()' },
  );
  t.throws(
    () => { parse1(':where'); },
    { message: 'Expected opening parenthesis in :where()' },
  );
  t.throws(
    () => { parse1(':not'); },
    { message: 'Expected opening parenthesis in :not()' },
  );
});

test('should reject functional pseudo-classes with empty argument list', (t) => {
  t.throws(
    () => { parse1(':is()'); },
    { message: 'Expected selector list in :is()' },
  );
  t.throws(
    () => { parse1(':where()'); },
    { message: 'Expected selector list in :where()' },
  );
  t.throws(
    () => { parse1(':not()'); },
    { message: 'Expected selector list in :not()' },
  );
});

test('should reject functional pseudo-classes with whitespace-only argument list', (t) => {
  t.throws(
    () => { parse1(':is(   )'); },
    { message: 'Expected selector list in :is()' },
  );
  t.throws(
    () => { parse1(':where(\t\n)'); },
    { message: 'Expected selector list in :where()' },
  );
  t.throws(
    () => { parse1(':not(\r\n\t )'); },
    { message: 'Expected selector list in :not()' },
  );
});

test('should parse attribute value selectors with different matchers', (t) => {
  const input = '[foo=bar][foo~=bar][foo|=bar][foo^=bar][foo$=bar][foo*=bar]';
  const ast1 = parse1(input);
  const list = ast1.list as AttributeValueSelector[];
  t.is(list.length, 6);
  t.is(list.map(s => s.matcher).join(' '), '= ~= |= ^= $= *=');
});

test('should produce equal AST for differently quoted attribute values', (t) => {
  const input1 = '[attr= foo s]';
  const input2 = '[ attr =\t"foo"s]';
  const input3 = "[attr='foo'S  ]";
  const ast1 = parse(input1);
  const ast2 = parse(input2);
  const ast3 = parse(input3);
  t.deepEqual(ast1, ast2);
  t.deepEqual(ast2, ast3);
});

test('should compute specificity', (t) => {
  const input1 = '* + foo|*';
  const input2 = 'p.class1#id1 a.class2#id2 ~ [attr1][attr2=foo]';
  const ast1 = parse1(input1);
  const ast2 = parse1(input2);
  t.deepEqual(ast1.specificity, [0, 0, 0]);
  t.deepEqual(ast2.specificity, [2, 4, 2]);
});

test('should throw when trying to parse anything but a string', (t) => {
  const input1 = null;
  const input2 = 123;
  const input3 = {};
  t.throws(
    () => { parse(input1 as unknown as string); },
    { message: 'Expected a selector string. Actual input is not a string!' },
  );
  t.throws(
    () => { parse(input2 as unknown as string); },
    { message: 'Expected a selector string. Actual input is not a string!' },
  );
  t.throws(
    () => { parse(input3 as unknown as string); },
    { message: 'Expected a selector string. Actual input is not a string!' },
  );
});

test('should parse compound selectors in any valid order', (t) => {
  const input1 = 'div.class#id[attr]:hover';
  const input2 = ':hover[attr].class#id';
  const input3 = ':hover:is(.class1):focus.class2#id[attr1][attr2]';

  const ast1 = parse1(input1);
  t.is(ast1.type, 'compound');

  const ast2 = parse1(input2);
  t.is(ast2.type, 'compound');
  t.is(ast2.list.length, 4);

  const ast3 = parse1(input3);
  t.is(ast3.type, 'compound');
  t.is(ast3.list.length, 7);

  t.deepEqual(ast1.specificity, [1, 3, 1]); // #id=1, .class+[attr]+:hover=3, div=1
  t.deepEqual(ast2.specificity, [1, 3, 0]); // #id=1, .class+[attr]:hover=3
  t.deepEqual(ast3.specificity, [1, 6, 0]); // #id=1, .class1+.class2+:hover+:focus+[attr1]+[attr2]=6
});

// Note: This is a subject for improvement in future versions.
test('should throw when parsing pseudo-elements or unsupported functional pseudo-classes', (t) => {
  const input1 = 'a::before';
  const input2 = 'a:has(.foo)';
  t.throws(() => {
    parse(input1);
  });
  t.throws(
    () => { parse(input2); },
    { message: 'The input "a:has(.foo)" was only partially parsed, stopped at offset 1!\na:has(.foo)\n ^' },
  );
});

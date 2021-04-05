const test = require('ava');

const { parse, parse1 } = require('../lib/parseley');

test('should produce equal AST inside a list and without a list', t => {
  const input = 'p > a';
  const ast1 = parse(input);
  const ast2 = parse1(input);
  t.is(ast1.list.length, 1);
  t.deepEqual(ast1.list[0], ast2);
});

test('should throw when parsing commas with parse1', t => {
  const input = 'a,\r\nb ,\tp';
  const ast1 = parse(input);
  t.is(ast1.list.length, 3);
  const error = t.throws(() => {
    parse1(input);
  });
  t.true(error.message.includes('Unexpected comma token:'));
});

test('should produce equal AST for differently quoted attribute values', t => {
  const input1 = '[attr= foo s]';
  const input2 = '[ attr =\t"foo"s]';
  const input3 = "[attr='foo'S  ]";
  const ast1 = parse(input1);
  const ast2 = parse(input2);
  const ast3 = parse(input3);
  t.deepEqual(ast1, ast2);
  t.deepEqual(ast2, ast3);
});

test('should compute specificity', t => {
  const input1 = '* + foo|*';
  const input2 = 'p.class1#id1 a.class2#id2 ~ [attr1][attr2=foo]';
  const ast1 = parse1(input1);
  const ast2 = parse1(input2);
  t.deepEqual(ast1.specificity, [0, 0, 0]);
  t.deepEqual(ast2.specificity, [2, 4, 2]);
});

// Note: This is a subject for improvement in future versions.
test('should throw when parsing pseudo-elements or pseudo-classes', t => {
  const input1 = 'a::before';
  const input2 = 'a:hover';
  const input3 = 'a:not(.foo)';
  t.throws(() => {
    parse(input1);
  });
  t.throws(() => {
    parse(input2);
  });
  const error = t.throws(() => {
    parse(input3);
  });
  t.true(error.message.includes('Unexpected input (lexer error).'));
});

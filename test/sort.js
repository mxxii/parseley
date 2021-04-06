const test = require('ava');

const { parse, parse1, serialize, sort } = require('../lib/parseley');

function sortMacro(t, input, unsorted, sorted) {
  t.is(serialize(parse(input)), unsorted);
  t.is(serialize(sort(parse(input))), sorted);
}

test('should sort all children of a compound selector', sortMacro,
  'foo|div[attr1=value i][attr3][attr2].class9.class11#id',
  'foo|div[attr1="value"i][attr3][attr2].class9.class11#id',
  'foo|div#id.class11.class9[attr2][attr3][attr1="value"i]'
);

test('should sort all compound selectors in a complex selector', sortMacro,
  'foo[b][a] > .class3.class20.class19 + bar',
  'foo[b][a]>.class3.class20.class19+bar',
  'foo[a][b]>.class19.class20.class3+bar'
);

test('should sort all selectors in a list', sortMacro,
  'foo[b][c][a], foo[a][b], foo[a][c], bar[b][a]',
  'foo[b][c][a],foo[a][b],foo[a][c],bar[b][a]',
  'bar[a][b],foo[a][b],foo[a][b][c],foo[a][c]'
);

test('should keep combinator nodes at the end of the list', t => {
  const input = 'foo.bar2.bar1 > baz.qux2.qux1';
  const ast = parse1(input);
  t.is(ast.list[ast.list.length - 1].type, 'combinator');
  sort(ast);
  t.is(ast.list[ast.list.length - 1].type, 'combinator');
  t.is(serialize(ast), 'foo.bar1.bar2>baz.qux1.qux2');
});

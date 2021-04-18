import test, {ExecutionContext} from 'ava';

import { parse, parse1, serialize, normalize } from '../src/parseley';

function normalizeMacro(
  t: ExecutionContext,
  input: string,
  direct: string,
  normalized: string
) {
  t.is(serialize(parse(input)), direct);
  t.is(serialize(normalize(parse(input))), normalized);
}

test('should sort all children of a compound selector', normalizeMacro,
  'foo|div[attr1=value i][attr3][attr2].class9.class11#id',
  'foo|div[attr1="value"i][attr3][attr2].class9.class11#id',
  'foo|div#id.class11.class9[attr2][attr3][attr1="value"i]'
);

test('should sort all compound selectors in a complex selector', normalizeMacro,
  'foo[b][a] > .class3.class20.class19 + bar',
  'foo[b][a]>.class3.class20.class19+bar',
  'foo[a][b]>.class19.class20.class3+bar'
);

test('should sort all selectors in a list', normalizeMacro,
  'foo[b][c][a], foo[a][b], foo[a][c], bar[b][a]',
  'foo[b][c][a],foo[a][b],foo[a][c],bar[b][a]',
  'bar[a][b],foo[a][b],foo[a][b][c],foo[a][c]'
);

test('should keep combinator nodes at the end of the list', t => {
  const input = 'foo.bar2.bar1 > baz.qux2.qux1';
  const ast = parse1(input);
  t.is(ast.list[ast.list.length - 1].type, 'combinator');
  normalize(ast);
  t.is(ast.list[ast.list.length - 1].type, 'combinator');
  t.is(serialize(ast), 'foo.bar1.bar2>baz.qux1.qux2');
});

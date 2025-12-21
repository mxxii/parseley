import test, { type ExecutionContext } from 'ava';

import { parse, parse1, serialize, normalize } from '../src/parseley.ts';

function normalizeMacro (
  t: ExecutionContext,
  input: string,
  direct: string,
  normalized: string,
) {
  t.is(serialize(parse(input)), direct);
  t.is(serialize(normalize(parse(input))), normalized);
}

test('should sort all children of a compound selector', normalizeMacro,
  'foo|div[attr1=value i][attr3][attr2].class9.class11#id',
  'foo|div[attr1="value"i][attr3][attr2].class9.class11#id',
  'foo|div#id.class11.class9[attr2][attr3][attr1="value"i]',
);

test('should sort all children of a compound selector 2', normalizeMacro,
  'div:not(.a).class2[attr2]:hover.class1[attr1]:focus:is(.b)',
  'div:not(.a).class2[attr2]:hover.class1[attr1]:focus:is(.b)',
  'div.class1.class2[attr1][attr2]:focus:hover:is(.b):not(.a)',
);

test('should sort all compound selectors in a complex selector', normalizeMacro,
  'foo[b][a] > .class3.class20.class19 + bar',
  'foo[b][a]>.class3.class20.class19+bar',
  'foo[a][b]>.class19.class20.class3+bar',
);

test('should sort all selectors in a list', normalizeMacro,
  'foo[b][c][a], foo[a][b], foo[a][c], bar[b][a]',
  'foo[b][c][a],foo[a][b],foo[a][c],bar[b][a]',
  'bar[a][b],foo[a][b],foo[a][b][c],foo[a][c]',
);

test('should keep combinator nodes at the end of the list', (t) => {
  const input = 'foo.bar2.bar1:hover > baz.qux2.qux1:is(.a)';
  const ast = parse1(input);
  t.is(ast.list[ast.list.length - 1].type, 'combinator');
  normalize(ast);
  t.is(ast.list[ast.list.length - 1].type, 'combinator');
  t.is(serialize(ast), 'foo.bar1.bar2:hover>baz.qux1.qux2:is(.a)');
});

test('should sort simple pseudo-classes alphabetically', normalizeMacro,
  'div:hover:focus:active',
  'div:hover:focus:active',
  'div:active:focus:hover',
);

test('should sort functional pseudo-classes', normalizeMacro,
  'div:not(.a):where(.b):is(.c)',
  'div:not(.a):where(.b):is(.c)',
  'div:is(.c):not(.a):where(.b)',
);

test('should place simple pseudo-classes before functional ones', normalizeMacro,
  'div:not(.a):is(.b):hover:focus',
  'div:not(.a):is(.b):hover:focus',
  'div:focus:hover:is(.b):not(.a)',
);

test('should normalize selectors inside :is()', normalizeMacro,
  ':is(.z.a, .b.y)',
  ':is(.z.a,.b.y)',
  ':is(.a.z,.b.y)',
);

test('should normalize selectors inside :where()', normalizeMacro,
  ':where([b][a], .z.a)',
  ':where([b][a],.z.a)',
  ':where(.a.z,[a][b])',
);

test('should normalize selectors inside :not()', normalizeMacro,
  ':not(.class2.class1, [attr2][attr1])',
  ':not(.class2.class1,[attr2][attr1])',
  ':not(.class1.class2,[attr1][attr2])',
);

test('should sort selector lists inside :is()', normalizeMacro,
  ':is(.z, .a, .m)',
  ':is(.z,.a,.m)',
  ':is(.a,.m,.z)',
);

test('should sort selector lists inside :where()', normalizeMacro,
  ':where(#z, #a, #m)',
  ':where(#z,#a,#m)',
  ':where(#a,#m,#z)',
);

test('should sort selector lists inside :not()', normalizeMacro,
  ':not([z], [a], [m])',
  ':not([z],[a],[m])',
  ':not([a],[m],[z])',
);

test('should normalize nested functional pseudo-classes', normalizeMacro,
  ':is(:where(.z.a, .b.y), :not([c][b][a]))',
  ':is(:where(.z.a,.b.y),:not([c][b][a]))',
  ':is(:not([a][b][c]),:where(.a.z,.b.y))',
);

test('text case of various selectors', normalizeMacro,
  'DIV.CLASS2.CLASS1#ID[ATTR2][ATTR1]:HOVER:FOCUS:IS(.FOO):NOT(.BAR)',
  'DIV.CLASS2.CLASS1#ID[ATTR2][ATTR1]:HOVER:FOCUS:IS(.FOO):NOT(.BAR)',
  'div#ID.CLASS1.CLASS2[attr1][attr2]:focus:hover:is(.FOO):not(.BAR)',
);

test('html mode should lowercase tag/attr/namespace', (t) => {
  const input = 'FOO|DIV[ATTR=value i]:HOVER:IS(Bar|SPan[BaZ])';
  const ast = parse1(input);
  t.is(serialize(normalize(ast, { mode: 'html' })), 'foo|div[attr="value"i]:hover:is(bar|span[baz])');
});

test('xml mode should preserve case of tag/attr/namespace', (t) => {
  const input = 'FOO|DIV[ATTR=value i]:HOVER:IS(Bar|SPan[BaZ])';
  const ast = parse1(input);
  t.is(serialize(normalize(ast, { mode: 'xml' })), 'FOO|DIV[ATTR="value"i]:hover:is(Bar|SPan[BaZ])');
});

test('should lowercase values for configured case-insensitive attributes (html mode)', (t) => {
  const ast = parse1('DIV[TYPE=TeXt]:HOVER');
  normalize(ast, { mode: 'html', attributesWithNormalizedValues: ['type'] });
  t.is(serialize(ast), 'div[type="text"i]:hover');
});

test('should not override explicit case-sensitive modifier for configured attributes', (t) => {
  const ast = parse1('DIV[TYPE=TeXt s]:HOVER');
  normalize(ast, { mode: 'html', attributesWithNormalizedValues: ['type'] });
  t.is(serialize(ast), 'div[type="TeXt"s]:hover');
});

test('should set explicit s modifier when absent and not configured', (t) => {
  const ast = parse1('DIV[DATA=TeXt]:HOVER');
  normalize(ast, { mode: 'html', attributesWithNormalizedValues: ['type'] });
  t.is(serialize(ast), 'div[data="TeXt"s]:hover');
});

test('should lowercase when explicit i modifier is present (even if not configured)', (t) => {
  const ast = parse1('DIV[DATA=TeXt i]:HOVER');
  normalize(ast, { mode: 'html', attributesWithNormalizedValues: ['type'] });
  t.is(serialize(ast), 'div[data="text"i]:hover');
});

test('allowUnspecifiedCaseSensitivityForAttributes keeps modifier unspecified by default', (t) => {
  const ast = parse1('DIV[DATA=TeXt]:HOVER');
  normalize(ast, {
    mode: 'html',
    attributesWithNormalizedValues: ['type'],
    allowUnspecifiedCaseSensitivityForAttributes: true,
  });
  t.is(serialize(ast), 'div[data="TeXt"]:hover');
});

test('allowUnspecifiedCaseSensitivityForAttributes keeps modifier unspecified even when value lowercased', (t) => {
  const ast = parse1('DIV[TYPE=TeXt]:HOVER');
  normalize(ast, {
    mode: 'html',
    attributesWithNormalizedValues: ['type'],
    allowUnspecifiedCaseSensitivityForAttributes: true,
  });
  t.is(serialize(ast), 'div[type="text"]:hover');
});

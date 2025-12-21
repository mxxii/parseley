import test, { type ExecutionContext } from 'ava';

import { parse, serialize } from '../src/parseley.ts';

function serializeMacro (
  t: ExecutionContext,
  input: string,
  expected: string,
) {
  t.is(serialize(parse(input)), expected);
}

test('empty combinator', serializeMacro,
  ' div    div \t',
  'div div',
);

test('non-empty combinator', serializeMacro,
  'div + div',
  'div+div',
);

test('attribute presence', serializeMacro,
  ' [ attr ] ',
  '[attr]',
);

test('attribute value without quotes', serializeMacro,
  ' [ attr ^= value ] ',
  '[attr^="value"]',
);

test('attribute value without quotes with modifier', serializeMacro,
  ' [ attr ^= value I ] ',
  '[attr^="value"i]',
);

test('attribute value with double quotes', serializeMacro,
  ' [ attr ^= "value I" ] ',
  '[attr^="value I"]',
);

test('attribute value with double quotes with modifier', serializeMacro,
  ' [ attr ^= "value " s ] ',
  '[attr^="value "s]',
);

test('attribute value with single quotes', serializeMacro,
  ` [ attr ^= ' value  ' ] `,
  '[attr^=" value  "]',
);

test('attribute value containing a double quote inside', serializeMacro,
  `[attr^='value"']`,
  '[attr^="value\\""]',
);

test('attribute value containing single and double quote inside', serializeMacro,
  `[attr^='value\\'"']`,
  `[attr^="value'\\""]`,
);

test('classes and ids with escape sequences', serializeMacro,
  '#♫ #\\. .\\# .a-_ .\\31 .-\\32 .\\2d .\\00\\01\\1f\\7f',
  '#♫ #\\. .\\# .a-_ .\\31 .-\\32 .\\-.�\\1 \\1f \\7f ',
);

test('order inside compound selector', serializeMacro,
  'foo.bar#baz[qux].quux[quuz]',
  'foo.bar#baz[qux].quux[quuz]',
);

test('universal selector with empty namespace', serializeMacro,
  '|*',
  '|*',
);

test('universal selector with non-empty namespace', serializeMacro,
  'foo|*',
  'foo|*',
);

test('tag selector with empty namespace', serializeMacro,
  '|p',
  '|p',
);

test('tag selector with non-empty namespace', serializeMacro,
  'foo|p',
  'foo|p',
);

test('attribute selector with empty namespace', serializeMacro,
  '[|attr]',
  '[|attr]',
);

test('attribute selector with non-empty namespace', serializeMacro,
  '[foo|attr*=value]',
  '[foo|attr*="value"]',
);

test('simple pseudo-class', serializeMacro,
  ':hover',
  ':hover',
);

test(':is() with multiple selectors', serializeMacro,
  ':is( .foo , .bar , .baz )',
  ':is(.foo,.bar,.baz)',
);

test(':where() with multiple selectors', serializeMacro,
  ':where( #foo , #bar )',
  ':where(#foo,#bar)',
);

test(':not() with multiple selectors', serializeMacro,
  ':not( [disabled] , .hidden )',
  ':not([disabled],.hidden)',
);

test('nested :not() inside :where() inside :is()', serializeMacro,
  ':is(:where(:not(#foo)))',
  ':is(:where(:not(#foo)))',
);

test('pseudo-classes in compound selector', serializeMacro,
  'div.foo:hover:focus',
  'div.foo:hover:focus',
);

test('functional pseudo-classes in compound selector', serializeMacro,
  'div:is(.a, .b):not(.c)',
  'div:is(.a,.b):not(.c)',
);

test('functional pseudo-class with combinators inside', serializeMacro,
  ':is(div > p, span + a)',
  ':is(div>p,span+a)',
);

test('functional pseudo-class with combinator outside', serializeMacro,
  'div:is(.foo) > span',
  'div:is(.foo)>span',
);

test('text case of various selectors', serializeMacro,
  'P.CLASS#ID[ATTR="VALUE"]:HOVER:IS(.FOO):WHERE(.BAR):NOT(.BAZ)',
  'P.CLASS#ID[ATTR="VALUE"]:HOVER:IS(.FOO):WHERE(.BAR):NOT(.BAZ)',
);

const test = require('ava');

const { parse, serialize } = require('../lib/parseley');

function serializeMacro(t, input, expected) {
  t.is(serialize(parse(input)), expected);
}

test('empty combinator', serializeMacro,
  ` div    div \t`,
  `div div`
);

test('non-empty combinator', serializeMacro,
  `div + div`,
  `div+div`
);

test('attribute presence', serializeMacro,
  ` [ attr ] `,
  `[attr]`
);

test('attribute value without quotes', serializeMacro,
  ` [ attr ^= value ] `,
  `[attr^="value"]`
);

test('attribute value without quotes with modifier', serializeMacro,
  ` [ attr ^= value I ] `,
  `[attr^="value"i]`
);

test('attribute value with double quotes', serializeMacro,
  ` [ attr ^= "value I" ] `,
  `[attr^="value I"]`
);

test('attribute value with double quotes with modifier', serializeMacro,
  ` [ attr ^= "value " s ] `,
  `[attr^="value "s]`
);

test('attribute value with single quotes', serializeMacro,
  ` [ attr ^= ' value  ' ] `,
  `[attr^=" value  "]`
);

test('attribute value containing a double quote inside', serializeMacro,
  `[attr^='value"']`,
  `[attr^='value"']`
);

test('attribute value containing single and double quote inside', serializeMacro,
  `[attr^='value\\'"']`,
  `[attr^="value\\'\\""]`
);

test('order inside compound selector', serializeMacro,
  `foo.bar#baz[qux].quux[quuz]`,
  `foo.bar#baz[qux].quux[quuz]`
);

test('universal selector with empty namespace', serializeMacro,
  `|*`,
  `|*`
);

test('universal selector with non-empty namespace', serializeMacro,
  `foo|*`,
  `foo|*`
);

test('tag selector with empty namespace', serializeMacro,
  `|p`,
  `|p`
);

test('tag selector with non-empty namespace', serializeMacro,
  `foo|p`,
  `foo|p`
);

test('attribute selector with empty namespace', serializeMacro,
  `[|attr]`,
  `[|attr]`
);

test('attribute selector with non-empty namespace', serializeMacro,
  `[foo|attr*=value]`,
  `[foo|attr*="value"]`
);

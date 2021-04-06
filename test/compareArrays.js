const test = require('ava');

const { compareArrays } = require('../lib/parseley');

function compareArraysMacro(t, a, b, expected, inverse) {
  t.is(compareArrays(a, b), expected);
  t.is(compareArrays(b, a), inverse);
}

function throwMacro(t, a, b, message) {
  t.throws(() => {
    compareArrays(a, b);
  });
  const error = t.throws(() => {
    compareArrays(b, a);
  });
  t.is(error.message, message);
}

test('should throw when input is not provided', throwMacro,
  [1],
  undefined,
  'Arguments must be arrays.'
);

test('should throw when input is not an array', throwMacro,
  1,
  [1],
  'Arguments must be arrays.'
);

test('empty arrays', compareArraysMacro,
  [],
  [],
  0,
  0
);

test('equal arrays', compareArraysMacro,
  [42, 'foo', true],
  [42, 'foo', true],
  0,
  0
);

test('one array is a prefix for the other', compareArraysMacro,
  [42, 'foo', true, 0, null],
  [42, 'foo', true],
  2,
  -2
);

test('numbers are compared as numbers', compareArraysMacro,
  [1000, 1],
  [990, 991],
  1,
  -1
);

test('strings are compared alphanumerically', compareArraysMacro,
  [1, 'foobarbaz'],
  [1, 'foobaz'],
  -1,
  1
);

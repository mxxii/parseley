import test, {ExecutionContext} from 'ava';
import { compareSelectors, parse1 } from '../src/parseley';

function compareSelectorsMacro(
  t: ExecutionContext,
  a: string,
  b: string,
  expected: number,
  inverse: number
) {
  t.is(compareSelectors(parse1(a), parse1(b)), expected);
  t.is(compareSelectors(parse1(b), parse1(a)), inverse);
}

test('selectors of equal specificity', compareSelectorsMacro,
  '#foo > bar[baz]',
  'a + #b.c',
  0,
  0
);

test('should prioritize id level', compareSelectorsMacro,
  '#foo',
  '.c1.c2 > t[a1][a2=v] *',
  1,
  -1
);

test('should prioritize class level when id level is equal', compareSelectorsMacro,
  '#foo.c1 + t1 + t2',
  '#bar > t3.c2.c3',
  -1,
  1
);

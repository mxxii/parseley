import test, {ExecutionContext} from 'ava';
import { Specificity } from '../src/ast';
import { compareSpecificity } from '../src/parseley';

function compareSpecificityMacro(
  t: ExecutionContext,
  a: Specificity,
  b: Specificity,
  expected: number,
  inverse: number
) {
  t.is(compareSpecificity(a, b), expected);
  t.is(compareSpecificity(b, a), inverse);
}

test('equal specificity', compareSpecificityMacro,
  [0,4,2],
  [0,4,2],
  0,
  0
);

test('should not compare arrays as strings', compareSpecificityMacro,
  [1,0,0],
  [0,9,9],
  1,
  -1
);

test('should not compare individual numbers as strings', compareSpecificityMacro,
  [0,7,0],
  [0,10,0],
  -1,
  1
);

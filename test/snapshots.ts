import test, {ExecutionContext} from 'ava';

import { parse, parse1 } from '../src/parseley';

function snapshotMacro(t: ExecutionContext, input: string) {
  t.snapshot(
    parse(input),
    `\`parse('${input}')\``
  );
}

function snapshotMacro1(t: ExecutionContext, input: string) {
  t.snapshot(
    parse1(input),
    `\`parse1('${input}')\``
  );
}

test('universal selector', snapshotMacro1, '*');

test('universal selector with empty namespace', snapshotMacro1, '|*');

test('universal selector with non-empty namespace', snapshotMacro1, 'foo|*');

test('tag selector with non-empty namespace', snapshotMacro1, 'foo|bar');

test('class selector', snapshotMacro1, '.class');

test('id selector', snapshotMacro1, '#id');

test('attribute presence selector', snapshotMacro1, '[attr]');

test('attribute value selector', snapshotMacro1, '[attr $= "value"]');

test('attribute value selector with modifier', snapshotMacro1, '[attr $= "value" S]');

test('compound selector', snapshotMacro1, 'p.class#id[attr][attr2^=value]');

test('complex selector (with combinators)', snapshotMacro1, '.foo || .bar .baz + .qux');

test('list selector', snapshotMacro, '.foo,.bar,.baz');

import test, { type ExecutionContext } from 'ava';

import { parse, parse1 } from '../src/parseley.ts';

function snapshotMacro (t: ExecutionContext, input: string) {
  t.snapshot(
    parse(input),
    `\`parse('${input}')\``,
  );
}

function snapshotMacro1 (t: ExecutionContext, input: string) {
  t.snapshot(
    parse1(input),
    `\`parse1('${input}')\``,
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

test('pseudo-class selector', snapshotMacro1, ':hover');

test('functional pseudo-class :is()', snapshotMacro1, ':is(.foo, .bar)');

test('functional pseudo-class :where()', snapshotMacro1, ':where(#foo, #bar)');

test('functional pseudo-class :not()', snapshotMacro1, ':not([disabled])');

test('compound selector', snapshotMacro1, 'p.class#id[attr][attr2^=value]');

test('complex selector (with combinators)', snapshotMacro1, '.foo || .bar .baz + .qux');

test('list selector', snapshotMacro, '.foo,.bar,.baz');

test('escape sequences', snapshotMacro, '#foo\\>.bar\\+baz[attr\\=value="value"]#id\\,.qux\\~quux');

test('non-ascii and escape sequences', snapshotMacro1, '.♫ .\\" .\\22\\22 \\.22 .\\000022 22\\ \\+\\ 22\\ ');

test('emoji in selectors', snapshotMacro1, '.👩‍🚀\\d83d\\dc69\\200d\\d83d\\de80 \\1f469\\200d\\1f680');

test('upper case in selectors', snapshotMacro1, '.CLASS #ID [ATTR="VALUE"] :PC :WHERE(*)');

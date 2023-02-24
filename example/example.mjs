import { inspect } from 'node:util';

import { parse1, serialize, normalize } from '../lib/parseley.cjs';

const str = 'div#id1 > .class2.class1[attr1]';

const ast = parse1(str);
console.log(inspect(ast, { breakLength: 45, depth: null }));

const serialized = serialize(ast);
console.log(`Serialized: '${serialized}'`);

normalize(ast);
const normalized = serialize(ast);
console.log(`Normalized: '${normalized}'`);

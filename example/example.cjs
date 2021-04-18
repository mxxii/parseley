const util = require('util');

const parseley = require('../lib/parseley.cjs');

const str = 'div#id1 > .class1[attr1]';

const ast = parseley.parse1(str);
console.log(util.inspect(ast, { breakLength: 45, depth: null }));

const serialized = parseley.serialize(ast);
console.log(`Serialized: '${serialized}'`);

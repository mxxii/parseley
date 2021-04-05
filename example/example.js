const util = require('util');

const { parse1, serialize } = require('../lib/parseley');

const str = 'div#id1 > .class1[attr1]';

const ast = parse1(str);
console.log(util.inspect(ast, { breakLength: 45, depth: null }));

const serialized = serialize(ast);
console.log(`Serialized: '${serialized}'`);

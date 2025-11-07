# Changelog

## Unpublished

- targeting Node 20;
- ...

## Version 0.12.1

- runtime check for input of `parse` and `parse1` to be a string.

## Version 0.12.0

- support for escape sequences according to specifications ([#97](https://github.com/mxxii/parseley/issues/97)).

    Now follows <https://www.w3.org/TR/selectors-3/#lex> for parsing and <https://w3c.github.io/csswg-drafts/cssom/#common-serializing-idioms> for serializing.

Possibly breaking changes:

- parsed strings (attribute values) retained escape sequences previously, now they are unescaped;
- strings with `"` character were serialized as single-quoted previously, now all strings serialized as double-quoted, per spec suggestion.

## Version 0.11.0

- targeting Node.js version 14 and ES2020;
- now should be discoverable with [denoify](https://github.com/garronej/denoify).

## Version 0.10.0

- bump dependencies - fix "./core module cannot be found" issue.

## Version 0.9.1

- fix namespace parsing;
- remove terser, use only `rollup-plugin-cleanup` to condition published files.

## Version 0.9.0

- replaced `moo` and `nearley` with my [leac](https://github.com/mxxii/leac) and [peberminta](https://github.com/mxxii/peberminta) packages. Now `parseley` with all dependencies are TypeScript, dual CommonJS/ES module packages;
- package is marked as free of side effects and tersed;
- Deno version is provided, with the help of `denoify`.

## Version 0.8.0

- drop Node.js version 10 support. 12.22.x is required;
- fix typos in type definitions.

## Version 0.7.0

- switched to TypeScript;
- added type definitions for AST;
- hybrid package (ESM, CommonJS);
- renamed `sort()` to `normalize()` in order to better reflect what it does;
- replaced `compareArrays()` with `compareSpecificity()` and `compareSelectors()` - more sensible API;
- generated [documentation](https://github.com/mxxii/parseley/tree/main/docs).

## Version 0.6.0

- added `sort()` and `compareArrays()` functions.

## Version 0.5.0

Initial release.

Aiming at Node.js version 10 and up.

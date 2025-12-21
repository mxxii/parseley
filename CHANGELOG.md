# Changelog

## Version 0.13.0

- targeting Node 20;
- added simple pseudo-classes support - any pseudo-class with no arguments is now supported;
- added three functional pseudo-classes support: `:is()`, `:where()`, `:not()`;
- `normalize()` now accepts an options object (`NormalizeOptions`);
  - `mode: 'html' | 'xml'` controls case-folding for element (tag) names, attribute names, and namespace prefixes (HTML mode lowercases; XML mode preserves case);
  - `attributesWithNormalizedValues` enables canonicalization of attribute values:
    - it is left to the user to provide attribute names for which values are to be treated as case-insensitive by default
      - Note: in some cases, attribute name might not be sufficient to determine case-sensitivity of its value. For now, this is chosen as good enough for the purposes of this library;
    - if an attribute selector has modifier `i`, its value is lowercased;
    - if modifier is omitted (`null`), the value is lowercased only for configured attribute names;
  - by default, missing modifiers are made explicit (`i` or `s`) for stable, comparable output; this can be disabled with `allowUnspecifiedCaseSensitivityForAttributes`.

Possibly breaking changes:

- `normalize()` output might differ for some selectors;
- `parse()` now supports more selectors - will return an AST instead of throwing an error for them.

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

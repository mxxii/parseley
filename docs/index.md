# API documentation - v0.7.0

## Table of contents

### Namespaces

- [Ast](modules/ast.md)

### Functions

- [compareSelectors](index.md#compareselectors)
- [compareSpecificity](index.md#comparespecificity)
- [normalize](index.md#normalize)
- [parse](index.md#parse)
- [parse1](index.md#parse1)
- [serialize](index.md#serialize)

## Functions

### compareSelectors

▸ **compareSelectors**(`a`, `b`): `number`

Compare selectors based on their specificity.

Usable as a comparator for sorting.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `a` | [SimpleSelector](modules/ast.md#simpleselector) \| [CompoundSelector](modules/ast.md#compoundselector) | First selector. |
| `b` | [SimpleSelector](modules/ast.md#simpleselector) \| [CompoundSelector](modules/ast.md#compoundselector) | Second selector. |

#### Returns

`number`

___

### compareSpecificity

▸ **compareSpecificity**(`a`, `b`): `number`

Compare specificity values without reducing them
as arbitrary base numbers.

Usable as a comparator for sorting.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `a` | [Specificity](modules/ast.md#specificity) | First specificity value. |
| `b` | [Specificity](modules/ast.md#specificity) | Second specificity value. |

#### Returns

`number`

___

### normalize

▸ **normalize**(`selector`): [Selector](modules/ast.md#selector)

Modifies the given AST **in place** to have all internal arrays
in a stable order. Returns the AST.

Intended for consistent processing and normalized `serialize()` output.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `selector` | [Selector](modules/ast.md#selector) | A selector AST object. |

#### Returns

[Selector](modules/ast.md#selector)

___

### parse

▸ **parse**(`str`): [ListSelector](modules/ast.md#listselector)

Parse a CSS selector string.

This function supports comma-separated selector lists
and always returns an AST starting from a node of type `list`.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `str` | `string` | CSS selector string (can contain commas). |

#### Returns

[ListSelector](modules/ast.md#listselector)

___

### parse1

▸ **parse1**(`str`): [CompoundSelector](modules/ast.md#compoundselector)

Parse a CSS selector string.

This function does not support comma-separated selector lists
and always returns an AST starting from a node of type `compound`.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `str` | `string` | CSS selector string (no commas). |

#### Returns

[CompoundSelector](modules/ast.md#compoundselector)

___

### serialize

▸ **serialize**(`selector`): `string`

Convert a selector AST back to a string representation.

Note: formatting is not preserved in the AST.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `selector` | [Selector](modules/ast.md#selector) | A selector AST object. |

#### Returns

`string`

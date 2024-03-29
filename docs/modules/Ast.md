# Namespace: Ast

## Table of contents

### Type Aliases

- [AttributePresenceSelector](Ast.md#attributepresenceselector)
- [AttributeValueSelector](Ast.md#attributevalueselector)
- [ClassSelector](Ast.md#classselector)
- [Combinator](Ast.md#combinator)
- [CompoundSelector](Ast.md#compoundselector)
- [IdSelector](Ast.md#idselector)
- [ListSelector](Ast.md#listselector)
- [Selector](Ast.md#selector)
- [SimpleSelector](Ast.md#simpleselector)
- [Specificity](Ast.md#specificity)
- [TagSelector](Ast.md#tagselector)
- [UniversalSelector](Ast.md#universalselector)

## Type Aliases

### AttributePresenceSelector

Ƭ **AttributePresenceSelector**: `Object`

Attribute presence selector.

[https://www.w3.org/TR/selectors/#attribute-selectors](https://www.w3.org/TR/selectors/#attribute-selectors)

`parseley` considers attribute presence and value selectors to be unrelated entities
for simplicity of processing.

#### Type declaration

| Name | Type |
| :------ | :------ |
| `name` | `string` |
| `namespace` | `string` \| ``null`` |
| `specificity` | [`Specificity`](Ast.md#specificity) |
| `type` | ``"attrPresence"`` |

___

### AttributeValueSelector

Ƭ **AttributeValueSelector**: `Object`

Attribute value selector.

[https://www.w3.org/TR/selectors/#attribute-selectors](https://www.w3.org/TR/selectors/#attribute-selectors)

`parseley` considers attribute presence and value selectors to be unrelated entities
for simplicity of processing.

#### Type declaration

| Name | Type |
| :------ | :------ |
| `matcher` | ``"="`` \| ``"~="`` \| ``"\|="`` \| ``"^="`` \| ``"$="`` \| ``"*="`` |
| `modifier` | ``"i"`` \| ``"s"`` \| ``null`` |
| `name` | `string` |
| `namespace` | `string` \| ``null`` |
| `specificity` | [`Specificity`](Ast.md#specificity) |
| `type` | ``"attrValue"`` |
| `value` | `string` |

___

### ClassSelector

Ƭ **ClassSelector**: `Object`

Class selector.

[https://www.w3.org/TR/selectors/#class-html](https://www.w3.org/TR/selectors/#class-html)

#### Type declaration

| Name | Type |
| :------ | :------ |
| `name` | `string` |
| `specificity` | [`Specificity`](Ast.md#specificity) |
| `type` | ``"class"`` |

___

### Combinator

Ƭ **Combinator**: `Object`

Represents a selectors combinator with what's on the left side of it.

[https://www.w3.org/TR/selectors/#combinators](https://www.w3.org/TR/selectors/#combinators)

#### Type declaration

| Name | Type |
| :------ | :------ |
| `combinator` | ``" "`` \| ``"+"`` \| ``">"`` \| ``"~"`` \| ``"\|\|"`` |
| `left` | [`CompoundSelector`](Ast.md#compoundselector) |
| `specificity` | [`Specificity`](Ast.md#specificity) |
| `type` | ``"combinator"`` |

___

### CompoundSelector

Ƭ **CompoundSelector**: `Object`

Compound selector - a set of conditions describing a single element.

[https://www.w3.org/TR/selectors/#compound](https://www.w3.org/TR/selectors/#compound)

[https://www.w3.org/TR/selectors/#complex](https://www.w3.org/TR/selectors/#complex)

Important note: due to the way `parseley` represents combinators,
every compound selector is also a complex selector with everything
connected from the left side.
Specificity value also includes any extra weight added by the left side.

If there is a combinator in the selector - it is guaranteed to be
the last entry in the list of inner selectors.

#### Type declaration

| Name | Type |
| :------ | :------ |
| `list` | [`SimpleSelector`](Ast.md#simpleselector)[] |
| `specificity` | [`Specificity`](Ast.md#specificity) |
| `type` | ``"compound"`` |

___

### IdSelector

Ƭ **IdSelector**: `Object`

Id selector.

[https://www.w3.org/TR/selectors/#id-selectors](https://www.w3.org/TR/selectors/#id-selectors)

#### Type declaration

| Name | Type |
| :------ | :------ |
| `name` | `string` |
| `specificity` | [`Specificity`](Ast.md#specificity) |
| `type` | ``"id"`` |

___

### ListSelector

Ƭ **ListSelector**: `Object`

Represents a comma-separated list of compound selectors.

[https://www.w3.org/TR/selectors/#selector-list](https://www.w3.org/TR/selectors/#selector-list)

As this kind of selector can combine different ways to match elements,
a single specificity value doesn't make sense for it and therefore absent.

#### Type declaration

| Name | Type |
| :------ | :------ |
| `list` | [`CompoundSelector`](Ast.md#compoundselector)[] |
| `type` | ``"list"`` |

___

### Selector

Ƭ **Selector**: [`ListSelector`](Ast.md#listselector) \| [`CompoundSelector`](Ast.md#compoundselector) \| [`SimpleSelector`](Ast.md#simpleselector)

Any kind of selector supported by `parseley`.

___

### SimpleSelector

Ƭ **SimpleSelector**: [`UniversalSelector`](Ast.md#universalselector) \| [`TagSelector`](Ast.md#tagselector) \| [`ClassSelector`](Ast.md#classselector) \| [`IdSelector`](Ast.md#idselector) \| [`AttributePresenceSelector`](Ast.md#attributepresenceselector) \| [`AttributeValueSelector`](Ast.md#attributevalueselector) \| [`Combinator`](Ast.md#combinator)

Any thing representing a single condition on an element.

[https://www.w3.org/TR/selectors/#simple](https://www.w3.org/TR/selectors/#simple)

`parseley` deviates from the spec here by adding `Combinator` to the enumeration.
This is done for simplicity of processing.

Combinator effectively considered an extra condition on a specific element
(*"have this kind of element in relation"*).

___

### Specificity

Ƭ **Specificity**: [`number`, `number`, `number`]

Specificity as defined by Selectors spec.

[https://www.w3.org/TR/selectors/#specificity](https://www.w3.org/TR/selectors/#specificity)

Three levels: for id, class, tag (type).

Extra level(s) used in HTML styling don't fit the scope of this package
and no space reserved for them.

___

### TagSelector

Ƭ **TagSelector**: `Object`

Tag name (type) selector.

[https://www.w3.org/TR/selectors/#type-selectors](https://www.w3.org/TR/selectors/#type-selectors)

`parseley` considers tag name and universal selectors to be unrelated entities
for simplicity of processing.

#### Type declaration

| Name | Type |
| :------ | :------ |
| `name` | `string` |
| `namespace` | `string` \| ``null`` |
| `specificity` | [`Specificity`](Ast.md#specificity) |
| `type` | ``"tag"`` |

___

### UniversalSelector

Ƭ **UniversalSelector**: `Object`

The `*` selector.

[https://www.w3.org/TR/selectors/#the-universal-selector](https://www.w3.org/TR/selectors/#the-universal-selector)

`parseley` considers tag name and universal selectors to be unrelated entities
for simplicity of processing.

#### Type declaration

| Name | Type |
| :------ | :------ |
| `namespace` | `string` \| ``null`` |
| `specificity` | [`Specificity`](Ast.md#specificity) |
| `type` | ``"universal"`` |

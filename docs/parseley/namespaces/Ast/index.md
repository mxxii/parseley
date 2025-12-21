[**parseley v0.13.0**](../../../index.md)

***

# Ast

Abstract Syntax Tree (AST) for CSS selectors.

Does not preserve original textual representation such as spacing, quoting style, etc.

Does preserve all information necessary to serialize back to equivalent selector string.

## Type Aliases

| Type Alias | Description |
| ------ | ------ |
| [AttributePresenceSelector](type-aliases/AttributePresenceSelector.md) | Attribute presence selector (`[attr]`). |
| [AttributeValueSelector](type-aliases/AttributeValueSelector.md) | Attribute value selector (`[attr=value]`). |
| [ClassSelector](type-aliases/ClassSelector.md) | Class selector (`.class`). |
| [Combinator](type-aliases/Combinator.md) | Represents a selectors combinator with what's on the left side of it. |
| [CompoundSelector](type-aliases/CompoundSelector.md) | Compound selector - a set of conditions describing a single element. |
| [FunctionalPseudoClassSelector](type-aliases/FunctionalPseudoClassSelector.md) | - |
| [IdSelector](type-aliases/IdSelector.md) | Id selector (`#id`). |
| [IsSelector](type-aliases/IsSelector.md) | - |
| [ListSelector](type-aliases/ListSelector.md) | Represents a comma-separated list of compound selectors. |
| [NotSelector](type-aliases/NotSelector.md) | - |
| [PseudoClassSelector](type-aliases/PseudoClassSelector.md) | - |
| [Selector](type-aliases/Selector.md) | Any kind of selector supported by `parseley`. |
| [SimpleSelector](type-aliases/SimpleSelector.md) | Any thing representing a single condition on an element. |
| [Specificity](type-aliases/Specificity.md) | Specificity as defined by Selectors spec. |
| [TagSelector](type-aliases/TagSelector.md) | Tag name (type) selector. |
| [UniversalSelector](type-aliases/UniversalSelector.md) | The `*` selector. |
| [WhereSelector](type-aliases/WhereSelector.md) | - |

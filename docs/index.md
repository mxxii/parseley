**parseley v0.13.1**

***

# parseley v0.13.1

## Namespaces

| Namespace | Description |
| ------ | ------ |
| [Ast](parseley/namespaces/Ast/index.md) | Abstract Syntax Tree (AST) for CSS selectors. |

## Type Aliases

| Type Alias | Description |
| ------ | ------ |
| [NormalizeOptions](type-aliases/NormalizeOptions.md) | Options controlling how `normalize()` canonicalizes a selector AST. |

## Functions

| Function | Description |
| ------ | ------ |
| [compareSelectors](functions/compareSelectors.md) | Compare selectors based on their specificity. |
| [compareSpecificity](functions/compareSpecificity.md) | Compare specificity values without reducing them as arbitrary base numbers. |
| [normalize](functions/normalize.md) | Modifies the given AST **in place** to a canonical form and stable ordering. Returns the AST. |
| [parse](functions/parse.md) | Parse a CSS selector string. |
| [parse1](functions/parse1.md) | Parse a CSS selector string. |
| [serialize](functions/serialize.md) | Convert a selector AST back to a string representation. |

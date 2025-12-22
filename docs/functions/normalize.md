[**parseley v0.13.1**](../index.md)

***

# Function: normalize()

```ts
function normalize(selector: Selector, options: NormalizeOptions): Selector;
```

Modifies the given AST **in place** to a canonical form and stable ordering.
Returns the AST.

Intended for consistent processing, easy comparison of equivalent selectors,
and normalized `serialize()` output.

## Parameters

<table>
<thead>
<tr>
<th>Parameter</th>
<th>Type</th>
<th>Description</th>
</tr>
</thead>
<tbody>
<tr>
<td>

`selector`

</td>
<td>

[`Selector`](../parseley/namespaces/Ast/type-aliases/Selector.md)

</td>
<td>

A selector AST object.

</td>
</tr>
<tr>
<td>

`options`

</td>
<td>

[`NormalizeOptions`](../type-aliases/NormalizeOptions.md)

</td>
<td>

Normalization options.

</td>
</tr>
</tbody>
</table>

## Returns

[`Selector`](../parseley/namespaces/Ast/type-aliases/Selector.md)

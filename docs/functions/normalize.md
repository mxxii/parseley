[**parseley v0.12.1**](../index.md)

***

# Function: normalize()

```ts
function normalize(selector: Selector): Selector;
```

Modifies the given AST **in place** to have all internal arrays
in a stable order. Returns the AST.

Intended for consistent processing and normalized `serialize()` output.

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
</tbody>
</table>

## Returns

[`Selector`](../parseley/namespaces/Ast/type-aliases/Selector.md)

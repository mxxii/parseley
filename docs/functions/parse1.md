[**parseley v0.13.1**](../index.md)

***

# Function: parse1()

```ts
function parse1(str: string): CompoundSelector;
```

Parse a CSS selector string.

This function does not support comma-separated selector lists
and always returns an AST starting from a node of type `compound`.

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

`str`

</td>
<td>

`string`

</td>
<td>

CSS selector string (no commas).

</td>
</tr>
</tbody>
</table>

## Returns

[`CompoundSelector`](../parseley/namespaces/Ast/type-aliases/CompoundSelector.md)

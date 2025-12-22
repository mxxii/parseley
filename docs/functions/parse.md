[**parseley v0.13.1**](../index.md)

***

# Function: parse()

```ts
function parse(str: string): ListSelector;
```

Parse a CSS selector string.

This function supports comma-separated selector lists
and always returns an AST starting from a node of type `list`.

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

CSS selector string (can contain commas).

</td>
</tr>
</tbody>
</table>

## Returns

[`ListSelector`](../parseley/namespaces/Ast/type-aliases/ListSelector.md)

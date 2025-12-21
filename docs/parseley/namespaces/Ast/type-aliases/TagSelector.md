[**parseley v0.13.0**](../../../../index.md)

***

# Type Alias: TagSelector

```ts
type TagSelector = object;
```

Tag name (type) selector.

[https://www.w3.org/TR/selectors/#type-selectors](https://www.w3.org/TR/selectors/#type-selectors)

`parseley` considers tag name and universal selectors to be unrelated entities
for simplicity of processing.

## Properties

<table>
<thead>
<tr>
<th>Property</th>
<th>Type</th>
</tr>
</thead>
<tbody>
<tr>
<td>

<a id="name"></a> `name`

</td>
<td>

`string`

</td>
</tr>
<tr>
<td>

<a id="namespace"></a> `namespace`

</td>
<td>

`string` \| `null`

</td>
</tr>
<tr>
<td>

<a id="specificity"></a> `specificity`

</td>
<td>

\[`0`, `0`, `1`\]

</td>
</tr>
<tr>
<td>

<a id="type"></a> `type`

</td>
<td>

`"tag"`

</td>
</tr>
</tbody>
</table>

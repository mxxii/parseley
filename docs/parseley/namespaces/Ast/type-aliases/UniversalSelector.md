[**parseley v0.13.1**](../../../../index.md)

***

# Type Alias: UniversalSelector

```ts
type UniversalSelector = object;
```

The `*` selector.

[https://www.w3.org/TR/selectors/#the-universal-selector](https://www.w3.org/TR/selectors/#the-universal-selector)

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

\[`0`, `0`, `0`\]

</td>
</tr>
<tr>
<td>

<a id="type"></a> `type`

</td>
<td>

`"universal"`

</td>
</tr>
</tbody>
</table>

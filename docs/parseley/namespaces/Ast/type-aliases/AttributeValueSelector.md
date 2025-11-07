[**parseley v0.12.1**](../../../../index.md)

***

# Type Alias: AttributeValueSelector

```ts
type AttributeValueSelector = object;
```

Attribute value selector (`[attr=value]`).

[https://www.w3.org/TR/selectors/#attribute-selectors](https://www.w3.org/TR/selectors/#attribute-selectors)

`parseley` considers attribute presence and value selectors to be unrelated entities
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

<a id="matcher"></a> `matcher`

</td>
<td>

`"="` \| `"~="` \| "\|=" \| `"^="` \| `"$="` \| `"*="`

</td>
</tr>
<tr>
<td>

<a id="modifier"></a> `modifier`

</td>
<td>

`"i"` \| `"s"` \| `null`

</td>
</tr>
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

[`Specificity`](Specificity.md)

</td>
</tr>
<tr>
<td>

<a id="type"></a> `type`

</td>
<td>

`"attrValue"`

</td>
</tr>
<tr>
<td>

<a id="value"></a> `value`

</td>
<td>

`string`

</td>
</tr>
</tbody>
</table>

[**parseley v0.12.1**](../../../../index.md)

***

# Type Alias: ListSelector

```ts
type ListSelector = object;
```

Represents a comma-separated list of compound selectors.

[https://www.w3.org/TR/selectors/#selector-list](https://www.w3.org/TR/selectors/#selector-list)

As this kind of selector can combine different ways to match elements,
a single specificity value doesn't make sense for it and therefore absent.

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

<a id="list"></a> `list`

</td>
<td>

[`CompoundSelector`](CompoundSelector.md)[]

</td>
</tr>
<tr>
<td>

<a id="type"></a> `type`

</td>
<td>

`"list"`

</td>
</tr>
</tbody>
</table>

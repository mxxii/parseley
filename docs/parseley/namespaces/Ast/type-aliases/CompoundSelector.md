[**parseley v0.12.1**](../../../../index.md)

***

# Type Alias: CompoundSelector

```ts
type CompoundSelector = object;
```

Compound selector - a set of conditions describing a single element.

[https://www.w3.org/TR/selectors/#compound](https://www.w3.org/TR/selectors/#compound)

[https://www.w3.org/TR/selectors/#complex](https://www.w3.org/TR/selectors/#complex)

Important note: due to the way `parseley` represents combinators,
every compound selector is also a complex selector with everything
connected from the left side.
Specificity value also includes any extra weight added by the left side.

If there is a combinator in the selector - it is guaranteed to be
the last entry in the list of inner selectors.

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

[`SimpleSelector`](SimpleSelector.md)[]

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

`"compound"`

</td>
</tr>
</tbody>
</table>

[**parseley v0.13.0**](../index.md)

***

# Function: compareSelectors()

```ts
function compareSelectors(a: 
  | CompoundSelector
  | SimpleSelector, b: 
  | CompoundSelector
  | SimpleSelector): number;
```

Compare selectors based on their specificity.

Usable as a comparator for sorting.

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

`a`

</td>
<td>

 \| [`CompoundSelector`](../parseley/namespaces/Ast/type-aliases/CompoundSelector.md) \| [`SimpleSelector`](../parseley/namespaces/Ast/type-aliases/SimpleSelector.md)

</td>
<td>

First selector.

</td>
</tr>
<tr>
<td>

`b`

</td>
<td>

 \| [`CompoundSelector`](../parseley/namespaces/Ast/type-aliases/CompoundSelector.md) \| [`SimpleSelector`](../parseley/namespaces/Ast/type-aliases/SimpleSelector.md)

</td>
<td>

Second selector.

</td>
</tr>
</tbody>
</table>

## Returns

`number`

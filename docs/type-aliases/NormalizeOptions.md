[**parseley v0.13.1**](../index.md)

***

# Type Alias: NormalizeOptions

```ts
type NormalizeOptions = object;
```

Options controlling how `normalize()` canonicalizes a selector AST.

## Properties

<table>
<thead>
<tr>
<th>Property</th>
<th>Type</th>
<th>Description</th>
</tr>
</thead>
<tbody>
<tr>
<td>

<a id="allowunspecifiedcasesensitivityforattributes"></a> `allowUnspecifiedCaseSensitivityForAttributes?`

</td>
<td>

`boolean`

</td>
<td>

When `false` (default), `normalize()` makes missing attribute value modifiers explicit (`i` or `s`).
When `true`, missing modifiers remain unspecified.

All attribute value selectors are considered case-sensitive (`s`) unless:

- they have an explicit `i` modifier, or
- their attribute name is listed in `attributesWithNormalizedValues`.

</td>
</tr>
<tr>
<td>

<a id="attributeswithnormalizedvalues"></a> `attributesWithNormalizedValues?`

</td>
<td>

`string`[]

</td>
<td>

Attribute names whose *values* should be lowercased by default.

Used only for attribute value selectors (`[name="value"]`)
with no explicit case-sensitivity modifier (`i` or `s`).

Is not affected by the `mode` option.

</td>
</tr>
<tr>
<td>

<a id="mode"></a> `mode?`

</td>
<td>

`"html"` \| `"xml"`

</td>
<td>

Case-folding mode.

- `html` (default): lowercases element/attribute names and namespace prefixes.
- `xml`: preserves case for those parts.

</td>
</tr>
</tbody>
</table>

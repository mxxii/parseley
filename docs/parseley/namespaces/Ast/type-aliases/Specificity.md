[**parseley v0.13.1**](../../../../index.md)

***

# Type Alias: Specificity

```ts
type Specificity = [number, number, number];
```

Specificity as defined by Selectors spec.

[https://www.w3.org/TR/selectors/#specificity](https://www.w3.org/TR/selectors/#specificity)

Three levels: for id, class, tag (type).

Extra level(s) used in HTML styling don't fit the scope of this package
and no space reserved for them.

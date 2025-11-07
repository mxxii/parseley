[**parseley v0.12.1**](../../../../index.md)

***

# Type Alias: SimpleSelector

```ts
type SimpleSelector = 
  | UniversalSelector
  | TagSelector
  | ClassSelector
  | IdSelector
  | AttributePresenceSelector
  | AttributeValueSelector
  | Combinator;
```

Any thing representing a single condition on an element.

[https://www.w3.org/TR/selectors/#simple](https://www.w3.org/TR/selectors/#simple)

`parseley` deviates from the spec here by adding `Combinator` to the enumeration.
This is done for simplicity of processing.

Combinator effectively considered an extra condition on a specific element
(*"have this kind of element in relation"*).

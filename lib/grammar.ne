@{%
const moo = require('moo');

const lexer = moo.compile({
  ws:         { match: /[ \t\r\n\f]+/, lineBreaks: true },
  idn:        { match: /[a-zA-Z_-][a-zA-Z0-9_-]*/ },
  hashToken:  { match: /#[a-zA-Z0-9_-]+/,         value: (s) => s.slice(1)    },
  str1:       { match: /'(?:\\['\\]|[^\n'\\])*'/, value: (s) => s.slice(1,-1) },
  str2:       { match: /"(?:\\["\\]|[^\n"\\])*"/, value: (s) => s.slice(1,-1) },
  asterisk:   '*',
  fullstop:   '.',
  comma:      ',',
  lbr:        '[',
  rbr:        ']',
  eq:         '=',
  gt:         '>',
  vbar:       '|',
  plus:       '+',
  tilde:      '~',
  caret:      '^',
  dollar:     '$',
//colon:      ':',
//lpar:       '(',
//rpar:       ')',
});

const firstTokenValue = ([{value: v}]) => v;
const second = ([, v]) => v;
const sumSpec = ([a0, a1, a2], [b0, b1, b2]) => [a0+b0, a1+b1, a2+b2];
%}

@lexer lexer

main       -> _ listSelector _    {% second %}
mainNoList -> _ complexSelector _ {% second %}

listSelector -> complexSelector                         {%
                  ([next])        => ({ type:'list', list: [next]              }) %}
              | listSelector _ %comma _ complexSelector {%
                  ([acc,,,,next]) => ({ type:'list', list: [...acc.list, next] }) %}

complexSelector  -> compoundSelector                                {% id %}
                  | complexSelector __ compoundSelector             {%
                      ([left,,right]) => ({
                        type:        'compound',
                        list:        [...right.list, { type:'combinator', combinator:' ', left:left }],
                        specificity: sumSpec(left.specificity, right.specificity)
                      }) %}
                  | complexSelector _ combinator _ compoundSelector {%
                      ([left,,c,,right]) => ({
                        type:        'compound',
                        list:        [...right.list, { type:'combinator', combinator:c, left:left }],
                        specificity: sumSpec(left.specificity, right.specificity)
                      }) %}

combinator -> %gt         {% () => '>'  %}
            | %plus       {% () => '+'  %}
            | %tilde      {% () => '~'  %}
            | %vbar %vbar {% () => '||' %}

compoundSelector -> typeSelector                      {%
                      ([next])     => ({
                        type:        'compound',
                        list:        [next],
                        specificity: next.specificity
                      }) %}
                  | subclassSelector                  {%
                      ([next])     => ({
                        type:        'compound',
                        list:        [next],
                        specificity: next.specificity
                      }) %}
                  | compoundSelector subclassSelector {%
                      ([acc,next]) => ({
                        type:        'compound',
                        list:        [...acc.list, next],
                        specificity: sumSpec(acc.specificity, next.specificity)
                      }) %}

subclassSelector -> idSelector           {% id %}
                  | classSelector        {% id %}
                  | attrSelector         {% id %}

attrSelector     -> attrPresenceSelector {% id %}
                  | attrValueSelector    {% id %}

typeSelector     -> tagSelector          {% id %}
                  | uniSelector          {% id %}

attrPresenceSelector -> %lbr _ wqname _ %rbr {%
  ([,,wqname]) => ({
    type:         'attrPresence',
    name:         wqname.name,
    namespace:    wqname.namespace,
    specificity:  [0,1,0]
  })
%}

attrValueSelector  -> %lbr _ wqname _ attrMatcher _ attrValue _ %rbr {%
  ([,,wqname,,matcher,,v]) => ({
    type:         'attrValue',
    name:         wqname.name,
    namespace:    wqname.namespace,
    matcher:      matcher,
    value:        v.value,
    modifier:     v.modifier,
    specificity:  [0,1,0]
  })
%}

attrMatcher  -> %eq           {% () => '='  %}
              | %tilde %eq    {% () => '~=' %}
              | %vbar %eq     {% () => '|=' %}
              | %caret %eq    {% () => '^=' %}
              | %dollar %eq   {% () => '$=' %}
              | %asterisk %eq {% () => '*=' %}

attrValue    -> str                 {% ([v])      => ({ value:v, modifier:null }) %}
              | idn                 {% ([v])      => ({ value:v, modifier:null }) %}
              | str _ attrModifier  {% ([v,,mod]) => ({ value:v, modifier:mod  }) %}
              | idn __ attrModifier {% ([v,,mod]) => ({ value:v, modifier:mod  }) %}

attrModifier -> "i" {% () => 'i' %}
              | "I" {% () => 'i' %}
              | "s" {% () => 's' %}
              | "S" {% () => 's' %}

idSelector    -> %hashToken {% ([{value: name}]) => ({ type:'id', name:name, specificity:[1,0,0] }) %}
classSelector -> %fullstop idn {% ([,name])   => ({ type:'class', name:name, specificity:[0,1,0] }) %}

tagSelector   -> wqname         {%
  ([wqname]) => ({
    type:         'tag',
    name:         wqname.name,
    namespace:    wqname.namespace,
    specificity:  [0,0,1]
  })
%}

uniSelector -> %asterisk    {% ()     => ({ type:'universal', namespace:null, specificity:[0,0,0] }) %}
             | ns %asterisk {% ([ns]) => ({ type:'universal', namespace:ns,   specificity:[0,0,0] }) %}

# CSS qualified name - name with optional namespace prefix
wqname -> idn     {% ([name])    => ({ name:name, namespace:null }) %}
        | ns idn  {% ([ns,name]) => ({ name:name, namespace:ns   }) %}

# Namespace prefix
ns   -> %vbar     {% () => '' %}
      | idn %vbar {% id %}

# Single- or double-quoted string
str  -> %str1 {% firstTokenValue %}
      | %str2 {% firstTokenValue %}

idn  -> %idn  {% firstTokenValue %}

_  -> %ws:? {% () => null %}  # Optional whitespace
__ -> %ws   {% () => null %}  # Mandatory whitespace

import type * as Ast from './ast.ts';

/**
 * Convert a selector AST back to a string representation.
 *
 * Note: formatting is not preserved in the AST.
 *
 * @param selector - A selector AST object.
 */
export function serialize (selector: Ast.Selector): string {
  if (!selector.type) {
    throw new Error('This is not an AST node.');
  }
  switch (selector.type) {
    case 'universal':
      return _serNs(selector.namespace) + '*';
    case 'tag':
      return _serNs(selector.namespace) + _serIdent(selector.name);
    case 'class':
      return '.' + _serIdent(selector.name);
    case 'id':
      return '#' + _serIdent(selector.name);
    case 'attrPresence':
      return `[${_serNs(selector.namespace)}${_serIdent(selector.name)}]`;
    case 'attrValue':
      return `[${_serNs(selector.namespace)}${_serIdent(selector.name)}${selector.matcher}"${_serStr(selector.value)}"${(selector.modifier ? selector.modifier : '')}]`;
    case 'combinator':
      return serialize(selector.left) + selector.combinator;
    case 'compound':
      return selector.list.reduce((acc, node) => {
        return node.type === 'combinator'
          ? serialize(node) + acc
          : acc + serialize(node);
      }, '');
    case 'list':
      return selector.list.map(serialize).join(',');
  }
}

function _serNs (ns: string | null): string {
  return (ns || ns === '')
    ? _serIdent(ns) + '|'
    : '';
}

// https://w3c.github.io/csswg-drafts/cssom/#serialize-an-identifier

function _codePoint (char: string) {
  return `\\${char.codePointAt(0)!.toString(16)} `;
}

function _serIdent (str: string): string {
  return str.replace(
    // eslint-disable-next-line no-control-regex
    /(^[0-9])|(^-[0-9])|(^-$)|([-0-9a-zA-Z_]|[^\x00-\x7F])|(\x00)|([\x01-\x1f]|\x7f)|([\s\S])/g,
    (_m, d1, d2, hy, safe, nl, ctrl, other) =>
      d1 ? _codePoint(d1 as string)
      : d2 ? '-' + _codePoint((d2 as string).slice(1))
      : hy ? '\\-'
      : safe ? safe as string
      : nl ? '\ufffd'
      : ctrl ? _codePoint(ctrl as string)
      : '\\' + (other as string),
  );
}

function _serStr (str: string): string {
  return str.replace(
    // eslint-disable-next-line no-control-regex
    /(")|(\\)|(\x00)|([\x01-\x1f]|\x7f)/g,
    (_m, dq, bs, nl, ctrl) =>
      dq ? '\\"'
      : bs ? '\\\\'
      : nl ? '\ufffd'
      : _codePoint(ctrl as string),
  );
}

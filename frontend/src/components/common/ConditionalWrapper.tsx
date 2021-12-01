import * as React from 'react';

export type Props = {
    condition: boolean;
    wrapper: (children: JSX.Element | JSX.Element[]) => JSX.Element;
    children: JSX.Element | JSX.Element[];
}

/**
 * Conditionally wraps the supplied children with a supplied wrapping component.
 * @param {boolean} condition Condition, when truth the component will
 * be wrapped with the supplied wrapping component
 * @param {JSX.Element} wrapper The comonent capable of wrapping the supplied
 * children.
 * @param {JSX.Element | JSX.Element[]} children The children to wrap.
 * @return {JSX.Element}
 * @constructor
 */
export function ConditionalWrapper({
  condition,
  wrapper,
  children,
}: Props): JSX.Element {
  return condition ? wrapper(children) : <>{children}</>;
}

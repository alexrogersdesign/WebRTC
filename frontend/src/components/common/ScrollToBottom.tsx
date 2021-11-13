import React, {useEffect, useRef} from 'react';

/**
 * An element that forces the browser to scroll to its location when its rendered
 * @constructor none
 */
export function ScrollToBottom() {
  const elementRef = useRef<HTMLDivElement>(null!);
  useEffect(() => elementRef?.current?.scrollIntoView());
  return <div ref={elementRef} />;
};

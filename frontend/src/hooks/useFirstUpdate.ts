import {useRef, useEffect} from 'react';

/**
 * A hook that indicates whether the application is currently
 * on its first render cycle.
 * @return {[boolean]} A boolean indicating whether the application is
 * on is first render cycle.
 */
const useFirstUpdate = () => {
  const firstUpdate = useRef(true);
  useEffect(() => {
    if (firstUpdate.current) {
      firstUpdate.current = false;
    }
  });
  return [firstUpdate.current] as const;
};

export {useFirstUpdate};

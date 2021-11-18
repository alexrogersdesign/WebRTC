import {useEffect} from 'react';
import WebFont from 'webfontloader';

/**
 * Helper component which loads fonts into the application
 * @constructor none
 */
export function FontLoader() {
  useEffect(() => {
    WebFont.load({
      google: {
        families: ['Nunito'],
      },
    });
  }, [] );
  return null;
};

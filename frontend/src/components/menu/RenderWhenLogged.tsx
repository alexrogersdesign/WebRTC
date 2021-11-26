import AccountInfo from '../common/AccountInfo';
import React, {useContext} from 'react';
import {RestContext} from '../../context/RestContext';

/**
 * Components to render when a user is logged in.
 * @return {JSX.Element}
 * @function
 */
export default function RenderWhenLogged() {
  const {currentUser} = useContext(RestContext);
  if (!currentUser) return <></>;
  return (
    <AccountInfo/>
  );
}

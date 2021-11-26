import ListItem from '@material-ui/core/ListItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import FiberNewIcon from '@material-ui/icons/FiberNew';
import ListItemText from '@material-ui/core/ListItemText';
import ExitToAppIcon from '@material-ui/icons/ExitToApp';
import React, {useContext} from 'react';
import {RestContext} from '../../context/RestContext';


interface Props {
    setCreateAccountModalOpen: React.Dispatch<React.SetStateAction<boolean>>
    setLoginModalOpen: React.Dispatch<React.SetStateAction<boolean>>
}

/**
 * The components to render when not logged in
 * @return {JSX.Element}
 * @function
 */
export default function RenderWhenNotLogged({
  setLoginModalOpen,
  setCreateAccountModalOpen,
}:Props) {
  const {currentUser} = useContext(RestContext);

  const loginDialog = 'Login';
  const createAccountDialog = 'Create Account';
  if (!currentUser) {
    return (
      <>
        <ListItem
          button
          onClick={() => setCreateAccountModalOpen(true)}
          id='create-account-button'
          aria-label='create account button'
        >
          <ListItemIcon> <FiberNewIcon /></ListItemIcon>
          <ListItemText primary={createAccountDialog} />
        </ListItem>
        <ListItem
          button
          onClick={() => setLoginModalOpen(true)}
          id='login-button'
          aria-label='login button'
        >
          <ListItemIcon> <ExitToAppIcon /></ListItemIcon>
          <ListItemText primary={loginDialog} />
        </ListItem>
      </>);
  } else return <></>;
}

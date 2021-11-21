import ListItem from '@material-ui/core/ListItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ExitToAppIcon from '@material-ui/icons/ExitToApp';
import ListItemText from '@material-ui/core/ListItemText';
import React, {useContext} from 'react';
import {RestContext} from '../../context/rest/RestContext';
import {createStyles, makeStyles} from '@material-ui/core/styles';

const useStyles = makeStyles(() =>
  createStyles({
    red: {
      color: '#f44336',
    },
  }),
);


/**
 * Renders the logout button
 * @return {JSX.Element}
 * @function
 */
export default function LogoutButton() {
  const classes = useStyles();
  const {logout} = useContext(RestContext);
  const logoutDialog = 'Logout';
  return (
    <>
      <ListItem
        button
        onClick={logout}
        id='logout-button'
        aria-label='logout button'
      >
        <ListItemIcon className={classes.red}>
          <ExitToAppIcon />
        </ListItemIcon>
        <ListItemText primary={logoutDialog} />
      </ListItem>
    </>
  );
}

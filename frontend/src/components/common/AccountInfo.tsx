/* eslint-disable no-unused-vars */
import React, {useContext} from 'react';
import Typography from '@material-ui/core/Typography';
import {RestContext} from '../../context/rest/RestContext';
import {createStyles, makeStyles, Theme} from '@material-ui/core/styles';
import Container from '@material-ui/core/Container';


interface Props {}
const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    container: {
      // height: '100%',
      width: '100%',
      display: 'flex',
      // flexWrap: 'nowrap',
      // flexDirection: 'column',
      justifyContent: 'flex-end',
      alignItems: 'flex-end',
      alignContent: 'flex-end',
      // borderWidth: 10,
      // border: '1px solid red',
      padding: theme.spacing(0, 1, 0),
    },
    username: {
      fontWeight: 'bold',
      padding: theme.spacing(0, .5, 0),
    },
  }),
);
const AccountInfo = (props: Props) => {
  const classes = useStyles();
  const {currentUser} = useContext(RestContext);
  return (
    <div className={classes.container}>
      <Typography
        variant='caption'
      >
          Logged in as
        <span className={classes.username}>
          {currentUser?.fullName}
        </span>
      </Typography>
    </div>
  );
};

export default AccountInfo;

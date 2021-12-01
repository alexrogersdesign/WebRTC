import React from 'react';
import {OptionsObject, SnackbarProvider} from 'notistack';
import {useTheme} from '@material-ui/core/styles';
import {createStyles, makeStyles} from '@material-ui/core/styles';
import useMediaQuery from '@material-ui/core/useMediaQuery';

import {ChildrenProps} from '../shared/types';

const useStyles = makeStyles((theme) =>
  createStyles({
    anchorOriginTopCenter: {
      [theme.breakpoints.down('sm')]: {
        paddingTop: '6vh',
      },
    },
  }),
);

/**
 * Provides the notification context which allows
 * notifications to be called from within the application.
 * @param {React.Children} children
 * @return {JSX.Element}
 */
const NotificationProvider = ({children}: ChildrenProps) => {
  const classes = useStyles();
  const sm = useMediaQuery(useTheme().breakpoints.down('sm'));

  return (
    <SnackbarProvider
      maxSnack={3}
      preventDuplicate
      dense={sm?? false}
      classes={classes}
    >
      {children}
    </SnackbarProvider>
  );
};

export const snackbarSuccessOptions = (sm?: boolean): OptionsObject => {
  return {
    variant: 'success',
    autoHideDuration:
    2000,
    anchorOrigin:
    {
      vertical: sm? 'top':'bottom',
      horizontal:
      'center',
    }
    ,
  };
};

export const snackbarWarnOptions =(sm?:boolean) :OptionsObject => {
  return {
    variant: 'warning',
    autoHideDuration:
    2000,
    anchorOrigin:
    {
      vertical: sm? 'top':'top',
      horizontal: 'center',
    }
    ,
  };
};
export const snackbarErrorOptions =(sm?:boolean) :OptionsObject => {
  return {
    variant: 'error',
    autoHideDuration:
    2000,
    anchorOrigin:
    {
      vertical: sm? 'top':'top',
      horizontal: 'center',
    }
    ,
  };
};
export const snackbarInfoOptions = (sm:boolean) :OptionsObject => {
  return {
    variant: 'info',
    autoHideDuration:
    2000,
    anchorOrigin:
    {
      vertical: sm? 'top': 'bottom',
      horizontal: sm? 'center': 'left',
    }
    ,
  };
};

export default NotificationProvider;

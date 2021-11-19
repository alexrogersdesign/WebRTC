/* eslint-disable no-unused-vars */
import React, {useContext, useEffect, useState} from 'react';
import {makeStyles, Theme, createStyles} from '@material-ui/core/styles';
import SnackbarContent from '@material-ui/core/SnackbarContent';
import Snackbar, {SnackbarOrigin} from '@material-ui/core/Snackbar';
import {MediaControlContext} from '../../context/MediaControlContext';
import Button from '@material-ui/core/Button';
import {SocketIOContext} from '../../context/SocketIOContext';
import {ChildrenProps} from '../../shared/types';
import {Alert} from '@material-ui/lab';


const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      'maxWidth': 600,
      '& > * + *': {
        marginTop: theme.spacing(2),
      },
    },
  }),
);

interface TutorialProps {
    action?: () => void;
    message: string;
    buttonLabel?: string,
    anchorOrigin?: SnackbarOrigin | undefined
    synchronizeOpen?: boolean
    synchronizeClose?: boolean
}
interface ExternalStateProps {
    externalState: boolean;
    setExternalState: (state:boolean)=> void;
}

type Props = TutorialProps | (TutorialProps & ExternalStateProps)

/**
 * A component that displays a tutorial prompt message
 * @param {Props} props the props to pass the the component
 * @constructor
 */
const TutorialPrompt = (props: Props) => {
  const {
    action,
    message,
    buttonLabel='OK',
    anchorOrigin,
    synchronizeOpen,
  } = props;
  const classes = useStyles();
  const [open, setOpen] = useState(true);

  /* Synchronize external state */
  useEffect(() => {
    synchronizeOpen && setOpen(synchronizeOpen);
  }, [synchronizeOpen]);


  return (
    <div className={classes.root}>
      <Snackbar
        open={open}
        anchorOrigin={anchorOrigin?? {vertical: 'top', horizontal: 'center'}}
      >
        <Alert
          icon={false}
          severity='success'
          onClose={()=> setOpen(false)}
          action={
            action? (
              <Button color="secondary" onClick={action}>
                {buttonLabel}
              </Button>
            ): undefined
          }
        >
          {message}
        </Alert>
      </Snackbar>
    </div>
  );
};

export default TutorialPrompt;

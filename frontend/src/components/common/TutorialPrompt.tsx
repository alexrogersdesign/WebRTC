/* eslint-disable no-unused-vars */
import React, {useContext, useEffect, useRef, useState} from 'react';
import {makeStyles, Theme, createStyles} from '@material-ui/core/styles';
import Snackbar, {SnackbarOrigin} from '@material-ui/core/Snackbar';
import Button from '@material-ui/core/Button';
import {Alert, AlertTitle} from '@material-ui/lab';
import {Portal} from '@material-ui/core';
import {OptionsContext} from '../../context/OptionsContext';
import AlertDialog from './AlertDialog';


const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      'maxWidth': 600,
      '& > * + *': {
        'marginTop': theme.spacing(2),
      },
    },
    snackbar: {
      // 'minHeight': 50,
    },
    disable: {
      padding: 0,
      margin: 0,

    },
    disableText: {
      color: theme.palette.neutralGray.dark,
      fontSize: 10,
      padding: 0,
      margin: 0,
      // border: '1px solid red',

    },
  }),
);

interface TutorialProps {
    action?: () => void
    message: string
    defaultOpen?:boolean
    verticalOffset?: number | string
    horizontalOffset?: number | string
    buttonLabel?: string
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
    synchronizeClose,
    verticalOffset,
    horizontalOffset,
    defaultOpen=true,
  } = props;
  const classes = useStyles();
  const {setTutorialEnabled, tutorialEnabled} = useContext(OptionsContext);
  const [open, setOpen] = useState(defaultOpen);
  const firstUpdate = useRef(true);

  /* Synchronize external state if not first render */
  useEffect(() => {
    if (synchronizeOpen === true && !firstUpdate.current) {
      setOpen(true);
    }
  }, [synchronizeOpen, firstUpdate]);

  useEffect(() => {
    if (synchronizeClose === false && !firstUpdate.current) {
      setOpen(false);
    }
  }, [synchronizeClose, firstUpdate]);

  /* Keep track of first render */
  useEffect(() => {
    if (firstUpdate.current) firstUpdate.current = false;
  }, []);
  const [alertOpen, setAlertOpen] = useState(false);
  const handleDisable = () => {
    setTutorialEnabled(false);
  };

  if (!tutorialEnabled) return <></>;
  return (
    <Portal>
      <div className={classes.root}>
        <Snackbar
          style={
            {
              height: verticalOffset? '5%': undefined,
              top: verticalOffset? `${verticalOffset}` : undefined,
              left: horizontalOffset? `${horizontalOffset}`: undefined,
            }
          }
          className={classes.snackbar}
          open={open}
          anchorOrigin={
            anchorOrigin?? {vertical: 'top', horizontal: 'center'}
          }
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
            <AlertTitle>
                Tutorial
              <Button
                variant='text'
                onClick={()=> setAlertOpen(true)}
                className={classes.disable}
                size={'small'}
                classes={{textSizeSmall: classes.disableText}}
              >
                Disable
              </Button>
            </AlertTitle>
            {message}
          </Alert>
        </Snackbar>
        <AlertDialog
          open={alertOpen}
          setOpen={setAlertOpen}
          title={'Disable Tutorial?'}
          dialog={'Tutorial can be enabled again in menu'}
          action={handleDisable}
          confirmLabel={'Disable'}
          cancelLabel={'Cancel'}
          warn
        />
      </div>
    </Portal>
  );
};

export default TutorialPrompt;

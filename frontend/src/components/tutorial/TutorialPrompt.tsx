import React, {useContext, useEffect, useRef, useState} from 'react';
import {makeStyles, Theme, createStyles} from '@material-ui/core/styles';
import Snackbar, {SnackbarOrigin} from '@material-ui/core/Snackbar';
import Button from '@material-ui/core/Button';
import {Alert, AlertTitle} from '@material-ui/lab';
import {Portal} from '@material-ui/core';
import {OptionsContext} from '../../context/OptionsContext';
import AlertDialog from '../common/AlertDialog';


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
    anchorOrigin?: SnackbarOrigin
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
 * @param {function} action The action to be called if the tutorial
 * button is pressed.
 * @param {string} message The message to display in the tutorial.
 * @param {string} buttonLabel The label for the button.
 * @param {SnackbarOrigin | undefined} anchorOrigin The anchorOrigin props that
 * define the placement of the tutorial on the screen.
 * @param {any} synchronizeOpen The tutorials open state is synchronized to
 * the provided parameter. If the parameter is truthy, the tutorial will open.
 * If the parameter is falsy, no change happens.
 * @param {any} synchronizeClose The tutorials close state is synchronized to
 * the provided parameter. If the parameter is falsy, the tutorial will close.
 * If the parameter is truthy, no change happens.
 * @param {string | number} verticalOffset The css offset to be applied to
 * the element. It is applied as a "Top" css rule i.e: {Top: verticalOffset}.
 * If a string is provided, it must be a valid parameter to the css rule.
 * i.e: "10%".
 * @param {string | number} horizontalOffset The css offset to be applied to
 * the element. It is applied as a "Left" css rule i.e: {Left: horizontalOffset}
 * . If a string is provided, it must be a valid parameter to the css rule.
 * i.e: "10%".
 * @param {boolean} defaultOpen The default state of the tutorial.
 * @function
 * @return {React.FC}
 */
const TutorialPrompt = ({
  action,
  message,
  buttonLabel='OK',
  anchorOrigin,
  synchronizeOpen,
  synchronizeClose,
  verticalOffset,
  horizontalOffset,
  defaultOpen=true,
}: Props) => {
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
  /** Keep track of first render */
  useEffect(() => {
    if (firstUpdate.current) firstUpdate.current = false;
  }, []);
  const [alertOpen, setAlertOpen] = useState(false);
  const handleDisable = () => {
    setTutorialEnabled(false);
    setOpen(false);
  };

  /** Reopens tutorial if the tutorial state change from false to true
   * i.e when the user re-enables tutorials */
  useEffect(() => {
    setOpen(tutorialEnabled);
  }, [tutorialEnabled]);


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
          title={'Disable tutorial?'}
          dialog={'tutorial can be enabled again in menu'}
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

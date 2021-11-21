import React from 'react';
import {makeStyles, Theme, createStyles} from '@material-ui/core/styles';
import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';


const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    paper: {
      width: '75%',
    },
    warn: {
      color: '#f44336',
    },
  }),
);

interface Props {
    open: boolean,
    setOpen: (open:boolean) => void,
    title: string,
    dialog: string,
    action: () => void,
    confirmLabel?: string,
    cancelLabel?: string,
    warn?: boolean
}


/**
 * A component to display an alert dialog.
 * @param {boolean} open - The open state of the alert
 * @param {useStateCallback} setOpen - React Use
 * @param {string } title - The alert title.
 * @param {string} dialog - The alert dialog.
 * @param {function} action - The function to be called when confirm
 * button is pressed.
 * @param {string} confirmLabel - The label for the confirm button.
 * @param {string} cancelLabel - The label for the cancel button.
 * @param {boolean} - warn Displays the dialog as a warning.
 * @function
 * @return {React.FC}
 */
const AlertDialog = ({
  open,
  setOpen,
  title,
  dialog,
  action,
  confirmLabel,
  cancelLabel,
  warn,
}:Props) => {
  const classes = useStyles();
  const handleCancel = () => {
    setOpen(false);
  };
  const handleConfirm = () => {
    action();
    setOpen(false);
  };

  return (
    <div>
      <Dialog
        open={open}
        onClose={handleCancel}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title">
          {title}
        </DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
            {dialog}
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCancel} color="primary">
            {cancelLabel?? 'Cancel'}
          </Button>
          <Button
            className={warn? classes.warn: undefined}
            onClick={(handleConfirm)}
            color="primary"
            autoFocus>
            {confirmLabel?? 'Ok'}
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
};
/**
 * React Use State Callback
 * @callback UseStateCallBack
 * @param {boolean} state The state to update to
 * @returns {void}
 * @type {(props : Props) => string}
 */


export default AlertDialog;

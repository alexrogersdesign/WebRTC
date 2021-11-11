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

const AlertDialog = (props:Props) => {
  const {
    open,
    setOpen,
    title,
    dialog,
    action,
    confirmLabel,
    cancelLabel,
    warn,
  } = props;
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

export default AlertDialog;

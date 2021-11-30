/* eslint-disable no-unused-vars */
import React from 'react';
import {makeStyles,
  Theme,
  createStyles,
  useTheme} from '@material-ui/core/styles';
import Backdrop from '@material-ui/core/Backdrop';
import Fade from '@material-ui/core/Fade';
import useMediaQuery from '@material-ui/core/useMediaQuery';
import Dialog from '@material-ui/core/Dialog';


const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    modal: {
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
    },
    dialogContent: {
      display: 'flex',
      justifyContent: 'center',
    },
  }),
);

export interface ModalProps {
    open: boolean,
    setOpen: (open: boolean) => void,
}

interface Props <T> extends ModalProps{
    PropComponent: React.ComponentType<T & ModalProps>,
    ariaLabeledBy?: string,
    ariaDescribedBy?: string
}

const ModalWrapper= <T, >({
  open,
  setOpen,
  PropComponent,
  ariaDescribedBy,
  ariaLabeledBy,
  ...remainingProps
}: Props<T>) => {
  const classes = useStyles();
  const handleClose = () => setOpen(false);

  return (
    <>
      <Dialog
        className={classes.modal}
        open={open}
        onClose={handleClose}
        maxWidth='lg'
        fullWidth
        aria-labelledby={ariaLabeledBy}
        aria-describedby={ariaDescribedBy}
        closeAfterTransition
        BackdropComponent={Backdrop}
        BackdropProps={{
          timeout: 500,
        }}
      >
        <Fade in={open} timeout={{enter: 750, exit: 250}}>
          <div className={classes.dialogContent}>
            <PropComponent
              setOpen={setOpen}
              open={open}
              {...(remainingProps as T)}
            />
          </div>
        </Fade>
      </Dialog>
    </>
  );
};

export default ModalWrapper;

export interface FormProps extends ModalProps{
}

/* eslint-disable no-unused-vars */
import React, {Component, useRef} from 'react';
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
// interface PassedProps<T> {
//     data: T;
// }

interface Props <T> extends ModalProps{
    Component: React.ComponentType<T & ModalProps>,
    ariaLabeledBy?: string,
    ariaDescribedBy?: string
}
// const displayName =
//     Component.displayName || Component.name || 'Component';

const ModalWrapper= <T, >({
  open,
  setOpen,
  Component,
  ariaDescribedBy,
  ariaLabeledBy,
  ...remainingProps
}: Props<T>) => {
  // TODO investigate double rendering
  // TODO implement aria label and described
  const classes = useStyles();
  const theme = useTheme();
  const fullScreen = useMediaQuery(theme.breakpoints.down('sm'));
  const handleClose = () => setOpen(false);
  return (
    <div>
      <Dialog
        className={classes.modal}
        open={open}
        onClose={handleClose}
        maxWidth='lg'
        fullWidth
        aria-labelledby={ariaLabeledBy}
        aria-describedby={ariaDescribedBy}
        // fullScreen={fullScreen}
        closeAfterTransition
        BackdropComponent={Backdrop}
        BackdropProps={{
          timeout: 500,
        }}
      >
        <>
          <Fade in={open} timeout={{enter: 750, exit: 250}}>
            <div className={classes.dialogContent}>
              <Component
                setOpen={setOpen}
                open={open}
                {...(remainingProps as T)}
              />
            </div>
          </Fade>
        </>
      </Dialog>
    </div>
  );
};

export default ModalWrapper;

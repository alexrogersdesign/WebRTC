/* eslint-disable no-unused-vars */
import React, {Component, useContext, useEffect} from 'react';
import {makeStyles, Theme, createStyles} from '@material-ui/core/styles';
import Backdrop from '@material-ui/core/Backdrop';
import Fade from '@material-ui/core/Fade';

import Modal from '@material-ui/core/Modal';
import {DialogContent} from '@material-ui/core';


const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    modal: {
      display: 'flex',
      alignItems: 'center',
      // justifyContent: 'center',
    },
    dialogContent: {
      display: 'flex',
      // flexDirection: 'row',
      // alignItems: 'center',
      justifyContent: 'center',
    },
  }),
);

export interface ModalProps {
    open: boolean,
    setOpen: (open: boolean) => void,
}
interface PassedProps<T> {
    data: T;
}

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
  const handleClose = () => setOpen(false);
  return (
    <div>
      <Modal
        className={classes.modal}
        open={open}
        onClose={handleClose}
        aria-labelledby={ariaLabeledBy}
        aria-describedby={ariaDescribedBy}
        closeAfterTransition
        BackdropComponent={Backdrop}
        BackdropProps={{
          timeout: 500,
        }}
      >
        <>
          <Fade in={open} timeout={{enter: 750, exit: 250}}>
            <DialogContent className={classes.dialogContent}>
              <Component
                setOpen={setOpen}
                open={open}
                {...(remainingProps as T)}
              />
            </DialogContent>
          </Fade>
        </>
      </Modal>
    </div>
  );
};

export default ModalWrapper;

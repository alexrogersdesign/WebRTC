/* eslint-disable no-unused-vars */
import React, {ReactComponentElement, useContext, useEffect} from 'react';
import {makeStyles, Theme, createStyles} from '@material-ui/core/styles';
import Backdrop from '@material-ui/core/Backdrop';
import Fade from '@material-ui/core/Fade';

import Modal from '@material-ui/core/Modal';
import {DialogContent} from '@material-ui/core';

export interface ModalProps {
    open: boolean,
    setOpen: React.Dispatch<React.SetStateAction<boolean>>,
}

interface Props extends ModalProps{
    // eslint-disable-next-line max-len
    Component: React.ForwardRefExoticComponent<ModalProps & React.RefAttributes<HTMLDivElement>>
    // eslint-disable-next-line max-len
    // Component: React.ForwardRefExoticComponent<Props & React.RefAttributes<HTMLDivElement>>
    componentProps?: any,
    ariaLabeledBy?: string,
    ariaDescribedBy?: string
}

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    listItem: {
      display: 'flex',
      // alignItems: 'flex-start',
    },
    secondary: {
      // padding: theme.spacing(0, 70, 0),
      alignSelf: 'flex-start',
    },
    paper: {
      backgroundColor: theme.palette.background.paper,
      border: '2px solid #000',
      borderRadius: 5,
      boxShadow: theme.shadows[5],
      padding: theme.spacing(2, 4, 3),
      zIndex: 99,
    },
    modal: {
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
    },
    item: {
      margin: theme.spacing(0, 0, 1),
    },
    title: {
      display: 'flex',
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'flex-start',
    },
    titleItem: {
      padding: theme.spacing(0, 1, 0),
    },
    dialogContent: {
      display: 'flex',
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'center',
    },
  }),

);

const ModalWrapper = ({
  open,
  setOpen,
  Component,
  componentProps,
  ariaDescribedBy,
  ariaLabeledBy}: Props) => {
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
        // aria-labelledby={ariaLabeledBy}
        // aria-describedby={ariaDescribedBy}
        closeAfterTransition
        BackdropComponent={Backdrop}
        BackdropProps={{
          timeout: 500,
        }}
      >
        <Fade in={open} timeout={{enter: 750, exit: 250}}>
          <DialogContent className={classes.dialogContent}>
            <Component setOpen={setOpen} open={open} {...componentProps} />
          </DialogContent>
        </Fade>
      </Modal>
    </div>
  );
};

export default ModalWrapper;

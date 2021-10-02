/* eslint-disable no-unused-vars */
import React, {ReactComponentElement, useContext, useEffect} from 'react';
import {makeStyles, Theme, createStyles} from '@material-ui/core/styles';
import Backdrop from '@material-ui/core/Backdrop';
import Fade from '@material-ui/core/Fade';

import Modal from '@material-ui/core/Modal';
import {ChildrenPropsMandatory} from '../../shared/types';
import {DialogContent} from '@material-ui/core';

export interface ModalProps {
    open: boolean,
    setOpen: React.Dispatch<React.SetStateAction<boolean>>,
}

interface Props extends ModalProps{
    // eslint-disable-next-line max-len
    Component: React.ForwardRefExoticComponent<ModalProps & React.RefAttributes<HTMLDivElement>>
    // Component: React.FC<ModalProps>
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
  }),

);

const ModalWrapper = ({open, setOpen, Component}: Props) => {
  const classes = useStyles();
  const handleClose = () => setOpen(false);
  return (
    <div>
      <Modal
        className={classes.modal}
        open={open}
        onClose={handleClose}
        aria-labelledby="attendee-modal-title"
        aria-describedby="form-to-login"
      >
        <Fade in={open} timeout={{enter: 750, exit: 250}}>
          <DialogContent>
            <Component setOpen={setOpen} open={open}/>
          </DialogContent>
        </Fade>
      </Modal>
    </div>
  );
};

export default ModalWrapper;

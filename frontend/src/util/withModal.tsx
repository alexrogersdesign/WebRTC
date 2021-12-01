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

export interface WithModalProps<T> {
    open: boolean,
    setOpen: (open: boolean) => void,
    ariaLabeledBy?: string,
    ariaDescribedBy?: string
    PropComponent: React.ComponentType<T>
    // props <T>
}

// interface Props <T> {
//   ,
// }


// eslint-disable-next-line require-jsdoc
export function ModalWrapper <WithModalProps>({
  PropComponent,
  open,
  setOpen,
}:WithModalProps<T> ) {
  const classes = useStyles();
  const handleClose = () => setOpen(false);

  const displayName =
        PropComponent.displayName || PropComponent.name || 'Component';

  const ComponentWithModal =<T, >() => {
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

  ComponentWithModal.displayName = `ModalWrapper(${displayName})`;
  return ComponentWithModal;
};

export default ModalWrapper;

export interface FormProps extends ModalProps{
}

/* eslint-disable no-unused-vars */
import React from 'react';
import {makeStyles, createStyles} from '@material-ui/core/styles';
import Backdrop from '@material-ui/core/Backdrop';
import Fade from '@material-ui/core/Fade';
import Dialog from '@material-ui/core/Dialog';


const useStyles = makeStyles(() =>
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
    modalOpen: boolean,
    setModalOpen: (open: boolean) => void,
}

/**
 * @typedef {Object} Props
 */
interface Props <P, T={}> extends ModalProps{
    WrappedComponent:
        React.ComponentType<P & T>,
    componentProps: P,
    ariaLabeledBy?: string,
    ariaDescribedBy?: string
}

/**
 * @typedef {Object} P A generic prop
 * @template P The Type of the props to pass to the wrapped component.
 */
/**
 * @typedef {Object} T A generic type
 * @template T An optional type assertion to be made on the component.
 */

/**
 * A Container component that wraps the supplied children with a
 * Dialog component to create a modal.
 * @example  Using T to assert WrappedComponent as a ForwardRefExoticComponent
 * <ModalWrapper<FormProps, RefAttributes<HTMLDivElement>>;
 * @param {boolean} modalOpen A boolean state indicating whether
 * the modal should be open.
 * {React.Dispatch<React.SetStateAction<boolean>>} setModalOpen The
 * function that sets the open state of the modal.
 * @param {React.ComponentClass<P> | React.FunctionComponent<P>}
 * WrappedComponent The component to be wrapped.
 * @param {string | undefined} ariaDescribedBy The ariaDescribedBy value
 * to be set on the modal element.
 * @param {string | undefined} ariaLabeledBy The ariaLabeledBy value
 * to be set on the modal element.
 * @param {P} componentProps The props to pass to the wrapped component
 * @return {JSX.Element}
 */
const ModalWrapper= <P, T={}>({
  modalOpen,
  setModalOpen,
  WrappedComponent,
  ariaDescribedBy,
  ariaLabeledBy,
  componentProps,
}: Props<P & T>) => {
  const classes = useStyles();
  const handleClose = () => setModalOpen(false);

  return (
    <Dialog
      className={classes.modal}
      open={modalOpen}
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
      <Fade in={modalOpen} timeout={{enter: 750, exit: 250}}>
        <div className={classes.dialogContent}>
          <WrappedComponent
            {...componentProps}
          />
        </div>
      </Fade>
    </Dialog>
  );
};

export default ModalWrapper;

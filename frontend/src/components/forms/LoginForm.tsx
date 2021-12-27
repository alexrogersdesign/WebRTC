import React, {useContext, forwardRef} from 'react';
import {makeStyles, Theme, createStyles} from '@material-ui/core/styles';
import {useFormik} from 'formik';
import * as yup from 'yup';
import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';
import PropTypes from 'prop-types';
import DialogContent from '@material-ui/core/DialogContent';
import DialogTitle from '@material-ui/core/DialogTitle';

import TutorialPrompt from '../tutorial/TutorialPrompt';
import {AppStateContext} from '../../context/AppStateContext';
import {FormProps} from '../../util/types';
import CancelIcon from '@material-ui/icons/Cancel';
import IconButton from '@material-ui/core/IconButton';
import {Container} from '@material-ui/core';


const validationSchema = yup.object({
  email: yup
      .string()
      .email('Enter a valid email')
      .defined('Email is required'),
  password: yup
      .string()
      .defined('Password is required'),
});

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    paper: {
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      backgroundColor: theme.palette.background.paper,
      borderRadius: theme.shape.borderRadius,
      boxShadow: theme.shadows[5],
      padding: theme.spacing(2, 4, 3),
      [theme.breakpoints.down('sm')]: {
        minWidth: 0,
        padding: theme.spacing(2, 0, 1),
      },
    },
    titleItem: {
      [theme.breakpoints.down('sm')]: {
        alignSelf: 'right',
      },
    },
    formContainer: {
      flexDirection: 'column',
      alignItems: 'center',
      flexWrap: 'nowrap',
      alignContent: 'center',
      width: '100%',
    },
    helperText: {
      position: 'absolute',
      bottom: -20,
    },
    formItem: {
      margin: theme.spacing(0, 0, 3),
      flexShrink: 1,
      flexWrap: 'nowrap',
    },
    closeButton: {
      position: 'absolute',
      top: '3%',
      left: '5%',
      fontSize: 40,
      [theme.breakpoints.up('md')]: {
        display: 'none',
      },
    },
  }),


);
/**
 * A forward reference exotic component that renders login form.
 * The component is intended to be rendered inside of a Modal.
 * A ref is forwarded through the component from it's props to a
 * div element wrapping DialogTitle and DialogContent. The forward ref allows
 * the form to be rendered in a Modal component transparently without
 * breaking any of the functionality of the Modal or introducing
 * accessibility issues.
 * @param {React.Dispatch<React.SetStateAction<boolean>>} setOpen A function
 * that sets the state of a boolean variable representing whether the
 * modal should open.
 * @type {React.ForwardRefExoticComponent<React.PropsWithoutRef<FormProps>
 *     & React.RefAttributes<HTMLDivElement>>}
 */
const LoginForm = forwardRef<HTMLDivElement, FormProps>(({
  setOpen,
}, ref) => {
  const {login} = useContext(AppStateContext);
  const classes = useStyles();
  const handleClose = () => {
    setOpen(false);
  };
  const formik = useFormik({
    initialValues: {
      email: '',
      password: '',
    },
    validationSchema: validationSchema,
    onSubmit: (values, {setSubmitting}) => {
      setTimeout(async () => {
        if (!login) return;
        login(values).then( (result) => {
          if (result) handleClose();
          setSubmitting(false);
        });
      }, 500);
    },
  });
  const handleTest = async () => {
    await formik.setFieldValue('email', 'test@test.com');
    await formik.setFieldValue('password', 'test');
    await formik.setFieldTouched('email', true);
    await formik.setFieldTouched('password', true);
    await formik.submitForm();
  };
  return (
    <div className={classes.paper} ref={ref}>
      <DialogTitle
        className={classes.titleItem}
        id="create-account-title"
      >
          Login
      </DialogTitle>
      <DialogContent>
        <Container className={classes.formContainer}>
          <IconButton
            size={'medium'}
            className={classes.closeButton}
            color="secondary"
            aria-label="cancel"
            onClick={handleClose}
          >
            <CancelIcon fontSize={'inherit'}/>
          </IconButton>
          <form onSubmit={formik.handleSubmit}>
            <TextField
              className={classes.formItem}
              variant="outlined"
              fullWidth
              id="email"
              name="email"
              label="Email"
              value={formik.values.email}
              onBlur={formik.handleBlur}
              onChange={formik.handleChange}
              error={formik.touched.email && Boolean(formik.errors.email)}
              helperText={formik.touched.email && formik.errors.email}
              FormHelperTextProps={{className: classes.helperText}}
            />
            <TextField
              className={classes.formItem}
              variant="outlined"
              fullWidth
              id="password"
              name="password"
              label="Password"
              type="password"
              value={formik.values.password}
              onBlur={formik.handleBlur}
              onChange={formik.handleChange}
              error={formik.touched.password && Boolean(formik.errors.password)}
              helperText={formik.touched.password && formik.errors.password}
              FormHelperTextProps={{className: classes.helperText}}
            />
            <Button color="primary" variant="contained" fullWidth type="submit">
                        Login
            </Button>
          </form>
        </Container>
      </DialogContent>
      <TutorialPrompt
        message={'Login with demo account?'}
        buttonLabel={'login'}
        action={handleTest}
        verticalOffset={'25%'}
      />
    </div>
  );
});

LoginForm.propTypes = {
  setOpen: PropTypes.func.isRequired,
};
LoginForm.displayName = 'Login Form';


export default LoginForm;

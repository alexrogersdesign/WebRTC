/* eslint-disable no-unused-vars */
import React, {useContext, forwardRef} from 'react';
import {makeStyles, Theme, createStyles} from '@material-ui/core/styles';
import {useFormik} from 'formik';
import * as yup from 'yup';
import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';
import PropTypes from 'prop-types';

import {RestContext} from '../../context/RestContext';
import UploadImage from '../common/UploadImage';
import {Container, DialogContent, DialogTitle} from '@material-ui/core';
import {FILE_SIZE, SUPPORTED_FORMATS} from '../../util/constants';
import {AppStateContext} from '../../context/AppStateContext';
import {FormProps} from '../../shared/types';
import CancelIcon from '@material-ui/icons/Cancel';
import IconButton from '@material-ui/core/IconButton';
import LoginForm from './LoginForm';


const validationSchema = yup.object({
  email: yup
      .string()
      .email('Enter a valid email')
      .defined('Email is required'),
  password: yup
      .string()
      .min(4, 'Password should be at least 4 characters')
      .defined('Required'),
  firstName: yup
      .string()
      .min(2, 'First Name should be at least 4 characters')
      .defined('Required'),
  lastName: yup
      .string()
      .min(2, 'Last Name should be at least 4 characters')
      .defined('Required'),
  iconImage: yup
      .mixed()
      .test('fileSize',
          'File size is too large',
          (value) => !value || (value && value.size <= FILE_SIZE),
      )
      .test('fileType',
          'Unsupported File Format',
          (value) => !value || SUPPORTED_FORMATS.includes(value.type),
      ),
});

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    paper: {
      backgroundColor: theme.palette.background.paper,
      borderRadius: theme.shape.borderRadius,
      boxShadow: theme.shadows[5],
      padding: theme.spacing(2, 4, 3),
      minWidth: 800,
      display: 'flex',
      flexDirection: 'column',
      [theme.breakpoints.down('sm')]: {
        minWidth: 0,
        padding: theme.spacing(2, 0, 1),
      },
    },
    titleItem: {
      [theme.breakpoints.down('sm')]: {
        alignSelf: 'center',
      },
    },
    formContainer: {
      flexDirection: 'column',
      alignItems: 'center',
      flexWrap: 'nowrap',
      alignContent: 'center',
      width: '100%',
    },
    formItem: {
      margin: theme.spacing(1, 0, 3),
      flexShrink: 1,
      flexWrap: 'nowrap',
      width: '70%',
      [theme.breakpoints.down('sm')]: {
        width: '100%',
        alignContent: 'center',
        justifyContent: 'center',
        padding: theme.spacing(1, 0, 1),
        margin: theme.spacing(1, 0, 2),
      },
    },
    nameItem: {
      margin: theme.spacing(1, 1, 1),
      flexShrink: 1,
      width: '100%',

      [theme.breakpoints.down('sm')]: {
        width: '100%',
        alignContent: 'center',
        justifyContent: 'center',
        padding: theme.spacing(1, 0, 1),
        margin: theme.spacing(1, 0, 2),
      },
    },
    nameContainer: {
      display: 'flex',
      flexDirection: 'row',
      flexWrap: 'nowrap',
      justifyContent: 'space-around',
      alignItems: 'center',
      alignContent: 'space-between',
      [theme.breakpoints.down('sm')]: {
        flexDirection: 'column-reverse',
        padding: 0,
        flexWrap: 'nowrap',
        width: '100%',
        justifyContent: 'center',
        alignContent: 'center',
        alignItems: 'center',
      },
    },
    helperText: {
      position: 'absolute',
      bottom: -20,
      [theme.breakpoints.down('sm')]: {
        bottom: -12,
      },
    },
    upload: {
      boxShadow: theme.shadows[1],
      backgroundColor: theme.palette.primary.light,
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
 * A forward reference exotic component that renders new user form.
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
const NewUserForm = forwardRef<HTMLDivElement, FormProps>(({
  setOpen,
}, ref) => {
  const {createUser} = useContext(RestContext);
  const {sm} = useContext(AppStateContext);
  const classes = useStyles();
  const handleClose = () => {
    setOpen(false);
  };
  const formik = useFormik({
    initialValues: {
      email: 'test@test.com',
      password: 'test',
      firstName: 'Jane',
      lastName: 'Smith',
      iconImage: '',
    },
    validationSchema: validationSchema,

    onSubmit: (values, {setSubmitting}) => {
      setTimeout(async () => {
        createUser(values).then( (result) => {
          if (result) handleClose();
          setSubmitting(false);
        });
      }, 500);
    },
  });
  return (
    <div className={classes.paper} ref={ref}>
      <DialogTitle
        className={classes.titleItem}
        id="create-account-form-title"
      >
          Create Account
      </DialogTitle>
      <DialogContent >
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
            <Container className={classes.nameContainer}>
              <TextField
                className={classes.nameItem}
                fullWidth={sm?? false}
                id="firstName"
                name="firstName"
                label="First Name"
                variant="outlined"
                value={formik.values.firstName}
                onBlur={formik.handleBlur}
                onChange={formik.handleChange}
                error={
                  formik.touched.firstName &&
              Boolean(formik.errors.firstName)
                }
                helperText={formik.touched.firstName && formik.errors.firstName}
                FormHelperTextProps={{className: classes.helperText}}
              />
              <TextField
                fullWidth={sm?? false}
                className={classes.nameItem}
                id="lastName"
                name="lastName"
                label="Last Name"
                variant="outlined"
                value={formik.values.lastName}
                onBlur={formik.handleBlur}
                onChange={formik.handleChange}
                error={formik.touched.lastName &&
                  Boolean(formik.errors.lastName,
                  )}
                helperText={formik.touched.lastName && formik.errors.lastName}
                FormHelperTextProps={{className: classes.helperText}}
              />
              <UploadImage
                formik={formik}
                buttonProps={{
                  variant: sm? 'contained': 'text',
                  className: classes.upload,
                }}
              />
            </Container>
            <TextField
              className={classes.formItem}
              fullWidth
              variant="outlined"
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
              fullWidth
              variant="outlined"
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
            <Button
              className={classes.formItem}
              color="primary"
              variant="contained"
              fullWidth
              type="submit"
            >
                    Submit
            </Button>
          </form>
        </Container>
      </DialogContent>
    </div>
  );
});

NewUserForm.propTypes = {
  setOpen: PropTypes.func.isRequired,
};
NewUserForm.displayName = 'New User Form';


export default NewUserForm;

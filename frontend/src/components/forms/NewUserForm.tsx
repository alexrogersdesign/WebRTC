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


const validationSchema = yup.object({
  email: yup
      .string()
      .email('Enter a valid email')
      .defined('Email is required'),
  password: yup
      .string()
      .min(4, 'Password should be of minimum 4 characters length')
      .defined('Required'),
  firstName: yup
      .string()
      .min(2, 'Password should be of minimum 2 characters length')
      .defined('Required'),
  lastName: yup
      .string()
      .min(2, 'Password should be of minimum 2 characters length')
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
      display: 'flex',
      flexDirection: 'column',
      overflow: 'hidden',
      [theme.breakpoints.down('sm')]: {
        height: '70%',
        padding: theme.spacing(2, 0, 1),
      },
    },
    title: {
      display: 'flex',
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'flex-start',
    },
    titleItem: {
      padding: theme.spacing(1, 1, 0),
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
      [theme.breakpoints.down('sm')]: {
        width: '90%',
        alignContent: 'center',
        justifyContent: 'center',
      },
    },
    formItem: {
      margin: theme.spacing(1, 0, 2),
      flexShrink: 1,
      flexWrap: 'nowrap',
      width: '70%',
      [theme.breakpoints.down('sm')]: {
        width: '100%',
        alignContent: 'center',
        justifyContent: 'center',
        padding: theme.spacing(1, 0, 1),
      },
    },
    nameItem: {
      margin: theme.spacing(1, 1, 1),
      [theme.breakpoints.down('sm')]: {
        padding: theme.spacing(1, 0, 1),
      },
      flexShrink: 1,
      width: '100%',
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
        padding: theme.spacing(0),
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
    },
    upload: {
      boxShadow: theme.shadows[1],
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
        id="create-account-title"
      >
          Create Account
      </DialogTitle>
      <DialogContent >
        <Container className={classes.formContainer}>
          <form onSubmit={formik.handleSubmit}>
            <Container className={classes.nameContainer}>
              <TextField
                fullWidth={sm?? false}
                className={classes.nameItem}
                variant="outlined"
                id="firstName"
                name="firstName"
                label="First Name"
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
                variant="outlined"
                id="lastName"
                name="lastName"
                label="Last Name"
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
                  disableElevation: true,
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

export default NewUserForm;

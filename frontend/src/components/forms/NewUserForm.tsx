/* eslint-disable no-unused-vars */
import React, {useContext, forwardRef} from 'react';
import {makeStyles, Theme, createStyles} from '@material-ui/core/styles';
import {useFormik} from 'formik';
import * as yup from 'yup';
import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';
import PropTypes from 'prop-types';

import {RestContext} from '../../context/rest/RestContext';
import {ChildrenProps} from '../../shared/types';


interface Props extends ChildrenProps {
    setOpen: React.Dispatch<React.SetStateAction<boolean>>,
}

const validationSchema = yup.object({
  email: yup
      .string()
      .email('Enter a valid email')
      .defined('Email is required'),
  password: yup
      .string()
      .min(4, 'Password should be of minimum 8 characters length')
      .defined('Password is required'),
  firstName: yup
      .string()
      .min(2, 'Password should be of minimum 8 characters length')
      .defined('Password is required'),
  lastName: yup
      .string()
      .min(2, 'Password should be of minimum 8 characters length')
      .defined('Password is required'),
});

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    paper: {
      backgroundColor: theme.palette.background.paper,
      border: '2px solid #000',
      borderRadius: 5,
      boxShadow: theme.shadows[5],
      padding: theme.spacing(2, 4, 3),
      zIndex: 99,
      display: 'flex',
      flexDirection: 'column',
      width: '50%',
      // margin: theme.spacing(2),
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
    formItem: {
      margin: theme.spacing(1, 1, 2),
    },
  }),
);

const NewUserForm = forwardRef<HTMLDivElement, Props>((props, ref) => {
  const {setOpen} = props;
  const {createUser} = useContext(RestContext);
  const classes = useStyles();
  const formik = useFormik({
    initialValues: {
      email: 'test@test.com',
      password: 'test',
      firstName: 'Jane',
      lastName: 'Smith',
    },
    validationSchema: validationSchema,

    onSubmit: (values, {setSubmitting}) => {
      setTimeout(async () => {
        if (!createUser) return;
        createUser(values).then( (result) => {
          if (result) setOpen(false);
          setSubmitting(false);
        });
      }, 500);
    },
  });
  return (
    <div className={classes.paper} ref={ref}>
      {/* <Typography*/}
      {/*  className={classes.titleItem}*/}
      {/*  variant='h5'*/}
      {/*  id="Login"*/}
      {/* >*/}
      {/*        Login*/}
      {/* </Typography>*/}
      <form onSubmit={formik.handleSubmit}>
        <TextField
          className={classes.formItem}
          variant="outlined"
          id="firstName"
          name="firstName"
          label="First Name"
          value={formik.values.firstName}
          onBlur={formik.handleBlur}
          onChange={formik.handleChange}
          error={formik.touched.firstName && Boolean(formik.errors.firstName)}
          helperText={formik.touched.firstName && formik.errors.firstName}
        />
        <TextField
          className={classes.formItem}
          variant="outlined"
          id="lastName"
          name="lastName"
          label="Last Name"
          value={formik.values.lastName}
          onBlur={formik.handleBlur}
          onChange={formik.handleChange}
          error={formik.touched.lastName && Boolean(formik.errors.lastName)}
          helperText={formik.touched.lastName && formik.errors.lastName}
        />
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
    </div>
  );
});

NewUserForm.propTypes = {
  setOpen: PropTypes.func.isRequired,
};

export default NewUserForm;

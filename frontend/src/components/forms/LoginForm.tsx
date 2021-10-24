/* eslint-disable no-unused-vars */
import React, {useContext, forwardRef} from 'react';
import {makeStyles, Theme, createStyles} from '@material-ui/core/styles';
import {useFormik} from 'formik';
import * as yup from 'yup';
import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';
import PropTypes from 'prop-types';
import DialogContent from '@material-ui/core/DialogContent';
import DialogTitle from '@material-ui/core/DialogTitle';

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
      // .min(2, 'Password should be of minimum 8 characters length')
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
    helperText: {
      position: 'absolute',
      bottom: -20,
    },
    formItem: {
      margin: theme.spacing(0, 0, 3),
      flexShrink: 1,
      flexWrap: 'nowrap',
    },
  }),

);

const LoginForm = forwardRef<HTMLDivElement, Props>((props, ref) => {
  const {setOpen} = props;
  const {login} = useContext(RestContext);
  const classes = useStyles();
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
          if (result) setOpen(false);
          setSubmitting(false);
        });
      }, 500);
    },
  });
  return (
    <div className={classes.paper} ref={ref}>
      <DialogTitle
        className={classes.titleItem}
        // variant='h5'
        id="create-account-title"
      >
            Login
      </DialogTitle>
      <DialogContent>
        <form onSubmit={formik.handleSubmit}>
          <TextField
            className={classes.formItem}
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
      </DialogContent>
    </div>
  );
});

LoginForm.propTypes = {
  setOpen: PropTypes.func.isRequired,
};

export default LoginForm;

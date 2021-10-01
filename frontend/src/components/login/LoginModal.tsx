/* eslint-disable no-unused-vars */
import React, {useContext, useEffect} from 'react';
import {makeStyles, Theme, createStyles} from '@material-ui/core/styles';
import {useFormik} from 'formik';
import * as yup from 'yup';
import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';
import Modal from '@material-ui/core/Modal';
import Typography from '@material-ui/core/Typography';
import {RestContext} from '../../context/RestContext';
import {SocketIOContext} from '../../context/SocketIOContext';


interface Props {
    open: boolean,
    setOpen: React.Dispatch<React.SetStateAction<boolean>>,
}

const validationSchema = yup.object({
  email: yup
      .string()
      .email('Enter a valid email')
      .defined('Email is required'),
  password: yup
      .string()
      .min(2, 'Password should be of minimum 8 characters length')
      .defined('Password is required'),
});

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

const LoginModal = ({open, setOpen}: Props) => {
  const {login, loggedIn} = useContext(RestContext);
  const {currentUser} = useContext(SocketIOContext);
  const classes = useStyles();
  const handleClose = () => setOpen(false);
  const formik = useFormik({
    initialValues: {
      email: 'test@test.com',
      password: 'test',
    },
    validationSchema: validationSchema,
    // onSubmit: async (values) => {
    //   login && await login(values);
    // },
    onSubmit: (values, {setSubmitting}) => {
      setTimeout(async () => {
        if (!login) return;
        const result = await login(values);
        if (result) setOpen(false);
        setSubmitting(false);
      }, 500);
    },
  });
  useEffect(() => {
    return () => {
      if (currentUser) setOpen(false);
    };
  }, [currentUser]);

  return (
    <div>
      <Modal
        className={classes.modal}
        open={open}
        onClose={handleClose}
        aria-labelledby="attendee-modal-title"
        aria-describedby="form-to-login"
      >
        <div className={classes.paper}>
          <Typography
            className={classes.titleItem}
            variant='h5'
            id="Login"
          >
              Login
          </Typography>
          <form onSubmit={formik.handleSubmit}>
            <TextField
              fullWidth
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
            />
            <Button color="primary" variant="contained" fullWidth type="submit">
                    Login
            </Button>
          </form>
        </div>
      </Modal>
    </div>
  );
};

export default LoginModal;

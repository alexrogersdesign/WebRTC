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
import {Typography} from '@material-ui/core';


interface Props extends ChildrenProps {
    setOpen: React.Dispatch<React.SetStateAction<boolean>>,
}

const validationSchema = yup.object({
  title: yup
      .string()
      .min(4, 'Title should be of minimum 4 characters length')
      .defined('Title is required'),
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

const NewMeetingForm = forwardRef<HTMLDivElement, Props>((props, ref) => {
  const {setOpen} = props;
  const {createMeeting} = useContext(RestContext);
  const classes = useStyles();
  const formik = useFormik({
    initialValues: {
      title: '',
    },
    validationSchema: validationSchema,

    onSubmit: (values, {setSubmitting}) => {
      setTimeout(async () => {
        if (!createMeeting) return;
        createMeeting(values).then( (result) => {
          if (result) setOpen(false);
          setSubmitting(false);
        });
      }, 500);
    },
  });
  return (
    <div className={classes.paper} ref={ref}>
      <Typography
        className={classes.titleItem}
        variant='h5'
        id="MeetingForm"
      >
              New Meeting
      </Typography>
      <form onSubmit={formik.handleSubmit}>
        <TextField
          fullWidth
          className={classes.formItem}
          autoComplete='off'
          variant="outlined"
          id="title"
          name="title"
          label="Meeting Title"
          value={formik.values.title}
          onBlur={formik.handleBlur}
          onChange={formik.handleChange}
          error={formik.touched.title && Boolean(formik.errors.title)}
          helperText={formik.touched.title && formik.errors.title}
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

NewMeetingForm.propTypes = {
  setOpen: PropTypes.func.isRequired,
};

export default NewMeetingForm;

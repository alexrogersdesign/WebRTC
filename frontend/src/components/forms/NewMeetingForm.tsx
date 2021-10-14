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
import {Container, Typography} from '@material-ui/core';


interface Props extends ChildrenProps {
    setOpen: React.Dispatch<React.SetStateAction<boolean>>,
}

const validationSchema = yup.object({
  title: yup
      .string()
      .min(4, 'Title should be of minimum 4 characters length')
      .defined('Title is required'),
  description: yup
      .string()
      .min(4, 'Description should be of minimum 4 characters length')
      .defined('Description is required'),
  start: yup
      .date()
      .min(new Date(), 'Start time cannot be in past')
      .defined('Start date is required'),
  end: yup
      .date()
      .min(yup.ref('start'), 'End time cannot be before start time' )
      .defined('End date is required'),
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
      width: '55%',
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
      margin: theme.spacing(1, 1, 1),
    },
    dateField: {
      marginLeft: theme.spacing(1),
      marginRight: theme.spacing(1),
      width: '100%',
    },
    dateContainer: {
      // margin: theme.spacing(1, 0, 2),
      padding: theme.spacing(0, 2, 0),
      // width: '100%',
      display: 'flex',
      flexDirection: 'row',
      justifyContent: 'center',
      alignItems: 'stretch',
      alignContent: 'stretch',
      flexGrow: 1,
      flexWrap: 'nowrap',
    },
  }),
);

const NewMeetingForm = forwardRef<HTMLDivElement, Props>((props, ref) => {
  const {setOpen} = props;
  const {createMeeting} = useContext(RestContext);
  const classes = useStyles();
  const dateRoundedToQuarterHour = new Date(
      /* Rounds current time by 15 minutes.
         900000 = amount of milliseconds in 15 minutes*/
      Math.ceil(new Date().getTime()/900000)*900000,
  );
  const offset = dateRoundedToQuarterHour.getTimezoneOffset();
  // const dateRoundedToQuarterHour =
  /* Convert the default time into the string format used by picker components*/
  const defaultTime = new Date(
      dateRoundedToQuarterHour.getTime() - offset * 60000,
  ).toISOString().substring(0, 16);
  const formik = useFormik({
    initialValues: {
      title: '',
      description: '',
      start: defaultTime,
      end: defaultTime,
    },
    validationSchema: validationSchema,

    onSubmit: (values, {setSubmitting}) => {
      const {start, end, ...otherValues} = values;
      const newMeeting = {
        start: new Date(start),
        end: new Date(end),
        ...otherValues,
      };
      setTimeout(async () => {
        if (!createMeeting) return;
        createMeeting(newMeeting).then( (result) => {
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
        <TextField
          fullWidth
          multiline
          maxRows={4}
          className={classes.formItem}
          autoComplete='off'
          variant="outlined"
          id="description"
          name="description"
          label="Meeting Description"
          value={formik.values.description}
          onBlur={formik.handleBlur}
          onChange={formik.handleChange}
          error={
            formik.touched.description && Boolean(formik.errors.description)
          }
          helperText={formik.touched.description && formik.errors.description}
        />
        <Container className={classes.dateContainer}>
          <TextField
            id="start"
            label="Meeting start"
            type="datetime-local"
            // variant="outlined"
            // defaultValue={defaultTime}
            className={classes.dateField}
            InputLabelProps={{
              shrink: true,
            }}
            value={formik.values.start}
            onBlur={formik.handleBlur}
            onChange={formik.handleChange('start')}
            error={
              formik.touched.start && Boolean(formik.errors.start)
            }
            helperText={formik.touched.start && formik.errors.start}
          />
          <TextField
            id="end"
            label="Meeting end"
            type="datetime-local"
            // variant="outlined"
            // defaultValue={defaultTime}
            className={classes.dateField}
            InputLabelProps={{
              shrink: true,
            }}
            value={formik.values.end}
            onBlur={formik.handleBlur}
            onChange={formik.handleChange('end')}
            error={
              formik.touched.end && Boolean(formik.errors.end)
            }
            helperText={formik.touched.end && formik.errors.end}
          />
        </Container>
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

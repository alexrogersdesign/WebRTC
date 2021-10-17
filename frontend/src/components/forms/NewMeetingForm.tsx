/* eslint-disable no-unused-vars */
import React, {useContext, forwardRef, useState, useEffect} from 'react';
import {makeStyles, Theme, createStyles} from '@material-ui/core/styles';
import {useFormik} from 'formik';
import * as yup from 'yup';
import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';
import PropTypes from 'prop-types';

import {RestContext} from '../../context/rest/RestContext';
import {ChildrenProps} from '../../shared/types';
import {Container, Fade, Popper, Typography} from '@material-ui/core';
import {OptionsObject, useSnackbar} from 'notistack';
import UploadImage from '../common/UploadImage';
// import {MeetingIcon} from '../../shared/classes/MeetingIcon';

interface Props extends ChildrenProps {
    setOpen: React.Dispatch<React.SetStateAction<boolean>>,
}

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
      minWidth: 1020,
    },
    title: {
      display: 'flex',
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'flex-start',
    },
    titleItem: {
      padding: theme.spacing(1, 1, 0),
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
    },
    nameItem: {
      // padding: theme.spacing(1, 1, 2),
      margin: theme.spacing(1, 1, 1),
      flexShrink: 1,
      width: '100%',
    },
    nameContainer: {
      // width: '100%',
      display: 'flex',
      flexDirection: 'row',
      flexWrap: 'nowrap',
      justifyContent: 'space-around',
      alignItems: 'center',
      alignContent: 'space-between',
    },
    helperText: {
      // padding: 0,
      // margin: 0,
      position: 'absolute',
      bottom: -20,
    },
    dateField: {
      margin: theme.spacing(1, 2, 1),
      // flexShrink: 1,
      minWidth: 220,
      width: '100%',
    },
    dateContainer: {
      display: 'flex',
      flexDirection: 'row',
      flexWrap: 'nowrap',
      justifyContent: 'space-around',
      alignItems: 'center',
      alignContent: 'space-between',
    },

  }),
);

const FILE_SIZE = 16_000_000; //* 16 Megabyte Document Size Limit
const SUPPORTED_FORMATS = ['image/jpg', 'image/jpeg', 'image/png'];

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
      iconImage: '',
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
      <Container className={classes.formContainer}>
        <form onSubmit={formik.handleSubmit}>
          <Container className={classes.dateContainer}>
            <TextField
              id="start"
              label="Meeting start"
              type="datetime-local"
              variant="outlined"
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
              FormHelperTextProps={{className: classes.helperText}}
            />
            <TextField
              id="end"
              label="Meeting end"
              type="datetime-local"
              variant="outlined"
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
            <UploadImage formik={formik}/>

          </Container>
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
            FormHelperTextProps={{className: classes.helperText}}
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
    </div>
  );
});

NewMeetingForm.propTypes = {
  setOpen: PropTypes.func.isRequired,
};

export default NewMeetingForm;

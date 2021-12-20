import React, {useContext, forwardRef} from 'react';
import {makeStyles, Theme, createStyles} from '@material-ui/core/styles';
import {useFormik} from 'formik';
import * as yup from 'yup';
import Button from '@material-ui/core/Button';
import IconButton from '@material-ui/core/IconButton';
import TextField from '@material-ui/core/TextField';
import PropTypes from 'prop-types';
import DialogContent from '@material-ui/core/DialogContent';
import DialogTitle from '@material-ui/core/DialogTitle';
import {Container} from '@material-ui/core';
import CancelIcon from '@material-ui/icons/Cancel';
import clsx from 'clsx';

import {RestContext} from '../../context/RestContext';
import UploadImage from '../common/UploadImage';
import {
  addMinutes,
  dateRoundedToQuarterHour,
  formatDateForPicker,
} from '../../util/timeHelper';
import {FILE_SIZE, SUPPORTED_FORMATS} from '../../util/constants';
import {AppStateContext} from '../../context/AppStateContext';
import {FormProps} from '../../shared/types';


const validationSchema = yup.object({
  title: yup
      .string()
      .min(4, 'Title should be at least 4 characters')
      .defined('Title is required'),
  description: yup
      .string()
      .min(4, 'Description should be at least 4 characters')
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
        padding: theme.spacing(1, 0, 1),
      },
    },
    dateField: {
      margin: theme.spacing(1, 2, 1),
      minWidth: 220,
      width: '100%',
      [theme.breakpoints.down('sm')]: {
        padding: theme.spacing(1, 0, 1),
        margin: theme.spacing(1, 0, 2),
      },
    },
    startDate: {
      [theme.breakpoints.down('sm')]: {
        order: 2,
      },
    },
    endDate: {
      [theme.breakpoints.down('sm')]: {
        order: 3,
      },
    },
    dateContainer: {
      display: 'flex',
      flexDirection: 'row',
      flexWrap: 'nowrap',
      justifyContent: 'space-around',
      alignItems: 'center',
      alignContent: 'space-between',
      [theme.breakpoints.down('sm')]: {
        flexDirection: 'column',
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
      backgroundColor: theme.palette.secondary.light,
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
 * A forward reference exotic component that renders new meeting form.
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
const NewMeetingForm = forwardRef<HTMLDivElement, FormProps>(({
  setOpen,
}, ref) => {
  const {createMeeting} = useContext(RestContext);
  const {sm} = useContext(AppStateContext);
  const classes = useStyles();
  const handleClose = () => {
    setOpen(false);
  };
  const defaultStartTime = formatDateForPicker(dateRoundedToQuarterHour);
  const defaultEndTime = formatDateForPicker(
      addMinutes(dateRoundedToQuarterHour, 30),
  );
  const formik = useFormik({
    initialValues: {
      title: '',
      description: '',
      start: defaultStartTime,
      end: defaultEndTime,
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
        id="new-meeting-form-title"
      >
          New Meeting
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
            <Container className={classes.dateContainer}>
              <TextField
                className={clsx(classes.startDate, classes.dateField)}
                fullWidth={sm?? false}
                id="start"
                label="Starts"
                type="datetime-local"
                variant="outlined"
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
                className={clsx(classes.endDate, classes.dateField)}
                fullWidth={sm?? false}
                id="end"
                label="Ends"
                type="datetime-local"
                variant="outlined"
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
              <UploadImage
                formik={formik}
                buttonProps={{
                  variant: sm? 'contained': 'text',
                  className: classes.upload,
                }}
              />
            </Container>
            <TextField
              fullWidth
              className={classes.formItem}
              autoComplete='off'
              variant="outlined"
              id="title"
              name="title"
              label="Title"
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
              label="Description"
              value={formik.values.description}
              onBlur={formik.handleBlur}
              onChange={formik.handleChange}
              error={
                formik.touched.description && Boolean(formik.errors.description)
              }
              helperText={
                formik.touched.description &&
                formik.errors.description
              }
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

NewMeetingForm.propTypes = {
  setOpen: PropTypes.func.isRequired,
};

export default NewMeetingForm;

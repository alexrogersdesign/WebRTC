import React, {useEffect} from 'react';
import Button, {ButtonProps} from '@material-ui/core/Button';
import {Container} from '@material-ui/core';
import {FormikProps} from 'formik';
import {createStyles, makeStyles, Theme} from '@material-ui/core/styles';
import {OptionsObject, useSnackbar} from 'notistack';

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    imagePreview: {
      height: 100,
      width: 100,
      borderRadius: 20,
    },
    imageContainer: {
      height: 120,
      display: 'flex',
      flexDirection: 'row',
      justifyContent: 'center',
      alignItems: 'center',
      flexWrap: 'nowrap',
    },
  }),
);

interface Props {
    formik: FormikProps<any>
    buttonProps?: ButtonProps
}

const snackbarErrorOptions :OptionsObject = {
  variant: 'error',
  autoHideDuration: 4000,
  anchorOrigin: {
    vertical: 'top',
    horizontal: 'center',
  },
};

/**
 * Renders a button which allows for an image to be uploaded
 * via the browsers file upload API. The component is an extension
 * of a Formik form and attaches the uploaded image to the Formik
 * instance.
 * @param {FormikProps<any>} formik The formik instance
 * @param {ButtonProps} buttonProps Props to apply to the button.
 * @return {JSX.Element}
 * @constructor
 */
const UploadImage = ({formik, buttonProps}: Props)=> {
  const {enqueueSnackbar} = useSnackbar();
  const classes = useStyles();
  /* Send notification if error occurs in iconImage */
  useEffect(() => {
    if (Boolean(formik.touched.iconImage) && Boolean(formik.errors.iconImage)) {
      formik.setFieldValue('iconImage', undefined);
      enqueueSnackbar(formik.errors.iconImage, snackbarErrorOptions);
    }
  }, [formik.errors.iconImage, formik.touched.iconImage]);
  return (
    <Container className={classes.imageContainer}>
      {/* The input that interacts with the browser API.
            The element is hidden because the standard HTML implementation
            is outdated and not very elegant*/}
      <input
        accept='image/*'
        style={{display: 'none'}}
        id='input-file-upload'
        type='file'
        onChange={(event)=>{
          if (!event?.currentTarget?.files) return;
          formik.setFieldTouched('iconImage', true);
          formik.setFieldValue('iconImage', event?.currentTarget?.files[0]);
        }}
      />
      {/* Render a button as a label for the hidden input. This works by
      referencing the id of the input above */}
      <label htmlFor='input-file-upload' >
        {/* If an image hasn't been uploaded, render the upload button*/}
        {!formik.values.iconImage && (
          <Button
            variant='text'
            component='span'
            {...buttonProps}
          >
                Upload Icon
          </Button>
        )}
      </label>
      {/* If an image has been uploaded render the image and a
          button to remove the image */}
      {formik.values.iconImage && (
        <>
          <Button
            variant='text'
            onClick={()=> formik.setFieldValue('iconImage', undefined)}
          >
              Remove
          </Button>
          <img
            className={classes.imagePreview}
            src={URL.createObjectURL(formik.values.iconImage)}
            alt='uploaded image preview'
          />
        </>
      )}
    </Container>
  );
};

export default UploadImage;

/* eslint-disable */
import React, {useEffect} from 'react';
import Button from '@material-ui/core/Button';
import {Container} from '@material-ui/core';
import {FormikProps} from 'formik';
import {createStyles, makeStyles, Theme} from '@material-ui/core/styles';
import {OptionsObject, useSnackbar} from 'notistack';

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    input: {

    },
    button: {

    },
    imagePreview: {
      height: 100,
      width: 100,
      borderRadius: 20,
    },
    imageContainer: {
      height: 120,
      // margin: theme.spacing(0, 1, 0),
      display: 'flex',
      flexDirection: 'row',
      justifyContent: 'center',
      alignItems: 'center',
      // alignContent: 'stretch',
      // flexGrow: 1,
      flexWrap: 'nowrap',
    },
  }),
);

interface ImageValue {
    iconImage: string
}

interface Props {
    formik: FormikProps<any>
}

const snackbarErrorOptions :OptionsObject = {
  variant: 'error',
  autoHideDuration: 4000,
  anchorOrigin: {
    vertical: 'top',
    horizontal: 'center',
  },
};

const UploadImage = ({formik}: Props)=> {
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
      <input
        accept="image/*"
        className={classes.input}
        style={{display: 'none'}}
        id="raised-button-file"
        multiple
        type='file'
        onChange={(event)=>{
          if (!event?.currentTarget?.files) return;
          formik.setFieldTouched('iconImage', true);
          formik.setFieldValue('iconImage', event?.currentTarget?.files[0]);
        }}

      />
      <label htmlFor="raised-button-file" >
        {!formik.values.iconImage && (
          <>
            <Button
              variant="text"
              component="span"
              className={classes.button}
              onBlur={formik.handleBlur}
            >
                            Upload Icon
            </Button>
          </>
        )}
      </label>
      {formik.values.iconImage && (
        <>
          <Button
            variant="text"
            className={classes.button}
            onClick={()=> formik.setFieldValue('iconImage', undefined)}
          >
                        Remove
          </Button>
          <img
            className={classes.imagePreview}
            src={URL.createObjectURL(formik.values.iconImage)}
          />
        </>
      )}
    </Container>
  );
};

export default UploadImage;

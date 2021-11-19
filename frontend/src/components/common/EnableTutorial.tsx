/* eslint-disable no-unused-vars */
import React, {useContext} from 'react';
import Typography from '@material-ui/core/Typography';
import {RestContext} from '../../context/rest/RestContext';
import {createStyles, makeStyles, Theme} from '@material-ui/core/styles';
import Container from '@material-ui/core/Container';
import {OptionsContext} from '../../context/OptionsContext';
import {ButtonBase} from '@material-ui/core';


interface Props {}
const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    container: {
      width: '100%',
      padding: theme.spacing(0, 1, 0),
      fontWeight: 'bold',
    },
    text: {
      fontWeight: 'bold',
    },
  }),
);
const EnableTutorial = (props: Props) => {
  const classes = useStyles();
  const {setTutorialEnabled, tutorialEnabled} = useContext(OptionsContext);
  if (tutorialEnabled) return <></>;
  return (
    <div className={classes.container}>
      <ButtonBase
        onClick={()=> setTutorialEnabled(true)}
      >
        <Typography
          variant='caption'
          classes={{caption: classes.text}}
        >
          Enable Tutorial
        </Typography>
      </ButtonBase>
    </div>
  );
};

export default EnableTutorial;

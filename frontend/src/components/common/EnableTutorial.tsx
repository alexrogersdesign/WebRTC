import React, {useContext} from 'react';
import Typography from '@material-ui/core/Typography';
import {createStyles, makeStyles, Theme} from '@material-ui/core/styles';
import {OptionsContext} from '../../context/OptionsContext';
import {ButtonBase} from '@material-ui/core';


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
/**
 * A component that provides a button to enable the tutorial.
 * If the tutorial is not enabled, and empty fragment is returned.
 * @return {JSX.Element | React.Fragment}
 * @function
 */
const EnableTutorial = () => {
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

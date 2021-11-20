/* eslint-disable no-unused-vars */
import React, {useContext} from 'react';
import {makeStyles,
  Theme,
  createStyles,
} from '@material-ui/core/styles';
import HelpOutlineOutlinedIcon from '@material-ui/icons/HelpOutlineOutlined';

import {OptionsContext} from '../../context/OptionsContext';
import Typography from '@material-ui/core/Typography';
import {IconButton} from '@material-ui/core';
import TutorialWrapper from './TutorialWrapper';

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    button: {
    },
  }),
);

const HelpButton= () => {
  const classes = useStyles();
  const {helpOpen, setHelpOpen} = useContext(OptionsContext);
  const toggleHelp = () => setHelpOpen(!helpOpen);
  return (
    <TutorialWrapper
      message={'Double click to keep open'}
      tooltipProps={{placement: 'left'}}
    >
      <IconButton
        onMouseDown={()=> setHelpOpen(true)}
        onMouseUp={()=> setHelpOpen(false)}
        onDoubleClick={toggleHelp}
        aria-label="Help"
        edge="end"
      >
        <HelpOutlineOutlinedIcon fontSize={'small'}/>
        <Typography variant="caption" noWrap id='menu-button'>
          Help
        </Typography>
      </IconButton>
    </TutorialWrapper>
  );
};

export default HelpButton;

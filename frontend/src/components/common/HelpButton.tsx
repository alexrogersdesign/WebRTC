/* eslint-disable no-unused-vars */
import React, {useContext} from 'react';
import HelpOutlineOutlinedIcon from '@material-ui/icons/HelpOutlineOutlined';

import {OptionsContext} from '../../context/OptionsContext';
import Typography from '@material-ui/core/Typography';
import {IconButton} from '@material-ui/core';
import TutorialWrapper from './TutorialWrapper';
import Button from '@material-ui/core/Button';

const HelpButton= () => {
  const {helpOpen, setHelpOpen} = useContext(OptionsContext);
  const toggleHelp = () => setHelpOpen(!helpOpen);
  return (
    <TutorialWrapper
      message={'Double click to keep open'}
      tooltipProps={{placement: 'left'}}
    >
      <Button
        onMouseDown={()=> setHelpOpen(true)}
        onMouseUp={()=> setHelpOpen(false)}
        onDoubleClick={toggleHelp}
        aria-label="Help"
      >
        <HelpOutlineOutlinedIcon fontSize={'small'}/>
        <Typography variant="subtitle2" id='menu-button'>
          Help
        </Typography>
      </Button>
    </TutorialWrapper>
  );
};

export default HelpButton;

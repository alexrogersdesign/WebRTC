import React, {useContext} from 'react';
import HelpOutlineOutlinedIcon from '@material-ui/icons/HelpOutlineOutlined';

import {OptionsContext} from '../../context/OptionsContext';
import Typography from '@material-ui/core/Typography';
import Button from '@material-ui/core/Button';
import {createStyles, makeStyles} from '@material-ui/core/styles';
import {AppStateContext} from '../../context/AppStateContext';
import {MemoizedHelpWrapper} from './HelpWrapper';

const useStyles = makeStyles(() =>
  createStyles({
    tooltip: {
      overflowWrap: 'break-word',
      width: '10em',
      margin: '0 0',
    },
  }),
);


const HelpButton= () => {
  const {helpOpen, setHelpOpen} = useContext(OptionsContext);
  const {attendeeDrawerOpen} = useContext(AppStateContext);
  const classes = useStyles();
  const toggleHelp = () => setHelpOpen(!helpOpen);
  return (
    <MemoizedHelpWrapper
      message={'Double click to keep the help display open'}
      tooltipProps={{placement: 'left'}}
      tooltipClass={classes.tooltip}
      watchItem={attendeeDrawerOpen}
    >
      <Button
        onMouseDown={()=> setHelpOpen(true)}
        onMouseUp={()=> setHelpOpen(false)}
        onDoubleClick={toggleHelp}
        aria-label="Help"
      >
        <HelpOutlineOutlinedIcon fontSize={'small'}/>
        <Typography variant="subtitle2" id='help-button'>
          Help
        </Typography>
      </Button>
    </MemoizedHelpWrapper>
  );
};

export default HelpButton;

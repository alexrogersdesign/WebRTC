import clsx from 'clsx';
import PeopleAltIcon from '@material-ui/icons/PeopleAlt';
import TutorialWrapper from '../Tutorial/TutorialWrapper';
import Typography from '@material-ui/core/Typography';
import Button from '@material-ui/core/Button';
import React from 'react';
import {createStyles, makeStyles} from '@material-ui/core/styles';
import Meeting from '../../shared/classes/Meeting';

const useStyles = makeStyles(() =>
  createStyles({
    menuButton: {
      marginRight: 36,
    },
    hide: {
      display: 'none',
    },
  }),
);

interface Props {
    setOpen: React.Dispatch<React.SetStateAction<boolean>>
    open: boolean
    meeting: Meeting | undefined| null,
}

/**
 * Returns button and logic to control the AttendeeDrawer component
 * @param { React.Dispatch<React.SetStateAction<boolean>>} setOpen
 * @param {Meeting | undefined | null} meeting
 * @param {boolean} open
 * @return {JSX.Element}
 * @constructor
 */
export default function AttendeeDrawerButton({setOpen, meeting, open}:Props) {
  const classes = useStyles();

  const hideWhenOpen = {display: open? 'none': 'flex'};
  return (
    <Button
      style={{display: meeting? 'flex': 'none'}}
      aria-label="open drawer"
      onClick={() => setOpen(true)}
      className={clsx(classes.menuButton, {
        [classes.hide]: open,
      })}
    >
      <PeopleAltIcon style={hideWhenOpen}/>
      <TutorialWrapper
        style={hideWhenOpen}
        message={'Expand attendees list for more information'}
        tooltipProps={{placement: 'right'}}
      >
        <Typography style={hideWhenOpen} variant="subtitle2" >
                    Attendees
        </Typography>
      </TutorialWrapper>
    </Button>
  );
}

import clsx from 'clsx';
import PeopleAltIcon from '@material-ui/icons/PeopleAlt';
import Typography from '@material-ui/core/Typography';
import Button from '@material-ui/core/Button';
import React from 'react';
import {createStyles, makeStyles} from '@material-ui/core/styles';
import {MemoizedHelpWrapper} from '../tutorial/HelpWrapper';

const useStyles = makeStyles(() =>
  createStyles({
    menuButton: {
      marginRight: 36,
    },
    hide: {
      display: 'none',
    },
    tooltip: {
      overflowWrap: 'break-word',
      width: '9em',
    },
  }),
);

interface Props {
    setOpen: React.Dispatch<React.SetStateAction<boolean>>
    open: boolean
}

/**
 * Returns button and logic to control the AttendeeDrawer component
 * @param { React.Dispatch<React.SetStateAction<boolean>>} setOpen
 * @param {Meeting | undefined | null} meeting
 * @param {boolean} open
 * @return {JSX.Element}
 * @constructor
 */
export default function AttendeeDrawerButton({setOpen, open}:Props) {
  const classes = useStyles();

  const hideWhenOpen = {display: open? 'none': 'flex'};
  return (
    <MemoizedHelpWrapper
      style={hideWhenOpen}
      message={'Expand the attendees list'}
      tooltipProps={{placement: 'right-end'}}
      tooltipClass={classes.tooltip}
      watchItem={open}
    >
      <Button
        aria-label="open drawer"
        onClick={() => setOpen(true)}
        className={clsx(classes.menuButton, {
          [classes.hide]: open,
        })}
      >
        <PeopleAltIcon style={hideWhenOpen}/>
        <Typography style={hideWhenOpen} variant="subtitle2" >
          Attendees
        </Typography>
      </Button>
    </MemoizedHelpWrapper>
  );
}

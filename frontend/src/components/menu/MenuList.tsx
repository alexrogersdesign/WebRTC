/* eslint-disable no-unused-vars */
import EnableTutorial from '../Tutorial/EnableTutorial';
import RenderWhenLogged from './RenderWhenLogged';
import Divider from '@material-ui/core/Divider';
import List from '@material-ui/core/List';
import RenderWhenNoMeeting from './RenderWhenNoMeeting';
import RenderWhenMeeting from './RenderWhenMeeting';
import RenderWhenNotLogged from './RenderWhenNotLogged';
import React, {KeyboardEvent, MouseEvent} from 'react';
import {createStyles, makeStyles} from '@material-ui/core/styles';
import {MenuStateProps} from './Menu';

interface Props extends MenuStateProps{
  // toggleDrawer: (open: boolean) => (event: any) => void
  setDrawerOpen: (state: boolean) => void
}

const useStyles = makeStyles(() =>
  createStyles({
    topItems: {
      width: '100%',
      display: 'flex',
      flexDirection: 'row',
      justifyContent: 'space-between',
    },
  }),
);

/**
 * @function useState
 * @param {React.Dispatch<React.SetStateAction<boolean>>}
 * @return {void}
 */

/**
 * The list of menu buttons.
 * @param {useState} toggleDrawer
 * @param {useState} setJoinMeetingModal
 * @param {useState} setCreateAccountModalOpen
 * @param {useState} setCreateMeetingModalOpen
 * @param {useState} setLoginModalOpen
 * @return {JSX.Element}
 * @constructor
 */
export default function MenuList({
  setDrawerOpen,
  setJoinMeetingModal,
  setCreateAccountModalOpen,
  setCreateMeetingModalOpen,
  setLoginModalOpen,
}:Props): JSX.Element {
  const classes = useStyles();
  type DrawerInput = KeyboardEvent | MouseEvent

  const handleCloseAttempt = (event: DrawerInput) => {
    /** Prevent Tab or Shirt keys from closing the drawer
     * These keys can be used tp navigate the menu */
    const tabOrShift = ((event as KeyboardEvent).key === 'Tab' ||
        (event as KeyboardEvent).key === 'Shift');
    const keydown = event.type === 'keydown';
    if (keydown && tabOrShift) return;
    setDrawerOpen(false);
  };
  return (
    <div
      role="presentation"
      onClick={handleCloseAttempt}
      onKeyDown={handleCloseAttempt}
    >
      <div className={classes.topItems}>
        <EnableTutorial/>
        <RenderWhenLogged/>
      </div>
      <Divider/>
      <List>
        <RenderWhenNoMeeting
          {...{setJoinMeetingModal, setCreateMeetingModalOpen}}
        />
        <RenderWhenMeeting/>
        <RenderWhenNotLogged
          {...{setLoginModalOpen, setCreateAccountModalOpen}}
        />
      </List>
    </div>
  );
}

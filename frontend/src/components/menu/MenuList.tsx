import EnableTutorial from '../Tutorial/EnableTutorial';
import RenderWhenLogged from './RenderWhenLogged';
import Divider from '@material-ui/core/Divider';
import List from '@material-ui/core/List';
import RenderWhenNoMeeting from './RenderWhenNoMeeting';
import RenderWhenMeeting from './RenderWhenMeeting';
import RenderWhenNotLogged from './RenderWhenNotLogged';
import React from 'react';
import {createStyles, makeStyles} from '@material-ui/core/styles';
import {MenuStateProps} from './Menu';

interface Props extends MenuStateProps{
  toggleDrawer: (open: boolean) => (event: any) => void
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
  toggleDrawer,
  setJoinMeetingModal,
  setCreateAccountModalOpen,
  setCreateMeetingModalOpen,
  setLoginModalOpen,
}:Props): JSX.Element {
  const classes = useStyles();
  return (
    <div
      role="presentation"
      onClick={() => toggleDrawer(false)}
      onKeyDown={() => toggleDrawer(false)}
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

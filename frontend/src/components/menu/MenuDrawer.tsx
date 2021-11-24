/* eslint-disable no-unused-vars */
import React from 'react';
import {makeStyles, createStyles} from '@material-ui/core/styles';
import Drawer from '@material-ui/core/Drawer';
import Typography from '@material-ui/core/Typography';
import ViewHeadlineIcon from '@material-ui/icons/ViewHeadline';
import Button from '@material-ui/core/Button';

import TutorialWrapper from '../Tutorial/TutorialWrapper';
import HelpButton from '../Tutorial/HelpButton';
import MenuList from './MenuList';
import {MenuStateProps} from './Menu';

export interface Props extends MenuStateProps{
    drawerOpen: boolean;
    setDrawerOpen: React.Dispatch<React.SetStateAction<boolean>>
}

const useStyles = makeStyles(() =>
  createStyles({
    drawer: {
      backgroundColor: 'rgb(255,255,255,.6)',
    },
  }),
);

/**
 * @function useState
 * @param {React.Dispatch<React.SetStateAction<boolean>>}
 * @return {void}
 */
/**
 * The menu drawer element.
 * @param {useState} setJoinMeetingModal
 * @param {useState} setCreateAccountModalOpen
 * @param {useState} setCreateMeetingModalOpen
 * @param {useState} setLoginModalOpen
 * @param {boolean} drawerOpen
 * @param {useState} setDrawerOpen
 * @return {JSX.Element}
 * @constructor
 */
export const MenuDrawer = ({
  setJoinMeetingModal,
  setCreateAccountModalOpen,
  setCreateMeetingModalOpen,
  setLoginModalOpen,
  drawerOpen,
  setDrawerOpen,
}:Props) => {
  const classes = useStyles();
  return (
    <>
      <HelpButton/>
      <Button
        onClick={() => setDrawerOpen(true)}
        aria-label="open drawer"
      >
        <ViewHeadlineIcon />
        <TutorialWrapper
          message={'Use the menu to leave the meeting'}
          tooltipProps={{placement: 'bottom-end'}}
        >
          <Typography variant="subtitle2" id='menu-button' >
                        Menu
          </Typography>
        </TutorialWrapper>
      </Button>
      <Drawer
        className={classes.drawer}
        anchor='top'
        open={drawerOpen}
        onClose={() => setDrawerOpen(false)}
      >
        <MenuList
          {...{
            setDrawerOpen,
            setJoinMeetingModal,
            setCreateAccountModalOpen,
            setCreateMeetingModalOpen,
            setLoginModalOpen,
          }}
        />
      </Drawer>
    </>
  );
};
export default MenuDrawer;


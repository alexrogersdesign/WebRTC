/* eslint-disable no-unused-vars */
import React, {useContext} from 'react';
import {makeStyles, createStyles} from '@material-ui/core/styles';
import Drawer from '@material-ui/core/Drawer';
import Typography from '@material-ui/core/Typography';
import ViewHeadlineIcon from '@material-ui/icons/ViewHeadline';
import Button from '@material-ui/core/Button';

import HelpButton from '../tutorial/HelpButton';
import MenuList from './MenuList';
import {MenuStateProps} from './Menu';
import {MemoizedHelpWrapper} from '../tutorial/HelpWrapper';
import {AppStateContext} from '../../context/AppStateContext';

export interface Props extends MenuStateProps{
    drawerOpen: boolean;
    setDrawerOpen: React.Dispatch<React.SetStateAction<boolean>>
}

const useStyles = makeStyles(() =>
  createStyles({
    tooltip: {
      whiteSpace: 'nowrap',
      transform: 'translate(0, -10px)',
    },
  }),
);

/**
 * @function useState
 * @param {React.Dispatch<React.SetStateAction<boolean>>}
 * @return {void}
 */
/**
 * Renders the menu drawer component which is a drop down menu
 * control element attached to the top of the page.
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
  const {attendeeDrawerOpen} = useContext(AppStateContext);
  return (
    <>
      <HelpButton/>
      <MemoizedHelpWrapper
        message={'Access the menu'}
        tooltipProps={{placement: 'bottom-end'}}
        tooltipClass={classes.tooltip}
        watchItem={attendeeDrawerOpen}
      >
        <Button
          onClick={() => setDrawerOpen(true)}
          aria-label="open drawer"
        >
          <ViewHeadlineIcon />
          <Typography variant="subtitle2" id='menu-button' >
              Menu
          </Typography>
        </Button>
      </MemoizedHelpWrapper>
      <Drawer
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


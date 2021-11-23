import React, {useContext, useMemo} from 'react';
import TutorialPrompt from './TutorialPrompt';
import {RestContext} from '../../context/rest/RestContext';

interface Props {
  drawerOpen: boolean
  createAccountModalOpen: boolean
  loginModalOpen: boolean
  createMeetingModalOpen: boolean
  joinMeetingModalOpen: boolean
}

/**
 * The memoized tutorial components to render.
 * The components are memoized to prevent "blinking" when
 * other state changes and the overall component re-renders.
 * @param {boolean} drawerOpen If the menu drawer is open
 * @param {boolean} createAccountModalOpen If the create account modal is open
 * @param {boolean} loginModalOpen If the login modal is open
 * @param {boolean} createMeetingModalOpen If the create meeting modal is open
 * @param {boolean} joinMeetingModalOpen If the join meeting modal is open
 * @return {JSX.Element}
 * @function
 */
const RenderTutorial = ({
  drawerOpen,
  createAccountModalOpen,
  loginModalOpen,
  createMeetingModalOpen,
  joinMeetingModalOpen,
}:Props) => {
  const {currentUser, meeting} = useContext(RestContext);
  const homePrompt= 'You are not logged in.' +
      ' Click the menu button to proceed.';
  const loginMenuPrompt ='You can create an account' +
      '\nor click Login to proceed with a demo account.';
  const meetingListPrompt = 'Join a meeting by clicking its icon below' +
      ' or click the menu icon for more options';
  const joinedMeetingPrompt = 'Click and hold the help icon at the top to ' +
      'display the help menu. Double click the icon to keep the help ' +
      'menu open.';
  const landingPage =
      (!currentUser && !loginModalOpen && !createAccountModalOpen);
  const preMeetingPage =
      (currentUser &&
          !meeting &&
          !drawerOpen &&
          !joinMeetingModalOpen &&!
      createMeetingModalOpen);
  const inMeetingPage = currentUser && meeting;
  return useMemo(() => {
    return (
      <>
        {landingPage && (
          <>
            {!drawerOpen &&(
              <TutorialPrompt
                defaultOpen={!drawerOpen}
                synchronizeClose={!drawerOpen}
                synchronizeOpen={!drawerOpen}
                message={homePrompt}
                verticalOffset={'10%'}
              />)}
            {drawerOpen && (
              <TutorialPrompt
                defaultOpen={drawerOpen}
                synchronizeClose={drawerOpen}
                synchronizeOpen={drawerOpen}
                anchorOrigin={{vertical: 'bottom', horizontal: 'center'}}
                message={loginMenuPrompt}
                verticalOffset={'20%'}
              />
            )}
          </>
        )}
        {preMeetingPage &&(
          <TutorialPrompt
            defaultOpen={!drawerOpen}
            verticalOffset={'8%'}
            horizontalOffset={'40%'}
            message={meetingListPrompt}
          />
        )}
        {inMeetingPage &&(
          <TutorialPrompt
            defaultOpen={!drawerOpen}
            verticalOffset={'10%'}
            horizontalOffset={'40%'}
            message={joinedMeetingPrompt}
          />
        )}
      </>
    );
  }, [
    drawerOpen,
    landingPage,
    preMeetingPage,
    inMeetingPage,
  ]);
};
export default RenderTutorial;

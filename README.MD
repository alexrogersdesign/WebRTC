# WebRTC Video Chat 

![img](https://custom-icon-badges.herokuapp.com/badge/WebRTC-Try%20It-blue.svg?label=WebRTC&logo=video-call&logoColor=white)
[![Scrutinizer Code Quality](https://scrutinizer-ci.com/g/alexrogersdesign/WebRTC/badges/quality-score.png?b=main)](https://scrutinizer-ci.com/g/alexrogersdesign/WebRTC/?branch=main)

## Features 
- **Group Video Calls**
  - Peer to Peer streaming solution using WebRTC
    - Server does not need to touch or distribute video streams
- **Video Controls**
  - Background Removal
    - The user can hide their background 
    - Machine Learning body segmentation and background masking
  - Screen Sharing
  - Video and Audio Muting
- **WebSocket Signaling**
  - External event notifications
    - User Join / Depature
    - Changes to meeting avalibility
  - User text messages 
- **Security Focused**
  - JWT authentication
  - HttpOnly cookies
    - Tokens are never placed in localStorage  
  - Refresh Tokens
  - Token are shared and validated between both WebSocket and HTTP endpoints 
- **Text Chat**
  - Messages can be sent between participants in a meeting
  - Messages are persisted in database and referenced to the meeting
    - A user can see messages sent before they joined 
- **User Accounts / Profiles**
  - Users can upload profile images
  - User information is communicated between users
- **Meeting Creation**
  - Meetings can have icon images
  - Title, description, start and end times are stored. 
- **End to End Testing**
  - Multi-browser simultaneous tests simulating multiple users interacting with each other
    - Signalling between users in a the same call (user join and departure messages)
    - Video call streams between users
    - Chat functionality
  - Allure reports


Written in React / Typescript.



 

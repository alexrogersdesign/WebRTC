# WebRTC Video Chat 
[Try it here](https://ar-webrtc.herokuapp.com/)

https://user-images.githubusercontent.com/51722825/142732847-9e8634c5-13ea-40d7-8326-1f8ada9c1638.mp4

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



 

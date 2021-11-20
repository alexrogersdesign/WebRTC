# WebRTC Video Chat [Try it](https://ar-webrtc.herokuapp.com/)



https://user-images.githubusercontent.com/51722825/142732847-9e8634c5-13ea-40d7-8326-1f8ada9c1638.mp4



## Features 
- **Group Video Calls Streaming**
  - Peer to Peer calling solution using WebRTC
    - Server does not need to touch or distribute video streams
- **Video Controls**
  - Background Removal
    - The user can hide their background 
    - Machine Learning body segmentation and background masking
- **WebSocket Signaling**
  - A central server handles text chat and app communications 
- **Security Focused**
  - JWT authentication
  - HttpOnly cookies
  - Refresh Tokens
  - Token are shared and validated between both WebSocket and HTTP endpoints 
- **Text Chat**
  - Messages can be sent between call participants
  - Messages are persisted in database and a users can view messages sent when they were not on the call
- **User Accounts / Profiles**
  - Users can upload profile images
  - User information is communicated between users
- **Meeting Creation**
  - Meetings can have icon images
  - Meetings can be scheduled 
- **End to End Testing**
  - Multi browser simultaneous tests verifies that multiple users can interact as required. 
    - Signalling between multiple users in a the same call
    - Video call streams between users
    - Chat functionality


Written in React / Typescript.



 

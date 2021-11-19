# WebRTC Video Chat

> Full stack video chat app 

## Features 
- Mutli User Peer to Peer Streaming
  - Serverless calling solution using WebRTC
  - Group video call sessions
- AI Background Removal
  - Tensorflow body segmentation with background masking
- Websocket Signaling
  - A centeral server handles text chat and app communications 
- Security Focused
  - HTTP Only Cookies
  - JWT Token
  - Refresh Tokens
  - Token are shared and validated between both websocket and HTTP endpoints 
- Text Chat
  - Messages can be sent between call participants
- User Accounts / Profiles
  - Users can upload profile images
  - User information is communicated between users
- Meeting Creation 
  - Meetings can have icon images
  - Meeting start and end dates
- End to End Testing
  - Multi browser simultaneous tests 
    - Signalling between multiple users in a the same call
    - Video call streams between users
    - Chat functionality


Written in React / Typescript.
 

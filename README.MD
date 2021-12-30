# WebRTC Video Chat 

![img](https://custom-icon-badges.herokuapp.com/badge/WebRTC-Try%20It-blue.svg?label=WebRTC&logo=video-call&logoColor=white)
[![Scrutinizer Code Quality](https://scrutinizer-ci.com/g/alexrogersdesign/WebRTC/badges/quality-score.png?b=main)](https://scrutinizer-ci.com/g/alexrogersdesign/WebRTC/?branch=main)



https://user-images.githubusercontent.com/51722825/147791058-d156c86c-4169-4b77-8157-dd77190015c5.mp4



## Features 
- **Group Video Calls**
  - Peer to Peer streaming solution using WebRTC
    - Server does not need to touch or distribute video streams
- **Video Controls**


https://user-images.githubusercontent.com/51722825/147789826-aa8f9dde-cefc-48b4-b447-45d75a557576.mp4


  - **Screen Sharing**

https://user-images.githubusercontent.com/51722825/147789151-892bf106-8b6c-46de-a18d-84380cf90def.mp4


- **Background Removal**
    - The user can hide their background 
    - Machine Learning body segmentation and background masking


https://user-images.githubusercontent.com/51722825/147789122-1701939c-3b87-4b35-933e-62a145d05135.mp4 


- **Fully Responsive**

https://user-images.githubusercontent.com/51722825/147789026-fec6a9e1-c68f-4d71-b8d2-b0b436814afb.mp4

- **Text Chat** 
  - Messages can be sent between participants in a meeting
  - Messages are persisted in database and referenced to the meeting
    - A user can see messages sent before they joined 

https://user-images.githubusercontent.com/51722825/147789064-19da1c0a-e8dd-4762-8dc9-c344e2030f85.mp4

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



 

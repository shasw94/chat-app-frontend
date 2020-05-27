This project was bootstrapped with [Create React App](https://github.com/facebook/create-react-app).

## Dependancies
* Backend App at [here][https://github.com/shasw94/chat-app]
* node, npm 

## Getting started
* Clone the Repository`
* Browse to the repository and then hit `npm install`
* Do not run the this app at port 3000, You may choose at any other port. It is recommend starting the backend server first and then node will automatically handle the port to some other port.
* after the backend server is up, hit `npm start` to start the front end server.

## Using Frontend Application

### Register/Login
* The app should prompt a Login/Registration page

![Login screenshot][./static/login.png]

* Switch to the Register tab on the right as shown below

![Login Register gif][/static/login-register.gif]

* Fill in your details, and input a strong password( at least 8 characters with a combination of upper and lower case letters, and also a special character)
* On successful Registration, go back to the Login page, using the same method as shown in the gif.
* Enter Your credentials
* On successful login you should see the chat page.

![LoginSuccessfulChatPage][/static/LoginSuccessfulChatPage.gif]

### Creating Chat Rooms / Topics for conversation

* Before chatting, it is a must to create a room or a topic for the chat to occur between people.
* Click on `New room / Add User to Group` button on the right.

![AddRoom][/static/AddRoom.gif]

* You should be prompted a `Create Room` Form. Give a topic of your choice and then click on submit.

![AddRoomSubmit][/static/AddRoomSubmit.gif]

* You should now be back to the `Chat Page` as shown in the gif.

### Adding other users to the room

* Now, we add users to the room/topic.

* Click on the same `New room / Add User to Group` on the right, to open `Create Room` Form.

* As with the `Login page`, click on the right to open `Add User` Form.

![SwitchToAddUser][/static/SwitchToAddUser.gif]

* Select the User, you want to add and the group you want the user to add in from the dropdowns in the form
* Click on Submit to add the user to the group, after which you should be back at the `Chat Page` 

# All set for Private Chat
* Now We have what is there to start a private conversation with the user, to whom you have added to just now.
* On the `Your Chats` banner click on the group that you just created.
* A text box should be visible then on the screen.

![groupClick][/static/groupClick.gif]

#### Send messages live or to a user even if they are offline
* Now you could send the message in the room, the other user does not have to be online. 
* If the other user, the one you just added, is online he can get live messages from you, and vice versa

![groupClick][/static/chat.gif]

### Making Group Chat Room

* You could go ahead and add more people to the chat room, same as described above, to make it a group chat.

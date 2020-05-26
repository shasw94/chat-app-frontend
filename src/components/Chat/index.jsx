import React from 'react';
import './chat.scss';
import { MessageList } from './MessageList/message-list';
import io from "socket.io-client";
import RoomList from './RoomList/room-list';
import axios from 'axios';
import { store } from 'react-notifications-component';
import GroupList from './MessageList/group-list';
import SendMessageForm from './SendMessage/send-message';

const socket = io('http://localhost:3000');

class Chat extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            roomId: null,
            socket: null,
            user: {},
            groupId: null,
            groupDictionary: [],
            messages: [],
            joinableRooms: [],
            groups: [],
            joinedRooms: [],
            friends: [],
            currentUser: null,
            activeGroup: null,
        }
    }

    displayErrorMessage = (title, message) => {
        store.addNotification({
            title: title,
            message: message,
            type: "danger",
            insert: "top",
            userDictionary: {},
            container: "top-right",
            animationIn: ["animated", "fadeIn"],
            animationOut: ["animated", "fadeOut"],
            dismiss: {
                duration: 3000,
                onScreen: true
            }
        });
        this.props.history.push('/');
    }


    loadMessagesOfGroup = (id) => {
        let params = {
            id: id
        }
        axios.post('http://localhost:3000/messages/getMessages', params)
            .then(response => {
                this.displaySuccessMessage("Success", "Messages Retrieved");
                console.log(response.data);
                let { data } = response;
                let messages = [];
                data.forEach(d => {
                    let m = {
                        'username': d.sender.username,
                        'text': d.message,
                    }
                    messages.push(m);
                })
                this.setState({ messages: messages });
            })
            .catch(error => {
                this.errorHandler(error);
            })
    }



    subscribeToRoom = (room) => {
        this.loadMessagesOfGroup(room.id);
    }


    getUser = () => {
        axios.post('http://localhost:3000/auth/getLoggedInUser', this.state)
            .then(response => {
                this.setState({ currentUser: response.data })
            })
            .catch(error => {
                this.errorHandler(error);
            })
    }

    displaySuccessMessage = (title, message) => {
        store.addNotification({
            title: title,
            message: message,
            type: "success",
            insert: "top",
            container: "top-right",
            animationIn: ["animated", "fadeIn"],
            animationOut: ["animated", "fadeOut"],
            dismiss: {
                duration: 2000,
                onScreen: true
            }
        });
    }

    getFriendList = () => {
        axios.post('http://localhost:3000/auth/getMyFriendList', this.state)
            .then(response => {
                this.displaySuccessMessage("Success", "Friend List Fetched")
                this.setState({ friends: response.data })
            })
            .catch(error => {
                this.errorHandler(error);
            })
    }

    errorHandler = (error) => {
        let errObj = Object.assign({}, error);
        let errMsgs = JSON.parse(errObj.response.request.responseText);
        let messages = errMsgs.message;
        if (Array.isArray(messages)) {
            messages.forEach(m => {
                this.displayErrorMessage('Error', m)
            });
        } else {
            this.displayErrorMessage('Error', messages);
        }
    }

    getGroups = () => {
        axios.post('http://localhost:3000/groups/listGroupsOfUser/')
            .then(response => {
                this.displaySuccessMessage("Success", "Groups Fetched")
                this.setState({ groups: response.data });
                console.log('datum', response.data);
            })
            .catch(error => {
                this.errorHandler(error);
            })
    }

    makeRoomString = (string, groupUserId) => {
        return string + groupUserId;
    }

    getMessages = (id = 1, isGroup = false) => {

    }

    recieveChatMessage = (msg) => {
        let { messages } = this.state;

        messages = [...messages, msg];

        this.setState({ messages: messages })
    }

    isMemberActiveGroup = () => {
        return this.state.groups[this.activeGroup];
    }

    toggleRoomMembership = () => {
        if (this.isMemberActiveGroup()) {
            socket.emit('leaveRoom', this.state.activeGroup);
        } else {
            socket.emit('joinRoom', this.activeGroup);
        }
    }

    async componentDidMount() {
        await this.getUser();
        await this.getFriendList();
        await this.getGroups();

        socket.on('chatToClient', (msg) => {
            console.log(msg)
            this.recieveChatMessage(msg);
        });

        socket.on('connect', () => {
            this.toggleRoomMembership();
        })

        socket.on('joinedRoom', (group) => {
            this.state.groups[group] = true;
        })

        socket.on('leftRoom', (group) => {
            this.state.groups[group] = false;
        })
    }

    setResponse = (data) => {
        this.setState({ joinableRooms: data })
    }

    render() {
        return (
            <div className="Chat">
                {/* {this.state.friends.map((items, key) => <div>
                    {items.username}
                </div>)} */}
                <RoomList
                    rooms={[...this.state.friends]}
                    roomId={this.state.roomId}
                />
                <GroupList
                    subscribeToRoom={this.subscribeToRoom}
                    groups={[...this.state.groups]}
                    roomId={this.state.groupId}
                />
                {
                    this.state.activeGroup ? <div>
                        <MessageList
                            roomId={this.state.roomId}
                            messages={this.state.messages}
                            socket={socket}
                        />
                        <SendMessageForm
                            username={this.state.currentUser ? this.state.currentUser.username : 'Anonymous'}
                            senderId={this.state.currentUser ? this.state.currentUser.id : null}
                            room='Group-1'
                            receiverid={1}
                            messages={this.state.messages}
                            socket={socket}
                        />
                    </div> : null
                }
            </div>
        )
    }
}

export default Chat;
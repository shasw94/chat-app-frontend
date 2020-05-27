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
            messages: {},
            joinableRooms: [],
            groups: {},
            groupList: [],
            friends: [],
            currentUser: null,
            activeGroup: null,
            openModal: false,
            viewSwitcher: 1,
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
        if (this.state.activeGroup) socket.emit('leaveRoom', this.state.activeGroup);
    }


    loadMessagesOfGroup = (id) => {
        let params = {
            id: id
        }
        console.log("verifyParam", params);
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
                let messageGroup = this.state.messages;

                messageGroup[id] = messages
                this.setState({ messages: messageGroup });
            })
            .catch(error => {
                this.errorHandler(error);
            })
    }



    subscribeToRoom = (room) => {
        console.log("roomObj", room);
        if (this.state.activeGroup != null) {
            socket.emit('leaveRoom', this.state.activeGroup);
        }
        this.setState({activeGroup: room.groupsId});
        this.loadMessagesOfGroup(room.groupsId);
        
        socket.emit('joinRoom', room.groupsId);
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
                this.setState({ groupList: response.data });
                console.log('datum', response.data);
            })
            .catch(error => {
                this.errorHandler(error);
            })
    }

    isMemberActiveGroup = () => {
        return this.state.groups[this.state.activeGroup];
    }

    recieveChatMessage = (msg) => {
        console.log("state", this.state);
        let { messages } = this.state;
        if (this.state.activeGroup==null) return;
        
        console.log("new error ako thau", messages, this.state.activeGroup);
        messages[this.state.activeGroup] = [...messages[this.state.activeGroup], msg];

        this.setState({ messages: messages })
    }

    toggleRoomMembership = () => {
        if (this.isMemberActiveGroup()) {
            socket.emit('leaveRoom', this.state.activeGroup);
        } else {
            socket.emit('joinRoom', this.state.activeGroup);
        }
    }

     componentDidMount() {
        this.getUser();
        this.getFriendList();
        this.getGroups();

        socket.on('chatToClient', (msg) => {
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


    createChatClick = () => {
        let {viewSwitcher} = this.state;
        viewSwitcher = 2;
        this.setState({viewSwitcher});
        this.props.history.push({
            pathname: '/forms',
            state: { friends: this.state.friends, groups: this.state.groupList }
        });
    }

    render() {
        return (
            <div className="Chat">
                <h1>
                    Hi, {this.state.currentUser ? this.state.currentUser.username : null}
                </h1>
                <RoomList
                    rooms={[...this.state.friends]}
                    roomId={this.state.roomId}
                />
                {/* <NewGroup open={this.state.openModal}/> */}
                <GroupList
                    subscribeToRoom={this.subscribeToRoom}
                    groups={[...this.state.groupList]}
                    roomId={this.state.activeGroup}
                    title="click on "

                />
                {
                    this.state.activeGroup != null ? <div>
                        <MessageList
                            roomId={this.state.roomId}
                            messages={this.state.messages[this.state.activeGroup]}
                            socket={socket}
                        />
                        <SendMessageForm
                            username={this.state.currentUser ? this.state.currentUser.username : 'Anonymous'}
                            senderId={this.state.currentUser ? this.state.currentUser.id : null}
                            receiverid={this.state.activeGroup}
                            groups={this.state.groups}

                            messages={this.state.messages}
                            socket={socket}
                        />
                    </div> : null
                }
                <div className="footer">

                    <button type="button" className="btn" onClick={this.createChatClick}>
                        New Room / Add User to Group
                    </button>
                </div>

            </div>
        )
    }
}

export default Chat;
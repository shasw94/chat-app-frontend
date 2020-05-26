import React from 'react';
import './chat.scss';
import { MessageList } from './MessageList/message-list';
import socketIOClient from "socket.io-client";
import RoomList from './RoomList/room-list';
import axios from 'axios';
import { store } from 'react-notifications-component';
import GroupList from './MessageList/group-list';
import SendMessageForm from './SendMessage/send-message';


class Chat extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            roomId: null,
            groupId: null,
            groupDictionary: [],
            messages: [],
            joinableRooms: [],
            groups: [],
            joinedRooms: [],
            friends: []
        }
    }

    displayErrorMessage = (title, message) => {
        store.addNotification({
            title: title,
            message: message,
            type: "danger",
            insert: "top",
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

    subscribeToRoom = (id, isGroup) => {
        switch (isGroup) {
            case true:
                break;
            default:
                break;
        }
    }
    getFriendList = () => {
        axios.post('http://localhost:3000/auth/getMyFriendList', this.state)
            .then(response => {
                store.addNotification({
                    title: "Success",
                    message: "Friend List Fetched",
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
                this.setState({friends: response.data})
            })
            .catch(error => {
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
            })
    }

    getGroups = () => {
        axios.post('http://localhost:3000/groups/listGroupsOfUser/')
            .then(response => {
                store.addNotification({
                    title: "Success",
                    message: "Groups Fetched",
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
                this.setState({groups: response.data});
            })
            .catch(error => {
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
            })
    }

    getMessages = (id=1, isGroup=false) => {
        
    }

    componentDidMount() {
        this.getFriendList();
        this.getGroups();
    }

    setResponse = (data) => {
        this.setState({joinableRooms: data})
    }

    render() {
        return (
            <div className="Chat">
                {/* {this.state.friends.map((items, key) => <div>
                    {items.username}
                </div>)} */}
                <RoomList
                    subscribeToRoom={this.subscribeToRoom}
                    rooms={[...this.state.friends]}
                    roomId={this.state.roomId}
                />
                <GroupList 
                    subscribeToRoom={this.subscribeToRoom}
                    groups={[...this.state.groups]}
                    roomId={this.state.groupId}
                />
                <MessageList
                    roomId={this.state.roomId}
                    messages={this.state.messages}
                />
                <SendMessageForm />
            </div>
        )
    }
}

export default Chat;
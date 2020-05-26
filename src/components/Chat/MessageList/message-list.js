import React from 'react';
import Message from './Message/Message';

const DUMMY_DATA = [
    {
        "username": "shubham",
        "text": "Hey, how is it going?",
    },
    {
        "username": "shaswat",
        "text": "All right, how are u?",
    },
    {
        "username": "shubham",
        "text": "I am fine too",
    },
    
];

export class MessageList extends React.Component {
    render() {
        return (
            <div className="message-list">
                {DUMMY_DATA.map((message, index) => {
                    return <Message username = {message.username} text={message.text} />
                })}
            </div>
        )
    }
}
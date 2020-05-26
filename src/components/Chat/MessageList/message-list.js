import React from 'react';
import Message from './Message/Message';


export class MessageList extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            messages: []
        }
    }

    recieveChatMessage = (msg) => {
        
    }

    toggleRoom

    componentDidMount() {
       
    }
    render() {
        return (
            <div className="message-list">
                {this.props.messages.map((message, index) => {
                    return <Message key={index} username={message.username} text={message.text} />
                })}
            </div>
        )
    }
}
import React from 'react';

class SendMessageForm extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            message: '',
        }
    }

    handleChange = (e) => {
        this.setState({message: e.target.value})
    }

    isMemberOfActiveRoom() {
        return true;
        // return this.props.groups[this.props.receiverid];
    }

    handleSubmit = (e) => {
        e.preventDefault();
        const {message} = this.state;
        if (this.isMemberOfActiveRoom()) {
            this.props.socket.emit('chatToServer', {
                sender: this.props.senderId, text: message, group: this.props.receiverid, username: this.props.username,
                room: this.props.receiverid
            })
        } else {
            console.log("You must join the room before sending messages!");
        }
        this.setState({message: ''});

        // const {socket} = this.props;
        // const {message} = this.state;
        // this.setState({message: ''});
        // console.log("emitted");
        // socket.emit(this.props.receiverid, {sender: this.props.senderId, text: message, group: this.props.receiverid, username: this.props.username})
    }

    handleOnChage = (event) => {
        this.setState({ [event.target.name]: event.target.value })
    }

    reset = () => {
        
    }

    render() {
        return (
            <form 
            onSubmit={this.handleSubmit}
            className="send-message-form">
                <input
                    name="message"
                    onChange={this.handleOnChage}
                    value={this.state.message}
                    placeholder="Type your message and hit ENTER"
                    type="text" />
            </form>
        )
    }
}

export default SendMessageForm;
import React from 'react';

class SendMessageForm extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            message: '',
            i: 0,
        }
    }

    handleChange = (e) => {
        this.setState({message: e.target.value})
    }

    handleSubmit = (e) => {
        e.preventDefault();
        const {socket} = this.props;
        const {message, i} = this.state;
        this.setState({message: ''});
        console.log("emitted");
        socket.emit('chatToServer', {sender: this.props.senderId, text: message, group: this.props.receiverid, username: this.props.username})
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
import React from 'react';
import loginImg from "./dialogue.svg";
import axios from 'axios';
import { store } from 'react-notifications-component';


export class CreateRoom extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            name: '',
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

    onCreateButtonClick = () => {
        const params = { 'name' : this.state.name }
        axios.post('http://localhost:3000/groups/createGroup', params)
        .then(response => {
            this.displaySuccessMessage("Success", "Login Successful")
            this.props.history.push('/chat-app')
        })
        .catch(error => {
            let errObj = Object.assign({}, error);
            let errMsgs = JSON.parse(errObj.response.request.responseText);
            if (Array.isArray(errMsgs.message)) {
                errMsgs.message.forEach(m => {
                    this.displayErrorMessage('Error', m)
                });
            } else {
                this.displayErrorMessage('Error', errMsgs.message);
            }
        })
    }

    handleChange = event => {
        this.setState({ [event.target.name]: event.target.value })
    };

    render() {
        const { usersid } = this.state
        return <div>

            <div className="base-container" ref={this.props.containerRef}>
                <div className="header">Create Room</div>
                <form>
                    <div className="content">
                        <div className="image">
                            <img src={loginImg} alt="login-svg" />
                        </div>
                        <div className="form">
                            <div className="form-group">
                                <label htmlFor="username">Enter Group/Room name</label>
                                <input type="text" name="name" placeholder="Enter name for group" value={this.state.name} onChange={this.handleChange} />
                            </div>
                        </div>
                    </div>
                    <div className="footer">
                        <button type="button" className="btn" onClick={this.onCreateButtonClick}>
                            Create
                        </button>
                    </div>
                </form>
            </div>
            <div className="source">Icons made by <a href="https://www.flaticon.com/authors/nhor-phai" 
            title="Nhor Phai">Nhor Phai</a> from <a href="https://www.flaticon.com/" title="Flaticon">www.flaticon.com</a></div>
        </div>
    }
}
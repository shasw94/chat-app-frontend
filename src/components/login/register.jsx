import React from 'react';
import loginImg from "../../login.svg";
import axios from 'axios';
import { store } from 'react-notifications-component';

export class Register extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            username: '',
            password: '',
            confirmpassword: '',
            name: '',
            room: '',
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

    onRegisterButtonClick = () => {
        const {password, confirmpassword} = this.state;
        if (password !== confirmpassword) {
            this.displayErrorMessage('Password Mismatch', 'Confirm password is not same as Password')
            return;
        }
        axios.post('http://localhost:3000/auth/signup', this.state)
            .then(response => {
                store.addNotification({
                    title: "Registration Complete",
                    message: "Please Login to Continue",
                    type: "success",
                    insert: "top",
                    container: "top-right",
                    animationIn: ["animated", "fadeIn"],
                    animationOut: ["animated", "fadeOut"],
                    dismiss: {
                        duration: 4000,
                        onScreen: true
                    }
                });
            })
            .catch(error => {
                let errObj = Object.assign({}, error);
                let errMsgs = JSON.parse(errObj.response.request.responseText);
                let messages = errMsgs.message;
                if (Array.isArray(messages)) {
                    messages.forEach(m => {
                        this.displayErrorMessage("Error", m)
                    });
                } else {
                    this.displayErrorMessage("Error", messages)
                }
            })
    }

    handleOnChangeEvent = (event) => {
        this.setState({ [event.target.name]: event.target.value })
    }

    render() {
        return <div><div className="base-container" ref={this.props.containerRef}>
            <div className="header">Register</div>
            <div className="content">
                <div className="image">
                    <img src={loginImg} />
                </div>
                <div className="form">
                    <div className="form-group">
                        <label htmlFor="username">Username</label>
                        <input type="text" name="username" placeholder="username" value={this.state.username} onChange={this.handleOnChangeEvent}/>
                    </div>
                    <div className="form-group">
                        <label htmlFor="username">Password</label>
                        <input type="password" name="password" placeholder="password" value={this.state.password} onChange={this.handleOnChangeEvent}/>
                    </div>
                    <div className="form-group">
                        <label htmlFor="username">Confirm Password</label>
                        <input type="password" name="confirmpassword" placeholder="Re-enter password" value={this.state.confirmpassword} onChange={this.handleOnChangeEvent}/>
                    </div>
                </div>
            </div>
            <div className="footer">
                <button type="button" className="btn" onClick={this.onRegisterButtonClick}>
                    Register
                </button>
            </div>
        </div>
        <div className="source">Icons made by <a href="https://www.flaticon.com/authors/nhor-phai" title="Nhor Phai">Nhor Phai</a> from <a href="https://www.flaticon.com/" title="Flaticon">www.flaticon.com</a></div>
        </div>
    }
}
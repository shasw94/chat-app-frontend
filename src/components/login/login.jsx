import React from 'react';
import loginImg from "../../login.svg";
import { store } from 'react-notifications-component';
import axios from 'axios';
import { Link } from 'react-router-dom';


export class Login extends React.Component {

    constructor(props) {
        console.log(props.history)
        super(props);
        this.state = {
            username: '',
            password: '',
            name: '',
            room: '',
            redirect: false,
            bearerToken: ''
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

    onLoginButtonClick = () => {
        axios.post('http://localhost:3000/auth/signin', this.state)
            .then(response => {
                store.addNotification({
                    title: "Success",
                    message: "Login Successful",
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
                axios.defaults.headers.common['Authorization'] = `Bearer ${response.data.accessToken}`
                this.props.history.push({
                    pathname: '/chat-app',
                    state: { accessToken: response.data.accessToken }
                });
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

    handleOnChangeEvent = (event) => {
        this.setState({ [event.target.name]: event.target.value })
    }

    render() {
        const { redirect } = this.state;
        return <div>
            <div className="base-container" ref={this.props.containerRef}>
                <div className="header">Log in</div>
                <form>
                    <div className="content">
                        <div className="image">
                            <img src={loginImg} alt="login-svg" />
                        </div>
                        <div className="form">
                            <div className="form-group">
                                <label htmlFor="username">Username</label>
                                <input type="text" name="username" placeholder="username" value={this.state.username} onChange={this.handleOnChangeEvent} />
                            </div>
                            <div className="form-group">
                                <label htmlFor="username">Password</label>
                                <input type="password" name="password" placeholder="password" value={this.state.password} onChange={this.handleOnChangeEvent} />
                            </div>
                        </div>
                    </div>
                    <div className="footer">
                        <button type="button" className="btn" onClick={this.onLoginButtonClick}>
                            Login
                        </button>
                    </div>
                </form>
            </div>
            <div className="source">Icons made by <a href="https://www.flaticon.com/authors/nhor-phai" title="Nhor Phai">Nhor Phai</a> from <a href="https://www.flaticon.com/" title="Flaticon">www.flaticon.com</a></div>
        </div>
    }
}
import React from 'react';
import loginImg from "./dialogue.svg";
import axios from 'axios';
import { store } from 'react-notifications-component';
import Select from 'react-select';

export class AddUser extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            friends: this.props.location.state.friends,
            groups: this.props.location.state.groups,
            filteredFriends: [],
            filteredGroups: [],
            usersid: null,
            name: '',
            groupsid: null,
            usersid: null
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


    componentDidMount() {
        this.filterForUserObj();
        this.fileterForGroupsObj();
    }


    filterForUserObj = () => {
        const { friends } = this.state;
        let options = [];
        friends.forEach(frnd => {
            let el = {
                'value': frnd.id,
                'label': frnd.username
            }
            options.push(el);
        })
        this.setState({ filteredFriends: options });
    }

    fileterForGroupsObj = () => {
        const { groups } = this.state;
        console.log("groups", groups);
        let options = [];
        groups.forEach(frnd => {
            let el = {
                'value': frnd.groups.id,
                'label': frnd.groups.name
            }
            options.push(el);
        })
        console.log("opt", options);
        this.setState({ filteredGroups: options });
    }




    handleChange = groupsid => {
        this.setState({ groupsid })
    };

    handleUsersChange = usersid => {
        this.setState({usersid})
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
        let params = {
            usersid: this.state.usersid.value,
            groupsid: this.state.groupsid.value
        }
        axios.post('http://localhost:3000/groups/creatGroupUser', params)
        .then(response => {
            this.displaySuccessMessage("Success", "User Added")
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
    

    render() {
        const { usersid, groupsid } = this.state
        return <div>

            <div className="base-container" ref={this.props.containerRef}>
                <div className="header">Add User</div>
                <form>
                    <div className="content">
                        <div className="image">
                            <img src={loginImg} alt="login-svg" />
                        </div>
                        <div className="form">
                            <div className="form-group">
                                <label htmlFor="username">Select User to Add for new chat</label>
                                <Select name="usersid" value={usersid} options={this.state.filteredFriends} onChange={this.handleUsersChange} />
                            </div>
                            <div className="form-group">
                                <label htmlFor="username">Enter Group/Room name</label>
                                <Select name="groupsid" value={groupsid} options={this.state.filteredGroups} onChange={this.handleChange} />
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
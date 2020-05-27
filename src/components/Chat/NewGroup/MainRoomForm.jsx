import React from 'react';
import './../../../App.scss';
import 'react-notifications-component/dist/theme.css';
import { AddUser, CreateRoom } from './../NewGroup';

class MainRoomForm extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            isLoginActive: true,
            isAuthenticate: false,
        }
    }
    changeState() {
        const { isLoginActive } = this.state;
        if (isLoginActive) {
            this.rightSide.classList.remove("right");
            this.rightSide.classList.add("left");
        } else {
            this.rightSide.classList.remove("left");
            this.rightSide.classList.add("right");
        }

        this.setState((prevState) => ({ isLoginActive: !prevState.isLoginActive }));
    }
    testFunction = (bool) => {
        this.setState({isAuthenticate: true});
    }
    render() {
        const { isLoginActive } = this.state;
        const current = isLoginActive ? "Add User" : "Create Room";
        const currentActive = isLoginActive ? "login" : "register";
        return ( 
            <div className="Main">
                <div className="login">
                    <div className="container">
                        {isLoginActive && <CreateRoom containerRef={(ref) => this.current = ref} {...this.props}/>}
                        {!isLoginActive && <AddUser containerRef={(ref) => this.current = ref} {...this.props} />}
                    </div>
                    <RightSide
                        current={current}
                        containerRef={ref => this.rightSide = ref}
                        onClick={this.changeState.bind(this)} />
                </div>
            </div> 
        )
    }   
}

let ft = 1;

const RightSide = props => {
    return (
        <div
            className={ft >= 0 ? "right-side right" : "right-side"}
            ref={props.containerRef}
            onClick={props.onClick}>
            <div className="inner-container">
                <div className="text">{props.current}</div>
            </div>
        </div>
    );
}
export default MainRoomForm;
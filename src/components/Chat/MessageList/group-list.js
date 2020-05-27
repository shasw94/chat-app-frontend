import React from 'react';

class GroupList extends React.Component {
    render() {
        const orderedGroups = [...this.props.groups].sort(((a,b) => a.id > b.id))
        return (
            <div className="group-list">
                <ul>
                <h3>Your Chats:</h3>
                    {orderedGroups.map(room => {
                        const active = room.groups.id === this.props.roomId ? 'active' : '';
                        return (
                            <li key={room.groups.id} className={"room " + active}>
                                <a
                                    onClick={() => this.props.subscribeToRoom(room, true)}
                                    href="#">
                                    # {room.groups.name }
                                </a>
                            </li>
                        )
                    })}
                </ul>
            </div>
        )
    }
}
export default GroupList;
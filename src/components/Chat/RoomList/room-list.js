import React from 'react';

class RoomList extends React.Component {
    render() {
        const orderedRooms = [...this.props.rooms].sort(((a,b) => a.id > b.id))

        return (
            <div className="rooms-list">
                <ul>
                <h3>People on the network</h3>
                <p>Click on New Room / Add User to Group to continue</p>
                    {orderedRooms.map(room => {
                        const active = room.id === this.props.roomId ? 'active' : '';
                        return (
                            <li key={room.id} className={"room " + active}>
                                <a
                                    href="#">
                                    # {room.username}
                                </a>
                            </li>
                        )
                    })}
                </ul>
            </div>
        )
    }
}

export default RoomList;
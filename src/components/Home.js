import React from 'react'
import Login from './Login.js'
import UserHome from './UserHome.js'

class Home extends React.Component {
    constructor(props) {
        super(props);
        this.state = {isLoggedIn: true}; 
    }

    render() {
        const isLoggedIn = this.state.isLoggedIn;
        return (
        <div className="homescreen">
            {isLoggedIn ? <UserHome/> : <Login/>}
        </div>
        );
    }
}

export default Home;

import React from 'react'

class Login extends React.Component {
    constructor(props) {
        super(props);
        this.state = {isLoggedIn: true}; 
    }

    render() {
        return (
        <div className="text_editor">
            <h1>Welcome to the Login Page</h1>
        </div>
        );
    }
}

export default Login;

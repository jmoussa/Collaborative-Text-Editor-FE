import React from 'react'

class Editor extends React.Component {
    constructor(props) {
        super(props);
        this.state = {isLoggedIn: true}; 
    }

    render() {
        return (
        <div className="text_editor">
            <h1>Welcome to the Editor</h1>
        </div>
        );
    }
}

export default Editor;

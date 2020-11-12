import React from 'react'
import {Editor, EditorState} from 'draft-js';
import 'draft-js/dist/Draft.css';
import { w3cwebsocket as W3CWebSocket } from "websocket";


class TextEditor extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      editorState: EditorState.createEmpty(), 
      username: "test_username",
      client: new W3CWebSocket('ws://127.0.0.1:8000/ws/' + "test_username")
    };
    this.onChange = editorState => {
      this.setState({editorState});
      this.send_to_websocket(editorState); 
    }
  }
  
  componentWillMount() {
    this.state.client.onopen = () => {
      console.log('WebSocket Client Connected');
    };
    this.state.client.onmessage = (message) => {
      const dataFromServer = JSON.parse(message.data);
      const stateToChange = {};
      stateToChange.editorState = dataFromServer.editorState
      this.setState({
        ...stateToChange
      }); 
    };
  }

  send_to_websocket(editorState) {
    text = editorState.getCurrentContent().getPlainText('\u0001');
    this.state.client.send(JSON.stringify({
      username: this.state.username,
      editorState: text
    })); 
  }

  render() {
    return (
      <div>
        <h1>Editor</h1>
        <Editor editorState={this.state.editorState} onChange={this.onChange} />
      </div>

    );
  }
}

export default TextEditor;

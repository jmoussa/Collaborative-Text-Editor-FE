import React from 'react'
import 'draft-js/dist/Draft.css'
import { w3cwebsocket as W3CWebSocket } from "websocket"
import TextEditor from '../components/TextEditor'


class EditorPage extends React.Component {
  render() {
    return (
      <div
        style={{
            border: '1px solid #ccc',
            cursor: 'text',
            minHeight: 80,
            padding: 10                    
        }}>
        <h1>Editor</h1>
        <TextEditor />
      </div>
    );
  }
}

export default EditorPage;

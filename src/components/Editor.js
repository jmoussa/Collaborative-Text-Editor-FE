import React from 'react'
import {Editor, EditorState, ContentState} from 'draft-js';
import 'draft-js/dist/Draft.css';
import { w3cwebsocket as W3CWebSocket } from "websocket";


const client = new W3CWebSocket('ws://127.0.0.1:8000/ws/test_username')

class TextEditor extends React.Component {

  constructor(props) {
    super(props);
    const contentState = props.text != null ? ContentState.createFromText(props.text) : ContentState.createFromText("");
    const editorState = EditorState.createWithContent(contentState);
    this.state = {
      ...props,
      "username": "test_username",
      editorState
    };
    this._onEditorChange = this._onEditorChange.bind(this);
    this._onWebsocketRecv = this._onWebsocketRecv.bind(this);
    this.send_to_websocket = this.send_to_websocket.bind(this); 
  }

  _onEditorChange(editorState, newText=null) {
    const content = editorState.getCurrentContent();
    if(newText==null){
      newText = content.getPlainText();
    }
    if(typeof newText === 'string' || newText instanceof String){
      this.setState({
          editorState,
          text: newText // update state with new text whenever editor changes
      }, () => this.send_to_websocket(newText));
    }
  }
  
  _onWebsocketRecv(editorState, newText=null) {
    const content = editorState.getCurrentContent();
    if(newText == null){
      console.log("New Text is null, getting from content")
      newText = content.getPlainText();
    }
    if(typeof newText === 'string' || newText instanceof String){
      this.componentRecievedNewText({"text": newText})
    }
  }

  componentDidMount() {
    client.onopen = () => {
      console.log('WebSocket Client Connected');
    };
    client.onmessage = (new_text) => {
      this._onWebsocketRecv(this.state.editorState, JSON.stringify(new_text.data, null, '\t'))
    };
    client.onerror = (err) => {
      console.log("ERROR: " + err)
    };
    client.onclose = () => {
      console.log("WebSocket Client Closed")
    };
  }

  componentRecievedNewText(nextProps) {
    const { editorState, text} = this.state;
    let nextText = String(nextProps.text);
    // check that text has changed before updating the editor
    if (String(text) !== String(nextText) && nextText.trim() !== "\"\"") {   
      console.log("Setting text as: " + nextText.slice(1,-1))
      let selectionState = editorState.getSelection(); 
      if((selectionState === null || selectionState === undefined) && selectionState.getHasFocus()){
        const newContentState = ContentState.createFromText(nextProps.text.slice(1,-1));            
        let newEditorState = EditorState.forceSelection({
                currentContent: newContentState,
                selection: selectionState
        });
        this.setState({
            ...nextProps,
            editorState: newEditorState
        });
      }
      
    }
  }

  send_to_websocket(text) {
    if(typeof text === 'string' || text instanceof String){
      console.log("Sending to websocket: " + text)
      client.send(JSON.stringify({
        "editorState": text
      }));
    }
  }

  render() {
    const { editorState } = this.state;
    return (
      <div
        style={{
            border: '1px solid #ccc',
            cursor: 'text',
            minHeight: 80,
            padding: 10                    
        }}>
        <h1>Editor</h1>
        <Editor editorState={editorState} onChange={this._onEditorChange} placeholder="Enter text" />
      </div>

    );
  }
}

export default TextEditor;

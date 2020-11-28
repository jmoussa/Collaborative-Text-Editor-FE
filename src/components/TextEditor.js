import React from 'react'
import {Editor, EditorState, ContentState} from 'draft-js';
import 'draft-js/dist/Draft.css';
import axios from 'axios';

class TextEditor extends React.Component {
  ws = new WebSocket('ws://127.0.0.1:8000/ws/test_username');
  timeout = 250;  
  
  constructor(props) {
    super(props);
    const contentState = ContentState.createFromText("");
    const emptyEditorState = EditorState.createWithContent(contentState);
    this.state = {
      ...props,
      "username": "test_username",
      editorState: emptyEditorState 
    };
    this._onEditorChange = this._onEditorChange.bind(this);
    this.onWebsocketRecv = this.onWebsocketRecv.bind(this);
    this.sendToWebsocket = this.sendToWebsocket.bind(this); 
  }

  componentDidMount() {
    console.log(`Inside ${this.state.username}`)
    axios.get(`http://127.0.0.1:8000/document/${this.state.username}`)
      .then(res => {
        const content = res.data;
        console.log(content);
        const initialContentState = ContentState.createFromText(content);
        const editorState = EditorState.createWithContent(initialContentState);
        this.setState({editorState})
      });
    this.connect();
  }

  connect = () => {
    let that = this; // cache the this
    var connectInterval;
    this.ws.onopen = () => {
      console.log('WebSocket Connected');
      that.timeout = 250; // reset timer to 250 on open of websocket connection 
      clearTimeout(connectInterval); // clear Interval on on open of websocket connection  
    };
    this.ws.onmessage = (new_text) => {
      this.onWebsocketRecv(JSON.stringify(new_text.data))
    };
    this.ws.onerror = (err) => {
      console.error(
          "Socket encountered error: ",
          err.message,
          "Closing socket"
      );

      this.ws.close(); 
    };
    this.ws.onclose = (e) => {
      console.log("WebSocket Closed")
      console.log(
          `Socket is closed. Reconnect will be attempted in ${Math.min(
              10000 / 1000,
              (that.timeout + that.timeout) / 1000
          )} second.`,
          e.reason
      );

      that.timeout = that.timeout + that.timeout;
      connectInterval = setTimeout(this.check, Math.min(10000, that.timeout));
    };
  }
  
  check = () => {
    if (!this.ws || this.ws.readyState == WebSocket.CLOSED) this.connect(); 
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
      }, () => this.sendToWebsocket(newText));
    }
  }
 
  sendToWebsocket(text) {
         
    if(typeof text === 'string' || text instanceof String){
      console.log("Sending to websocket: " + text)
      this.ws.send(JSON.stringify({
        "editorState": text
      }));
    }
  } 
  
  onWebsocketRecv(newText=null) {
    const content = this.state.editorState.getCurrentContent();
    if(newText === null || newText === undefined){
      console.log("New Text is null, getting from content")
      newText = content.getPlainText();
    }
    if(typeof newText === 'string' || newText instanceof String){
      this.componentRecievedNewText({"text": newText})
    }
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
        <Editor editorState={editorState} onChange={this._onEditorChange} />
      </div>
    );
  }
}

export default TextEditor;
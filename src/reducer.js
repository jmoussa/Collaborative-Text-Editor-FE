function reducer(state, action) {
    if (action.type === "MESSAGE_SEND")
        return {
            ...state,
            editorState: action.payload.editorState,
        }
}
import React, { Component } from "react";
import { EditorState, Editor, ContentState, convertFromRaw } from "draft-js";

class DraftNote2 extends Component {
  constructor(props) {
    super(props);
    this.state = {
      editorState: EditorState.createEmpty(), // <-------------------- Esto solo se llama @ mount
      contentState: ContentState.create,
    };
  }

  onChange = (editorState) => {
    this.setState({
      editorState,
    });
  };

  componentDidUpdate(prevProps, prevState, snapshot) {
    if (this.props.note.id !== prevProps.note.id) {
      console.log("child received new note id: ", this.props.note.id);
      if (this.props.note.raw_json) {
        console.log(convertFromRaw(this.props.note.raw_json));
      }
      //   this.setState({
      //       editorState: EditorState.createWithContent(convertFromRaw(this.props.note.raw_json)),
      //   })
    }
  }

  render() {
    return (
      <div>
        <Editor
          style={styles2.actualEditor}
          placeholder="some text"
          editorState={this.state.editorState}
          onChange={this.onChange}
        />
      </div>
    );
  }
}

export default DraftNote2;

const styles2 = {
  actualEditor: {
    border: "1px solid #ccc",
    cursor: "text",
    minHeight: 80,
    padding: 10,
    width: "90%",
    // display: "block",
    marginLeft: "auto",
    marginRight: "auto",
  },
};

// 1. how to make it ReadOnly: https://stackoverflow.com/questions/37010687/how-can-i-make-custom-rendered-block-readonly-in-draft-js-editor-when-its-readon
//     and https://github.com/facebook/draft-js/issues/467
// 2. how to highlight text: https://dev.to/rose/draft-js-introduction-custom-styles-highlighted-text-and-have-formatting-buttons-show-whether-they-are-on-or-off-4f9p

import React, { Component } from "react";
import "draft-js/dist/Draft.css";
import debounce from "lodash/debounce";
import { supabase } from "../lib/supabaseClient";

import {
  Editor,
  EditorState,
  //   ContentState,
  //   RichUtils,
  convertToRaw,
  convertFromRaw,
  //   Modifier,
} from "draft-js";

export default class QEditor extends Component {
  constructor(props) {
    /**
     * FETCH IS DONE IN PARENT: props should hold json of entire query response (including title + rawjson)
     */
    super(props);
    const note = this.props.note;
    const editorState = this.createContent(note);
    this.state = { editorState: editorState };
    
    // this.domEditor = React.createRef();
    // this.handleKeyCommand = this.handleKeyCommand.bind(this); // needed for handling bold, etc
  }

  saveContent = debounce(async (content) => {
    const edit_time = new Date().toISOString();
    await supabase
      .from("notes")
      .update({
        raw_json: JSON.stringify(convertToRaw(content)),
        last_edit_time: edit_time,
        note: convertToRaw(content).blocks[0].text,
      })
      .match({ id: this.props.note.id });
    console.log("saved note contents");
  }, 1000);

  onChange = (editorState) => {
    const contentState = editorState.getCurrentContent();
    this.saveContent(contentState);
    this.setState({ editorState });
  };

  //   componentDidUpdate(prevProps, prevState, snapshot) {}

  createContent(note) {
    // Should be unable to reach here with an empty note
    if (!note.raw_json) {
      console.log("Should be unable to reach here with an empty note");
    }
    this.title = note.title;
    const contentState = convertFromRaw(JSON.parse(note.raw_json));
    const editorState = EditorState.createWithContent(contentState);
    return EditorState.moveSelectionToEnd(editorState);
  }

  render() {
    return (
      <div style={styles3.noteEditor}>
        <div>
          <form>
            <input
              style={styles3.notetitle}
              type="text"
              disabled="disabled"
              placeholder={this.title}
            />
          </form>
        </div>
        <div>
          {/* Buttons for highlighting would go here... */}
          <div style={styles3.actualEditor}>
            <Editor
              editorState={this.state.editorState}
              //   handleKeyCommand={this.handleKeyCommand}
              onChange={this.onChange}
              placeholder="Enter some text..."
              keyBindingFn={() => "not-handled-command"}
            />
          </div>
        </div>
      </div>
    );
  }
}

const styles3 = {
  noteEditor: {
    zIndex: 900,
    fontFamily: "'Helvetica', sans-serif",
    paddingRight: 20,
    paddingLeft: 20,
  },
  actualEditor: {
    border: "4px solid darkgray",
    cursor: "text",
    height: "70vh",
    padding: 10,
    marginLeft: "auto",
    marginRight: "auto",
    backgroundColor: "whitesmoke",
    overflowY: "auto",
  },
  buttonBar: {
    height: "45px",
    display: "flex",
    flexDirection: "row",
    justifyContent: "center",
    marginLeft: "auto",
    marginRight: "auto",
  },
  button: {
    marginTop: 10,
    width: "20%",
    textAlign: "center",
  },
  notetitle: {
    border: "none",
    display: "inline",
    fontFamily: "inherit",
    fontSize: "30px",
    fontWeight: "bold",
    padding: "none",
    marginBottom: "15px",
    background: "none",
    color: "black",
  },
};

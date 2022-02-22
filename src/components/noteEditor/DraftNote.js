// Note using Draft.js instead of quill
// source: https://reactrocket.com/post/draft-js-persisting-content/
//
// PENDING: - FIX EDITOR WIDTH SO THAT IT DOESNT CHANGE DEPENDING ON CONTENT.

import React, { Component } from "react";
import "draft-js/dist/Draft.css";
import debounce from "lodash/debounce";
import { supabase } from "../../lib/supabaseClient";

import {
  Editor,
  EditorState,
  ContentState,
  RichUtils,
  convertToRaw,
  convertFromRaw,
  // Modifier,
} from "draft-js";

class MyEditor extends Component {
  constructor(props) {
    /**
     * FETCH IS DONE IN PARENT: props should hold json of entire query response (including title + rawjson)
     */
    super(props);
    const note = this.props.note;
    const editorState = this.createContent(note);
    this.state = { editorState: editorState };
    // this.domEditor = React.createRef();
    this.handleKeyCommand = this.handleKeyCommand.bind(this); // needed for handling bold, etc
  }

  saveTitle = debounce(async (title) => {
    // console.log("savingTitle: ", title);
    const edit_time = new Date().toISOString();
    await supabase
      .from("notes")
      .update({
        last_edit_time: edit_time,
        title: title,
      })
      .match({ id: this.props.note.id });
    this.props.updatecallback();
  }, 1000);

  saveContent = debounce(async (content) => {
    const edit_time = new Date().toISOString();
    await supabase
      .from("notes")
      .update({
        raw_json: JSON.stringify(convertToRaw(content)),
        last_edit_time: edit_time,
        note: convertToRaw(content).blocks[0].text.substring(0, 50),
      })
      .match({ id: this.props.note.id });
    console.log("saved note contents");
    this.props.updatecallback();
  }, 1000);

  onTitleChange = (title) => {
    console.log("inside ontitle change, value:", title.target.value);
    this.saveTitle(title.target.value);
  };

  createContent(note) {
    if (!note) {
      const defaultContent = ContentState.createFromText(
        "first you must add a note on the left side panel"
      );
      return EditorState.createWithContent(defaultContent);
    }
    if (!note.id) {
      const defaultContent = ContentState.createFromText(
        "first you must select a note on the left side panel"
      );
      return EditorState.createWithContent(defaultContent);
    }
    // console.log("right before convertfromraw in create content");
    // console.log("note", note.raw_json);
    if (note.raw_json) {
      this.title = note.title;
      const contentState = convertFromRaw(JSON.parse(note.raw_json));
      const editorState = EditorState.createWithContent(contentState);
      return EditorState.moveSelectionToEnd(editorState);
    }
    this.title = note.title;
    const defaultContent = ContentState.createFromText("note is empty");
    // change placeholder to "Start typing..."
    return EditorState.createWithContent(defaultContent);
  }

  onChange = (editorState) => {
    const contentState = editorState.getCurrentContent();
    this.saveContent(contentState);
    this.setState({ editorState });
  };

  componentDidUpdate(prevProps, prevState, snapshot) {
    if (this.props.note.id !== prevProps.note.id) {
      // console.log("child received new note id: ", this.props.note.id);
      if (this.props.note.raw_json) {
        console.log(convertFromRaw(this.props.note.raw_json));
      }
    }
  }

  // componentDidMount() {}

  handleKeyCommand(command, editorState) {
    const newState = RichUtils.handleKeyCommand(editorState, command);

    if (newState) {
      this.onChange(newState);
      return "handled";
    }

    return "not-handled";
  }

  _onBoldClick() {
    this.onChange(RichUtils.toggleInlineStyle(this.state.editorState, "BOLD"));
  }

  _onItalicClick() {
    this.onChange(
      RichUtils.toggleInlineStyle(this.state.editorState, "ITALIC")
    );
  }

  _onUnderlineClick = () => {
    this.onChange(
      RichUtils.toggleInlineStyle(this.state.editorState, "UNDERLINE")
    );
  };

  _onToggleCode = () => {
    this.onChange(RichUtils.toggleCode(this.state.editorState));
  };

  buttonHover = (event) => {
    event.target.style.backgroundColor = "#abc6fd";
    event.target.style.transitionDuration = "0.2s";
    // event.target.style.backgroundColor = "#ebebeb";
  };

  stopButtonHover = (event) => {
    event.target.style.backgroundColor = "";
    // event.target.style.backgroundColor = "";
  };

  render() {
    return (
      <div style={styles2.noteEditor}>
        <div>
          <form>
            <input
              style={styles2.notetitle}
              type="text"
              onChange={this.onTitleChange}
              placeholder={this.title}
            />
          </form>
        </div>
        <div>
          <div style={styles2.buttonBar}>
            <button
              style={styles2.button}
              onClick={this._onBoldClick.bind(this)}
              onMouseEnter={this.buttonHover}
              onMouseLeave={this.stopButtonHover}
            >
              Bold
            </button>
            <button
              style={styles2.button}
              onClick={this._onItalicClick.bind(this)}
              onMouseEnter={this.buttonHover}
              onMouseLeave={this.stopButtonHover}
            >
              Italic
            </button>
            <button
              style={styles2.button}
              onClick={this._onUnderlineClick.bind(this)}
              onMouseEnter={this.buttonHover}
              onMouseLeave={this.stopButtonHover}
            >
              Underline
            </button>
            {/* <button onClick={this._onToggleCode.bind(this)}>Code block</button> */}
          </div>
          <div style={styles2.actualEditor}>
            <Editor
              editorState={this.state.editorState}
              handleKeyCommand={this.handleKeyCommand}
              onChange={this.onChange}
              placeholder="Enter some text..."
            />
          </div>
        </div>
      </div>
    );
  }
}

const styles2 = {
  noteEditor: {
    zIndex: 900,
    fontFamily: "'Helvetica', sans-serif",
    padding: 20,
    // borderStyle: "solid",
    // borderWidth: "5px",
    // borderColor: "red",
    flexGrow: 1,
  },
  actualEditor: {
    // border: "3px solid #eee",
    border: "4px solid #fafafa",
    cursor: "text",
    height: "65vh",
    padding: 10,
    width: "90%",
    // maxWidth: "90%",
    // display: "block",
    marginLeft: "auto",
    marginRight: "auto",
    overflowY: "auto",
  },
  buttonBar: {
    // paddingLeft: 10,
    height: "45px",
    width: "90%",
    display: "flex",
    flexDirection: "row",
    justifyContent: "center",
    marginLeft: "auto",
    marginRight: "auto",
  },
  editorContainer: {
    display: "flex",
    flexDirection: "column",
  },
  button: {
    height: "30px",
    width: "100px",
    marginRight: "10px",
    fontSize: "15px",
    padding: "0px",
    position: "relative",
    borderRadius: "8px",
    backgroundColor: "", 
    color: "black", 
    border: "1px solid #abc6fd",
    cursor: "pointer", 
  },
  notetitle: {
    border: "none",
    display: "inline",
    fontFamily: "inherit",
    fontSize: "30px",
    fontWeight: "bold",
    padding: "none",
    width: "100%",
    marginBottom: "15px",
  },
};

export default MyEditor;
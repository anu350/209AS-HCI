// Note using Draft.js instead of quill
// source: https://reactrocket.com/post/draft-js-persisting-content/

// MISSING: method to update text editor if user wants to edit a different note
// use redux to focus on note to edit

import React, { Component } from "react";
import "draft-js/dist/Draft.css";
import debounce from "lodash/debounce";
import { supabase } from "../lib/supabaseClient";

import {
  Editor,
  EditorState,
  RichUtils,
  convertToRaw,
  convertFromRaw,
} from "draft-js";

class MyEditor extends Component {
  constructor(props) {
    super(props);
    // this.myRef = React.createRef();
    this.id = props.id;
    this.state = {};
    this.handleKeyCommand = this.handleKeyCommand.bind(this); // needed for handling bold, etc

    // unnecessary when using a DB: ------------------------------------------------------------
    const content = window.localStorage.getItem("content");
    if (content) {
      this.state.editorState = EditorState.createWithContent(
        convertFromRaw(JSON.parse(content))
      );
    } else {
      this.state.editorState = EditorState.createEmpty();
    }
    // end unnecessary ------------------------------------------------------------------------
  }

  // debounce enables periodic auto saving
  saveContent = debounce(async (content) => {
    // console.log("saving note :)");
    const edit_time = new Date().toISOString();
    await supabase
      .from("notes")
      .update({
        raw_json: JSON.stringify(convertToRaw(content)),
        last_edit_time: edit_time,
      })
      .match({ id: this.id });
  }, 1000); // this is the period in ms

  onChange = (editorState) => {
    const contentState = editorState.getCurrentContent();
    this.saveContent(contentState);
    this.setState({ editorState });
  };

  componentDidMount() {
    // --------------------------------- This fetches from DB at load and loads it in noteeditor
    this.fetchTop().then((rawContent) => {
      if (rawContent.raw_json) {
        // console.log("componentfifmount if:true", rawContent);
        this.id = rawContent.id;
        this.title = rawContent.title;
        this.setState({
          editorState: EditorState.createWithContent(
            convertFromRaw(JSON.parse(rawContent.raw_json))
          ),
        });
      } else {
        // console.log("componentfifmount if:false", rawContent);
        this.setState({ editorState: EditorState.createEmpty() });
      }
    });
  }

  fetchTop = async () => {
    let { data, error } = await supabase
      .from("notes")
      .select("id, title, raw_json")
      .order("last_edit_time", { ascending: false })
      .limit(1)
      .single();
    // console.log("fetchsingle", data);
    if (error) {
      console.log("error fetchTop", error);
    }
    return data;
  };

  fetchById = async (id) => {
    let { data, error } = await supabase
      .from("notes")
      .select("note, title")
      .match({ id: id });
    // console.log("fetchById", data);
    if (error) {
      console.log("error fetchingbyID", error);
    }
    return data;
  };

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

  render() {
    return (
      <div style={styles2.noteEditor}>
        <div>
          <h2>{this.title}</h2>
        </div>
        <div>
          <button onClick={this._onBoldClick.bind(this)}>Bold</button>
          <button onClick={this._onItalicClick.bind(this)}>Italic</button>
          <button onClick={this._onUnderlineClick.bind(this)}>Underline</button>
          {/* <button onClick={this._onToggleCode.bind(this)}>Code block</button> */}
        </div>
        <div style={styles2.editor}>
          <Editor
            editorState={this.state.editorState}
            handleKeyCommand={this.handleKeyCommand}
            onChange={this.onChange}
            placeholder="Enter some text..."
          />
        </div>
      </div>
    );
  }
}

const styles2 = {
  noteEditor: {
    fontFamily: "'Helvetica', sans-serif",
    padding: 20,
    width: "70%",
    borderStyle: "solid",
    borderWidth: "5px",
    borderColor: "red",
  },
  editor: {
    border: "1px solid #ccc",
    cursor: "text",
    minHeight: 80,
    padding: 10,
    width: "100%",
  },
  button: {
    marginTop: 10,
    textAlign: "center",
  },
  notetitle: {
    border: "none",
    display: "inline",
    fontFamily: "inherit",
    fontSize: "inherit",
    padding: "none",
    width: "auto",
  },
};

export default MyEditor;

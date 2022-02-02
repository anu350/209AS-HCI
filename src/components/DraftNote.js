// Note using Draft.js instead of quill
// source: https://reactrocket.com/post/draft-js-persisting-content/

// MISSING: method to update text editor if user wants to edit a different note

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

  saveText = () => {
    this.add_note(this.currentText);
    alert("Saved!");
  };

  // USED FOR UPDATING EXISTING NOTE
  save_note = async (input) => {
    const creation_time = new Date().toISOString();
    await supabase
      .from("notes")
      .update([{ note: input, edited_at: creation_time }])
      .match({ id: "e4c587cf-080d-4fec-aa67-3aa6af9541a3" });
  };

  // USE THIS TO SAVE CONTENT --> ****** TODO: ****** TIMESTAMP+SAVE TO DATABASE
  saveContent = debounce((content) => {
    window.localStorage.setItem(
      "content",
      JSON.stringify(convertToRaw(content))
    );

    //     fetch("/content", {
    //       method: "POST",
    //       body: JSON.stringify({
    //         content: convertToRaw(content),
    //       }),
    //       headers: new Headers({
    //         "Content-Type": "application/json",
    //       }),
    //     });
    //   }, 1000);
  });

  onChange = (editorState) => {
    const contentState = editorState.getCurrentContent();
    console.log("content state", convertToRaw(contentState));
    this.save_note(contentState);
    this.saveContent(contentState);
    this.setState({ editorState });
  };

  componentDidMount() {
    // --------------------------------- USE THIS to fetch content from DB at load
    this.fetchSingle();
    // if (data) {
    // this.setState({
    //   // editorState: EditorState.createWithContent(convertFromRaw(rawContent)),
    //   editorState: EditorState.createEmpty(),
    // });
    // } else {
    // this.setState({ editorState: EditorState.createEmpty() });
    // }
  }

  fetchSingle = async () => {
    let { data, error } = await supabase
      .from("notes")
      .select("note, title")
      .order("last_edit_time", { ascending: false })
      .limit(1)
      .single();
    console.log(data);
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
          <h2>Note Title</h2>
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
        {/* <button onClick={this.saveContent}>Save</button> */}
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
};

export default MyEditor;

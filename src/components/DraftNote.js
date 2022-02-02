// Note using Draft.js instead of quill
// source: https://reactrocket.com/post/draft-js-persisting-content/

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
    this.id = props.id;
    console.log("inside draftnote constructor, this.id: ", this.id);
    this.state = {};
    this.handleKeyCommand = this.handleKeyCommand.bind(this); // needed for handling bold, etc

    // Should make this query DB instead of local: ------------------------------------------------------------
    const content = window.localStorage.getItem("content");
    if (content) {
      this.state.editorState = EditorState.createEmpty();
      // this.state.editorState = EditorState.createWithContent(
      //   convertFromRaw(JSON.parse(content))
      // );
    } else {
      this.state.editorState = EditorState.createEmpty();
    }
    // end unnecessary ------------------------------------------------------------------------
  }

  // debounce enables periodic auto saving
  saveContent = debounce(async (content) => {
    // console.log("saving note :^)");
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
    console.log("just got into componentdidmount. this.id", this.id);
    if (this.id) {
      this.fetchById(this.id).then((rawContent) => {
        try {
          // this.id = rawContent.id;
          console.log("CDM infetchbyid, rawContent: ", rawContent);
          console.log("CDM infetchbyid, rawContent.title: ", rawContent.title);
          this.title = rawContent.title;
          if (rawContent.raw_json) {
            this.setState({
              editorState: EditorState.createWithContent(
                convertFromRaw(JSON.parse(rawContent.raw_json))
              ),
            });
          } else {
            // console.log("componentfifmount if:false", rawContent);
            this.setState({ editorState: EditorState.createEmpty() });
          }
        } catch (error) {
          console.error("error in componentdidmount+fetchbyid", error);
        }
      });
    }
    this.fetchTop().then((rawContent) => {
      try {
        this.id = rawContent.id;
        this.title = rawContent.title;
        if (rawContent.raw_json) {
          this.setState({
            editorState: EditorState.createWithContent(
              convertFromRaw(JSON.parse(rawContent.raw_json))
            ),
          });
        } else {
          // console.log("componentfifmount if:false", rawContent);
          this.setState({ editorState: EditorState.createEmpty() });
        }
      } catch (error) {
        console.error("error in componentdidmount", error);
      }
    });
  }

  focusNote(id) {
    this.fetchById(id).then((rawContent) => {
      try {
        this.id = rawContent.id;
        this.title = rawContent.title;
        if (rawContent.raw_json) {
          this.setState({
            editorState: EditorState.createWithContent(
              convertFromRaw(JSON.parse(rawContent.raw_json))
            ),
          });
        } else {
          this.setState({ editorState: EditorState.createEmpty() });
        }
      } catch (error) {
        console.error("error in focusNote", error);
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
      .select("title, raw_json")
      .match({ id: id })
      .limit(1)
      .single();
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
          {/* <h2>{this.title ? this.title : "Untitled Note"}</h2> */}
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

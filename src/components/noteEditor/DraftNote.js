// Missing: on load - setstate with props for last edit time and wordcount

import React, { Component } from "react";
// import "draft-js/dist/Draft.css";
import debounce from "lodash/debounce";
import { supabase } from "../../lib/supabaseClient";
import "./DraftNote.css";

import {
  Editor,
  EditorState,
  ContentState,
  RichUtils,
  convertToRaw,
  convertFromRaw,
  // Modifier,
} from "draft-js";

// try this function to get "Last saved x seconds ago..."
function timeSince(date) {
  var seconds = Math.floor((new Date() - date) / 1000);

  var interval = seconds / 31536000;

  if (interval > 1) {
    return Math.floor(interval) + " years";
  }
  interval = seconds / 2592000;
  if (interval > 1) {
    return Math.floor(interval) + " months";
  }
  interval = seconds / 86400;
  if (interval > 1) {
    return Math.floor(interval) + " days";
  }
  interval = seconds / 3600;
  if (interval > 1) {
    return Math.floor(interval) + " hours";
  }
  interval = seconds / 60;
  if (interval > 1) {
    return Math.floor(interval) + " minutes";
  }
  return Math.floor(seconds) + " seconds";
}

class MyEditor extends Component {
  constructor(props) {
    /**
     * FETCH IS DONE IN PARENT: props should hold json of entire query response (including title + rawjson)
     */
    super(props);
    const note = this.props.note;
    const wordcount = this.props.wordcount;
    const editorState = this.createContent(note);
    // this.wordcount = props.wordcount;
    this.state = {
      editorState: editorState,
      wordcount: wordcount,
      lastsave: "",
    };
    this.handleKeyCommand = this.handleKeyCommand.bind(this); // needed for handling bold, etc
  }

  saveTitle = debounce(async (title) => {
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

  saveContent = debounce(async (content, wordcount) => {
    const edit_time = new Date().toISOString();
    await supabase
      .from("notes")
      .update({
        raw_json: JSON.stringify(convertToRaw(content)),
        last_edit_time: edit_time,
        note: convertToRaw(content).blocks[0].text.substring(0, 50),
        wordcount: wordcount,
      })
      .match({ id: this.props.note.id });
    console.log("saved note contents");
    this.props.updatecallback();
    this.setState({ lastsave: edit_time });
  }, 1000);

  onTitleChange = (title) => {
    console.log("inside ontitle change, value:", title.target.value);
    this.saveTitle(title.target.value);
  };

  getWordCount(content) {
    const plainText = content.getPlainText("");
    const regex = /(?:\r\n|\r|\n)/g; // new line, carriage return, line feed
    const cleanString = plainText.replace(regex, " ").trim(); // replace above characters w/ space
    const wordArray = cleanString.match(/\S+/g); // matches words according to whitespace
    return wordArray ? wordArray.length : 0;
  }

  createContent(note) {
    if (!note) {
      const defaultContent = ContentState.createFromText(
        "Select a note or create a new one."
      );
      return EditorState.createWithContent(defaultContent);
    }
    if (!note.id) {
      const defaultContent = ContentState.createFromText(
        "Select a note or create a new one."
      );
      return EditorState.createWithContent(defaultContent);
    }
    if (note.raw_json) {
      this.title = note.title;
      const contentState = convertFromRaw(JSON.parse(note.raw_json));
      const editorState = EditorState.createWithContent(contentState);
      return EditorState.moveSelectionToEnd(editorState);
    }
    this.title = note.title;
    const defaultContent = ContentState.createFromText(
      "A soon to be masterpiece..."
    );
    // change placeholder to "Start typing..."
    return EditorState.createWithContent(defaultContent);
  }

  onChange = (editorState) => {
    const contentState = editorState.getCurrentContent();
    this.setState({ wordcount: this.getWordCount(contentState) });
    this.saveContent(contentState, this.state.wordcount);
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
      <div className="editor-container">
        <div className="editor-header">
          <input
            className="editor-title"
            type="text"
            onChange={this.onTitleChange}
            placeholder={this.title}
          />
          <div className="note-info">
            <p>Word Count: {this.state.wordcount}</p>
            {/* <p>Last Edited:{timeSince(this.state.lastsave)}</p> */}
            <div className="button-bar">
              <button className="bold" onClick={this._onBoldClick.bind(this)}>
                B
              </button>
              <button
                className="italic"
                onClick={this._onItalicClick.bind(this)}
              >
                <i>I</i>
              </button>
              <button
                className="underline"
                onClick={this._onUnderlineClick.bind(this)}
              >
                <u>U</u>
              </button>
              {/* <button onClick={this._onToggleCode.bind(this)}>Code block</button> */}
            </div>
          </div>
        </div>
        <div className="draft-editor-area">
          <div className="actual-editor">
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

export default MyEditor;

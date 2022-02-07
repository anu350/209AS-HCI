// Note using Draft.js instead of quill
// source: https://reactrocket.com/post/draft-js-persisting-content/

import React, { useRef, useEffect, Component } from "react";
import "draft-js/dist/Draft.css";
import debounce from "lodash/debounce";
import { supabase } from "../lib/supabaseClient";

import {
  Editor,
  EditorState,
  ContentState,
  RichUtils,
  convertToRaw,
  convertFromRaw,
  Modifier,
} from "draft-js";

const EditableElement = (props) => {
  const { onChange } = props;
  const element = useRef();
  let elements = React.Children.toArray(props.children);
  if (elements.length > 1) {
    throw Error("Can't have more than one child");
  }
  const onMouseUp = () => {
    const value = element.current?.value || element.current?.innerText;
    onChange(value);
  };
  useEffect(() => {
    const value = element.current?.value || element.current?.innerText;
    onChange(value);
  });
  elements = React.cloneElement(elements[0], {
    contentEditable: true,
    suppressContentEditableWarning: true,
    ref: element,
    onKeyUp: onMouseUp,
  });
  return elements;
};
class MyEditor extends Component {
  constructor(props) {
    /**
     * FETCH IS DONE IN PARENT: props should hold json of entire query response (including title + rawjson)
     */
    super(props);
    // this.state = {};
    const note = this.props.note;

    const editorState = this.createContent(note);
    this.state = { editorState: editorState };

    this.domEditor = React.createRef();

    this.handleKeyCommand = this.handleKeyCommand.bind(this); // needed for handling bold, etc
  }

  saveTitle = debounce(async (title) => {
    // -------------------------- BUG: only edit_time if values have changed
    console.log("savingTitle contetn :", title);

    const edit_time = new Date().toISOString();
    await supabase
      .from("notes")
      .update({
        last_edit_time: edit_time,
        title: title,
      })
      .match({ id: this.props.note.id });
  }, 1000); // this is the period in ms

  // debounce enables periodic auto saving -------------------------- BUG: only edit_time if values have changed
  saveContent = debounce(async (content) => {
    // console.log("savecontent", content);
    // console.log("this.props.note.id", this.props.note.id);
    const edit_time = new Date().toISOString();
    await supabase
      .from("notes")
      .update({
        raw_json: JSON.stringify(convertToRaw(content)),
        last_edit_time: edit_time,
        note: convertToRaw(content).blocks[0].text,
      })
      .match({ id: this.props.note.id });
    console.log("saved note :^)");
  }, 1000); // this is the period in ms

  onTitleChange = (title) => {
    // console.log("inside ontitle change, value:", title);
    this.saveTitle(title);
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
    console.log("right before convertfromraw in create content");
    console.log("note", note.raw_json);
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
      console.log("child received new note id: ", this.props.note.id);
      if (this.props.note.raw_json) {
        console.log(convertFromRaw(this.props.note.raw_json));
      }
      //   this.setState({
      //       editorState: EditorState.createWithContent(convertFromRaw(this.props.note.raw_json)),
      //   })
    }
  }

  // componentDidMount() {}

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
          <EditableElement onChange={this.onTitleChange}>
            <h2 contentEditable="true">{this.title}</h2>
          </EditableElement>
        </div>
        <div>
          <div style={styles2.buttonBar}>
            <button
              style={styles2.button}
              onClick={this._onBoldClick.bind(this)}
            >
              Bold
            </button>
            <button
              style={styles2.button}
              onClick={this._onItalicClick.bind(this)}
            >
              Italic
            </button>
            <button
              style={styles2.button}
              onClick={this._onUnderlineClick.bind(this)}
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
    // display: "block",
    marginLeft: "auto",
    marginRight: "auto",
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
    marginTop: 10,
    width: "20%",
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

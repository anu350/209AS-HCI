import React, { Component } from "react";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";
import "react-quill/dist/quill.bubble.css";

class MinimalTextEditor extends Component {
  constructor(props) {
    super(props);

    this.modules = {
      toolbar: [
        [{ size: ["small", false, "large", "huge"] }],
        ["bold", "italic", "underline"],
        [{ list: "bullet" }],
      ],
    };

    this.formats = ["size", "bold", "italic", "underline", "bullet"];

    this.state = {
      comments: "",
    };

    this.rteChange = this.rteChange.bind(this);
  }

  rteChange = (content, delta, source, editor) => {
    console.log(editor.getHTML()); // rich text
    console.log(editor.getText()); // plain text
    console.log(editor.getLength()); // number of characters
  };

  render() {
    return (
      <div>
        <ReactQuill
          theme="snow"
          modules={this.modules}
          formats={this.formats}
          onChange={this.rteChange}
          value={this.state.comments || ""}
        />
      </div>
    );
  }
}

export default MinimalTextEditor;

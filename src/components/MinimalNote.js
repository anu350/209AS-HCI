import React, { Component } from "react";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";
import "react-quill/dist/quill.bubble.css";
import { supabase } from "../lib/supabaseClient";

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
    this.placeholder = "placeholder text";
    this.state = {
      comments: "",
    };
    this.rteChange = this.rteChange.bind(this);
    this.currentText = "";
  }

  rteChange = (content, delta, source, editor) => {
    //console.log(editor.getHTML()); // rich text
    //console.log(editor.getText()); // plain text
    //console.log(editor.getLength()); // number of characters
    this.currentText = editor.getText();
  };

  saveText = () => {
    this.add_note(this.currentText);
    alert("Saved!");
  };

  add_note = async (input) => {
    await supabase.from("notes").insert([{ note: input }]);
  };

  delete_note = async () => {
    await supabase.from("notes").delete().match({ id: 1 });
  };

  fetch_note = async () => {
    await supabase.from("notes").select("note").then(console.log);
  };

  render() {
    return (
      <div>
        <ReactQuill
          theme="bubble"
          modules={this.modules}
          formats={this.formats}
          onChange={this.rteChange}
          value={this.state.comments || ""}
          placeholder={this.placeholder}
          style={{}}
        />
        <button onClick={this.saveText}>Save</button>
      </div>
    );
  }
}

export default MinimalTextEditor;

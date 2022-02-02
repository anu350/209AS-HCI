import React, { Component } from "react";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";
import "react-quill/dist/quill.bubble.css";
import { createClient } from '@supabase/supabase-js';
import "./MinimalNote.css";
import "reactjs-popup/dist/index.css";

var count = 0;   

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
    this.dict = {"":""}      //{title: note}
    this.noteData = [""];    //contains fetched notes
    this.titleData = [""];   //contains fetched titles
    this.displayData = [""]; //contains html for displaying titles in sideNav
  
    this.formats = ["size", "bold", "italic", "underline", "bullet"];
    this.state = {
      comments: "",
      title:"",
      showdata : this.displayData,
      postVal : "",
      nData : this.noteData,
      tData : this.titleData,
      dData : this.dict,
      clickedNote : ""
    };

    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.appendData = this.appendData.bind(this);
    this.handleClickedN = this.handleClickedN.bind(this);
  
    this.rteChange = this.rteChange.bind(this);
    this.currentText = "";

    this.supabaseUrl = process.env.REACT_APP_SUPABASE_URL
    this.supabaseAnonKey = process.env.REACT_APP_SUPABASE_ANON_KEY
    this.supabase = createClient(this.supabaseUrl, this.supabaseAnonKey)
  }
  
  /*------Side Navigator Stuff-----*/
  handleChange(event) {
    this.setState({title: event.target.value, postVal: event.target.value});
  }

  handleSubmit(event) {
      this.createFreshNote(" ", this.state.title);
      event.preventDefault();
      alert('New note with title ' + this.state.title + ' has been created!');
      document.getElementById("formPopup").style.display = "none";
  }

  handleClickedN = (title, evt) => {
    //Once the button is clicked, get the previous notes that were stored in that title
    this.fetch_all_notes().then((data) => { 
      console.log(data)
      var x;
      for (x = 0; x < data.length; x++)
      {
        if (data[x] != null)
        {
          this.dict[data[x].noteTitle] = data[x].note;
        } 
      }
      this.setState({
        dData: this.dict
      });
    })

    evt.preventDefault();
    this.clickedNote = title;                             //string of what was clicked
    alert("You have selected to edit note: " + title);    //Contains the title 
    this.setState({comments: this.state.dData[title] });  //Contains notes pertaining to that title
  }
  
  //--Form for entering title of new note--//
  openForm() {
      document.getElementById("formPopup").style.display = "block";
  }
  closeForm() {
      document.getElementById("formPopup").style.display = "none";
      this.appendData();
  }

  //-- Fetching Data from New Form and Creating Side Nav Buttons --//
  appendData() {

    //1) ISSUE-- database not updated until next cycle, so prev version grabbed (button not displayed until next button is pushed through)
    this.fetch_all_notes().then((data) => { 
      console.log(data)

      var x, buttonTitle;
      for (x = 0; x < 11; x++)
      {
        if (data[x] != null)
        {
          this.noteData[x] = data[x].note;              //not really important here since we only need dictionary and potentially title data
          this.titleData[x] = data[x].noteTitle;
          this.dict[data[x].noteTitle] = data[x].note;
        } 
      }
      
      buttonTitle = data[count].noteTitle;
      this.displayData.splice(count, 0, <button id="display-data" className={buttonTitle} key={count} onClick={(evt) => this.handleClickedN(buttonTitle, evt)}><pre>{buttonTitle}</pre></button>);
      count = count + 1;  

        //Update the states using the data fetched
        this.setState({
           showdata : this.displayData,
           postVal : "",
           nData : this.noteData,
           tData : this.titleData,
           dData: this.dict
      }); 
    })
 }

  rteChange = (content, delta, source, editor) => {
    //console.log(editor.getHTML()); // rich text
    //console.log(editor.getText()); // plain text
    //console.log(editor.getLength()); // number of characters
    this.currentText = editor.getText();
  };

  createFreshNote = async (input, title) => {
    let { data, error } = await this.supabase
      .from('notes')
      .insert([
        { note: input,
          noteTitle: title 
        }
      ])
      console.log("This was added: " + data)
      console.log(error)
  }

  saveText = () => {
    this.add_note(this.currentText, this.clickedNote);
    alert('Saved to ' + this.clickedNote);
  }

  deleteText = () => {
    this.delete_note();
    
    // 2) ISSUE 2 - Note gets deleted from backend, but button still displayed sometimes or adding next button gets messed up
    ///This issue probably lies somewhere with how the button is deleted below
    var x, index; 
    for (x = 0; x < this.state.tData.length; x++)
    {
       if (this.state.tData[x] === this.clickedNote)
         index = x;
    }
    
    
    alert('About to delete!!!: ' +  this.clickedNote);
    console.log('There are buttons: ' + this.state.showdata.length);
    if (index >= 0) this.displayData.splice(index, 1);

    //Update the state var
    this.setState({showdata : this.displayData});  
  }

  add_note = async (input, clickedNote) => {
    await this.supabase
      .from('notes')
      .update({ note: input })
      .match({ noteTitle: clickedNote })
      //.eq('noteTitle', clickedNote)
      //.insert([
      //  {note: input}
      //])
      console.log("clicked note was:" + clickedNote)
  }

  delete_note = async () => {
    await this.supabase
    .from('notes')
    .delete('note')
    .match({ noteTitle:this.clickedNote})
  }

  fetch_note = async (title) => {
    let { data, error } = await this.supabase
    .from('notes')
    .select('note')
    .match({noteTitle:title})
    console.log(data)
    console.log(error)
    return data
  }

  fetch_all_notes = async () => {
    let { data, error } = await this.supabase.from('notes').select('*')
    console.log(data)
    console.log(error)
    return data
  }
  
  render() {
    return (
      <div>
        <div className="sideNav">
            <link rel="stylesheet" href="https://www.w3schools.com/w3css/4/w3.css"></link>
            <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/4.7.0/css/font-awesome.min.css"></link>
            <h1 className="title">Notes </h1>

            <div className="newN">
                <button className="newNoteButton" type="button" onClick={this.openForm}> <i className="fa fa-pencil"> </i> </button>
            </div>
            
            
            <div className="windowPopup">
                <div className="formPopup" id="formPopup">
                    <div action="/action_page.php" className="formContainer">
                            <h2>Create New Note: </h2>
                            <form onSubmit={this.handleSubmit} className="formContainer">
                                <label>
                                     Title:
                                    <input id="noteTitle" placeholder="Note 1" type="text" value={this.state.title} onChange={this.handleChange} />
                                </label>
                                    <button type="submit" value="Submit" className="btn" onClick={this.appendData}>Create New Note</button>
                                    <button type="button" className="btn cancel" onClick={this.closeForm}>Cancel</button>
                             </form>                            
                    </div>
                </div>
            </div>

            {/* DISPLAY UP TO 10 NOTES */}
            <div > {this.state.showdata[0]} </div>
            <div > {this.state.showdata[1]} </div>
            <div > {this.state.showdata[2]} </div>
            <div > {this.state.showdata[3]} </div>
            <div > {this.state.showdata[4]} </div>
            <div > {this.state.showdata[5]} </div>
            <div > {this.state.showdata[6]} </div>
            <div > {this.state.showdata[7]} </div>
            <div > {this.state.showdata[8]} </div>
            <div > {this.state.showdata[9]} </div>  

           
        </div>

        <button style={{marginBottom: "10px"}} onClick={this.saveText}>Save</button>
        <button style={{marginBottom: "10px", marginLeft: "20px"}} onClick={this.deleteText}>Delete Note</button>
        
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

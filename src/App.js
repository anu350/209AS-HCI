/**
 * TODO:
 *
 * In toggle question mode:
 * - If clicks Q before selecting note:
 * ---- pop-up message saying you have to select a note first
 * - check note completion
 * ---- if too small, display pop-up message saying it is too short
 */
 import "./App.css";
 import React, { useState } from "react";
 import NoteList from "./components/NoteList";
 import TopBar from "./components/TopBar";
 import Settings from "./components/Settings";
 import QuestionContainer from "./components/QuestionContainer";
 import QEditor from "./components/QEditor";
 import Quiz from "./components/Quiz";
 import MyEditor from "./components/DraftNote";
import QuizContainer from "./components/QuizContainer";
 
 function App() {
   const [showSettings, setShowSettings] = useState(false);
   const [questionMode, setQuestionMode] = useState(false);
   const [currentNoteId, setCurrentNoteId] = useState("");
   const [currentFullNote, setCurrentFullNote] = useState({});
   const togglesettings = () => {
     console.log("open settings function called in App.js");
     setShowSettings(!showSettings);
     console.log("show settings: ", showSettings);
   };
   const togglequestionmode = () => {
     // ADD ------------------------------------
     // checks to verify note completeness so question gen will work
     if (!currentNoteId) {
       console.log("you have to select a note first"); // ---------- make this a pop up message
       return;
     }
     if (questionMode) {
       document.body.style.backgroundColor = "white";
     } else {
       document.body.style.backgroundColor = "lightgray";
     }
     console.log("toggled q mode in app.js");
     setQuestionMode(!questionMode);
   };
   const retrieveId = (noteid) => {
     console.log("App.js noteid:, ", noteid);
     setCurrentNoteId(noteid);
   };
   const retrieveFullNote = (fullnote) => {
     console.log("App.js fullnote:, ", fullnote);
     setCurrentFullNote(fullnote);
   };
   return (
     <div style={styles.root}>
       {showSettings ? (
         <Settings
           togglesettings={togglesettings}
           togglequestionmode={togglequestionmode}
         />
       ) : null}
       <div>
         <TopBar
           togglesettings={togglesettings}
           togglequestionmode={togglequestionmode}
         />
       </div>
       {questionMode ? (
         <div style={styles.qmode}>
         {/*  <QuizContainer />  */}

          <Quiz noteId={currentNoteId}
                fullnote={currentFullNote} //pass in a title var too so button can have the title
       />
         </div>  
       ) : (
         <div style={styles.noteContainer}>
           <NoteList
             retrieveId={retrieveId}
             retrieveFullNote={retrieveFullNote}
             persistNoteId={currentNoteId}
             persistFullNote={currentFullNote}
           />
         </div>
       )}
     </div>
   );
 }
 const styles = {
   qeditor: {
     flex: "1 1 0",
   },
   qcontainer: {
     flex: "1 1 0",
   },
   qmode: {
     display: "flex",
     flexMode: "row",
   },
   root: {
     paddingLeft: 10,
     paddingRight: 10,
   },
   noteContainer: {
     width: "100%",
     height: "88vh",
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
   noteEditor: {
     zIndex: 900,
     fontFamily: "'Helvetica', sans-serif",
     paddingRight: 20,
     paddingLeft: 20,
   },
 
 };
 export default App;
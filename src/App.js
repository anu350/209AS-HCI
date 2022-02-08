/**
 *
 */

import "./App.css";
import React, { useState } from "react";
import NoteList from "./components/NoteList";
import TopBar from "./components/TopBar";
import Settings from "./components/Settings";
import QuestionContainer from "./components/QuestionContainer";

function App() {
  const [showSettings, setShowSettings] = useState(false);
  const [questionMode, setQuestionMode] = useState(false);
  const [currentNoteId, setCurrentNoteId] = useState("");

  const togglesettings = () => {
    console.log("open settings function called in App.js");
    setShowSettings(!showSettings);
    console.log("show settings: ", showSettings);
  };

  const togglequestionmode = () => {
    if (!currentNoteId) {
      console.log("you have to select a note first");
      return;
    }
    console.log("toggled q mode in app.js");
    setQuestionMode(!questionMode);
    // console.log("show question: ", questionMode); // the console.log prints before the state has actually been toggled
  };

  const retrieveId = (noteid) => {
    console.log("App.js noteid:, ", noteid);
    setCurrentNoteId(noteid);
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
        <QuestionContainer noteId={currentNoteId} />
      ) : (
        <div style={styles.noteContainer}>
          <NoteList retrieveId={retrieveId} persistNoteId={currentNoteId} />
        </div>
      )}
    </div>
  );
}

const styles = {
  root: {
    // minHeight: "100vh",
    paddingLeft: 20,
    paddingRight: 20,
  },
  noteContainer: {
    width: "100%",
    height: "88vh",
    // borderStyle: "solid",
    // borderWidth: "5px",
    // borderColor: "red",
  },
};

export default App;

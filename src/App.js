/** So...
 * need to connect w DB
 *
 * TODO:
 * - improve design
 * - add search/filter
 */

import "./App.css";
// import MinimalTextEditor from "./components/MinimalNote";
import React from "react";
import MyEditor from "./components/DraftNote";
import Container from "@mui/material/Container";
import NoteList from "./components/NoteList";

function App() {
  return (
    <Container>
      <h1 style={{ color: "red" }}>notesmart</h1>
      {/* <MinimalTextEditor /> */}
      <div style={styles.generalApp}>
        {/* display side notes */}
        <div style={styles.noteList}>
          <NoteList />
        </div>
        <MyEditor />
      </div>
    </Container>
  );
}

const styles = {
  noteList: {
    // padding: 10,
    width: "30%",
    borderStyle: "solid",
    borderWidth: "5px",
    borderColor: "red",
    overflowY: "auto",
  },
  generalApp: {
    display: "flex",
    flexDirection: "row",
    height: "30em",
  },
};

export default App;

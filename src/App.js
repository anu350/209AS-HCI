/** So...
 * need to connect w DB
 *
 * TODO:
 * - improve design
 */

import "./App.css";
// import MinimalTextEditor from "./components/MinimalNote";
import React from "react";
import Container from "@mui/material/Container";
import NoteList from "./components/NoteList";

function App() {
  return (
    <Container>
      <h1 style={{ color: "red" }}>notesmart</h1>
      {/* <MinimalTextEditor /> */}
      <div style={styles.rootContainer}>
        <NoteList />
      </div>
    </Container>
  );
}

const styles = {
  rootContainer: {
    width: "100%",
    borderStyle: "solid",
    borderWidth: "5px",
    borderColor: "red",
  },
};

export default App;

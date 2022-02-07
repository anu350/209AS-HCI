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
import TopBar from "./components/TopBar";

function App() {
  const myfunction = () => {
    console.log("printing in App.js");
  };

  return (
    // <Container maxWidth={"xl"}>
    <div style={styles.root}>
      <div>
        {/* <h1 style={{ color: "red" }}>notesmart</h1> */}
        <TopBar functionfromabove={myfunction} />
      </div>
      <div style={styles.noteContainer}>
        <NoteList />
      </div>
      {/* </Container> */}
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

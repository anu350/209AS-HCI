/**
 * Very rough but visually there.
 * Missing actual functionality
 * Will need to define what hyperparams we will implement.
 */

import React from "react";

export default function Settings(props) {
  return (
    <div style={styles.wholemenu}>
      <div style={styles.topmenu}>
        <h2>settings</h2>
        <button style={styles.exitbutton} onClick={props.togglesettings}>
          X
        </button>
      </div>
      <div style={styles.buttoncontainer}>
        <h4>global settings go here...</h4>
        {/* <h4>
          level of detail <span>on/off</span>
        </h4>
        <h4>feedback on/off</h4> */}
      </div>
    </div>
  );
}

const styles = {
  wholemenu: {
    zIndex: 950,
    paddingTop: "10%",
    paddingLeft: "10vw",
    position: "absolute",
    backgroundColor: "rgba(255, 255, 255, 0.6)",
    width: "60vw",
    height: "80vh",
    fontFamily: "Helvetica",
    fontSize: "50px",
    fontWeight: "bold",
    color: "var(--theme-highlights-border-color)",
    display: "flex",
    flexDirection: "column",
    textAlign: "left",
  },
  topmenu: {
    display: "flex",
    direction: "row",
  },
  buttoncontainer: {
    color: "black",
    textAlign: "left",
  },
  exitbutton: {
    marginLeft: "10%",
    height: "50%",
    width: "10%",
    backgroundColor: "rgba(0,0,0,0)",
    borderStyle: "none",
    fontSize: "50px",
    cursor: "pointer",
  },
};

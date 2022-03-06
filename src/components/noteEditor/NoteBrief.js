/**
 * The little card you see on the side.
 * This is just the container - the DB query happens in '/components/NoteList.js'
 */

import React from "react";
import { supabase } from "../../lib/supabaseClient";
import "./NoteBrief.css";

const getDate = (raw_timestamp) => {
  // console.log(raw_timestamp);                        // raw format: 2022-02-01T10:03:04+00:00
  let date = new Date(raw_timestamp.replace(" ", "T"));
  return date.toDateString().substring(0, 10);
};

export default function NoteBrief(props) {
  const deleteNote = async () => {
    try {
      await supabase.from("notes").delete().match({ id: props.note.id });
      // console.log("deleted note with id", props.note.id);
      props.reloadfunc(); // reloads parent
    } catch (error) {
      console.log("error deleting", error);
    }
  };

  return (
    <div style={styles.notebriefContainer}>
      <button className="delete-button" onClick={deleteNote}>
        delete
      </button>
      <div style={styles.flexBriefHeader}>
        <div>
          {props.note.title ? (
            <h3>{props.note.title}</h3>
          ) : (
            <h3>Untitled Note</h3> // should be unnecessary now that DB never saves untitled file.
          )}
        </div>
        <div style={{ marginLeft: "auto" }}>
          <p>{getDate(props.note.created_at)}</p>
        </div>
      </div>

      <hr />
      {props.note.note ? <p> {props.note.note}</p> : <p></p>}
    </div>
  );
}

const styles = {
  notebriefContainer: {
    padding: 20,
    // minWidth: "20%",
    borderStyle: "solid",
    borderWidth: "1px",
    borderColor: "blue",
    height: "120px",
  },
  flexBriefHeader: {
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
    height: "45px",
    // width: "100px",
  },
};

/**
 * The little card you see on the side.
 * This is just the container - the DB query happens in '/components/NoteList.js'
 *
 * Latest change:
 * - delete works (refers to notes by id)
 * - but needs to refresh site. -- could be automatic if we call FetchNotes() from NoteList.js
 *
 * *************** TODO:
 * - implement edit button onClick
 *
 */

import React from "react";
import { supabase } from "../lib/supabaseClient";

const getDate = (raw_timestamp) => {
  // console.log(raw_timestamp);                        // raw format: 2022-02-01T10:03:04+00:00
  let date = new Date(raw_timestamp.replace(" ", "T"));
  return date.toDateString().substring(0, 10);
};

export default function NoteBrief(props) {
  const deleteNote = async () => {
    try {
      await supabase.from("notes").delete().match({ id: props.note.id });
      // setNotes(notes.filter((x) => x.id !== id));
      console.log("deleted note with id", props.note.id);
      // ******* TODO: RELOAD HERE! ***********
    } catch (error) {
      console.log("error deleting", error);
    }
  };

  // const editNote = () => {
  //   // ********** TODO: IMPLEMENT W REF coming from NoteList ***************
  //   // https://stackoverflow.com/questions/42323279/react-triggering-a-component-method-from-another-component-both-belonging-in
  //   console.log("selecting note to edit with id", props.note.id);
  // };

  return (
    <div style={styles.notebriefContainer}>
      {/* <button onClick={editNote}>edit</button> */}
      <button onClick={deleteNote}>delete</button>
      <div style={styles.flexBriefHeader}>
        <div>
          {props.note.title ? (
            <h3>{props.note.title}</h3>
          ) : (
            <h3>Untitled Note</h3>
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
    borderWidth: "3px",
    borderColor: "grey",
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

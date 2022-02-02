/**
 * Recent change:
 * - Moved DraftNote into this component
 *
 * TODO:
 * - declare a ref in here to keep track of which is the activeEdit note
 * -- this would be triggered inside of a notebrief's edit button
 * -- ref would allow it to surface to NoteList so then it can update the DraftNote id to fetch
 * https://stackoverflow.com/questions/42323279/react-triggering-a-component-method-from-another-component-both-belonging-in
 */

import React, { useState, useEffect } from "react";
import { supabase } from "../lib/supabaseClient";
import DraftNote from "./DraftNote";
import NoteBrief from "./NoteBrief";

export default function NoteList() {
  const [notes, setNotes] = useState([]);

  useEffect(() => {
    fetchNotes().catch(console.error);
  }, []);

  const fetchNotes = async () => {
    let { data: notes, error } = await supabase
      .from("notes")
      .select("*")
      .order("created_at", { ascending: false }); // <----------- parametrize to let user pick sorting method
    if (error) console.log("error fetching", error);
    else setNotes(notes);
  };

  const addNote = async () => {
    console.log("call method to add note");
    const creation_time = new Date().toISOString();

    // create new empty note -- and focus on editor side
    let { error } = await supabase.from("notes").insert({
      created_at: creation_time,
      last_edit_time: creation_time,
      title: "",
      note: "",
    }); //key vals for DB
    if (error) {
      console.log("error in addNote ", error);
    } else {
      fetchNotes().catch(console.error);
    }
  };

  return (
    <div style={style.generalApp}>
      <div style={style.noteList}>
        <button onClick={addNote}>new note</button>
        {notes.length ? (
          notes.map((note) => <NoteBrief key={note.id} note={note} />)
        ) : (
          <span className={"h-full flex justify-center items-center"}>
            You do have any notes yet!
          </span>
        )}
      </div>
      <DraftNote />
    </div>
  );
}

const style = {
  generalApp: {
    display: "flex",
    flexDirection: "row",
    height: "30em",
  },
  noteList: {
    width: "30%",
    borderStyle: "solid",
    borderWidth: "5px",
    borderColor: "red",
    overflowY: "auto",
  },
};

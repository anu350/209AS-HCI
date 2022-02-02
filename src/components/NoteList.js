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

export default function NoteList(note) {
  const [notes, setNotes] = useState([]);
  const [id, setId] = useState("");
  const [notenumber, setNotenumber] = useState(0);
  // let counter;
  // const itemsRef = useRef([]);
  // const editorRef = useRef();
  // you can access the elements with itemsRef.current[n]

  useEffect(() => {
    fetchNotes().catch(console.error);
  });

  const focusNote = (newid) => {
    // console.log("infocusnote newid:", newid);
    // console.log("infocusnote oldid:", id);
    setId(newid);
    // editorRef.current.doSomething(id);
  };

  const fetchNotes = async () => {
    let { data: notes, error } = await supabase
      .from("notes")
      .select("*")
      .order("created_at", { ascending: false }); // <----------- parametrize to let user pick sorting method
    if (error) console.log("error fetching", error);
    else setNotes(notes);
  };

  const addNote = async () => {
    // console.log("call method to add note");
    const creation_time = new Date().toISOString();
    setNotenumber(notenumber + 1);
    console.log("counter", notenumber);

    // create new empty note -- and focus on editor side
    let { data, error } = await supabase.from("notes").insert({
      created_at: creation_time,
      last_edit_time: creation_time,
      title: "Untitled Note" + notenumber,
      note: "",
    }); //key vals for DB
    if (error) {
      console.log("error in addNote ", error);
    } else {
      fetchNotes().catch(console.error);
      setId(data.id);
    }
  };

  return (
    <div style={style.generalApp}>
      <div style={style.noteList}>
        <button onClick={addNote}>new note</button>
        {notes.length ? (
          notes.map((note, i) => (
            <div>
              <div>
                <button
                  // ref={(el) => (itemsRef.current[i] = el)}
                  onClick={() => focusNote(note.id)}
                >
                  edit
                </button>
              </div>
              <NoteBrief key={note.id} note={note} />
            </div>
          ))
        ) : (
          <span className={"h-full flex justify-center items-center"}>
            You do have any notes yet!
          </span>
        )}
      </div>
      {/*******  THIS IS THE WRONG WAY TO UPDATE COMPONENT _ WILL MOST LIKELY NEED TO FIX ******/}
      <DraftNote key={id} id={id} />
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

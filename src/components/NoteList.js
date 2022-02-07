/**
 * 02.04.2022
 *
 * Recent change:
 * - most of it works, some interacion hiccups here and there
 *
 */

import React, { useState, useEffect } from "react";
import { supabase } from "../lib/supabaseClient";
import MyEditor from "./DraftNote";
import NoteBrief from "./NoteBrief";

export default function NoteList() {
  const [notes, setNotes] = useState([]);
  const [currentNote, setCurrentNote] = useState({});

  // This is called the first time component loads!
  useEffect(() => {
    fetchNotes();
    if (notes.length) {
      console.log("notelist/usefect notes", notes);
      setCurrentNote(notes[0]);
      console.log("currentnote: ", currentNote);
    }
  }, []);

  // This is called everytime currentNote changes -- via a setCurrentNote() call
  useEffect(() => {
    console.log("in effect of currnote: ", currentNote);
    // call to rerender draftnote here
  }, [currentNote]);

  const noteHover = (event) => {
    event.target.style.color = "purple";
    // event.target.style.backgroundColor = "#ebebeb";
  };

  const stopNoteHover = (event) => {
    event.target.style.color = "";
    // event.target.style.backgroundColor = "";
  };

  const briefClick = (clickedId) => {
    let thenote = notes.find((n) => n.id === clickedId);
    setCurrentNote(thenote);
  };

  const triggerReload = () => {
    console.log("triggered reload in nodelist");
    fetchNotes().catch(console.error);
    setCurrentNote(notes[0]);
  };

  const fetchNotes = async () => {
    let { data: newnotes, error } = await supabase
      .from("notes")
      .select("*")
      .order("last_edit_time", { ascending: false }); // <----------- parametrize to let user pick sorting method
    if (error) console.log("error fetching", error);
    else {
      // console.log("in fetchnotes:", newnotes);
      setNotes(newnotes);
      // setCurrentNote(notes[0]);
    }
  };

  const addNote = async () => {
    const creation_time = new Date().toISOString();
    // create new empty note -- reloads side notelist + and changes currentNote to the newnote
    let { data, error } = await supabase.from("notes").insert({
      created_at: creation_time,
      last_edit_time: creation_time,
      title: "Untitled Note",
      note: "",
    }); //key vals for DB

    if (error) {
      console.log("error in addNote ", error);
    } else {
      fetchNotes().catch(console.error);
      // let thenote = notes.find((n) => n.id === data[0].id);
      // setCurrentNote(notes[0]);
    }
  };

  return (
    <div style={style.generalApp}>
      <div style={style.leftBar}>
        <div style={style.searchBar}>
          <button style={style.newNote} onClick={addNote}>
            +
          </button>
        </div>
        <div style={style.noteList}>
          {notes.length ? (
            notes.map((note) => (
              <div>
                <div
                  onMouseEnter={noteHover}
                  onMouseLeave={stopNoteHover}
                  onClick={() => briefClick(note.id)}
                >
                  <NoteBrief
                    key={note.id}
                    note={note}
                    reloadfunc={triggerReload}
                  />
                </div>
              </div>
            ))
          ) : (
            <span className={"h-full flex justify-center items-center"}>
              You don't have any notes yet!
            </span>
          )}
        </div>
      </div>
      <MyEditor note={currentNote} key={"note" + currentNote.id} />
    </div>
  );
}

const style = {
  newNote: {
    height: "40px",
    width: "40px",
    fontSize: "26px",
    padding: "0px",
  },
  generalApp: {
    display: "flex",
    flexDirection: "row",
    height: "95%",
  },
  leftBar: {
    display: "flex",
    flexDirection: "column",
    borderStyle: "solid",
    borderWidth: "7px",
    borderColor: "rgba(255,0,0,0.3)",
    maxWidth: "25vw",
    minWidth: "300px",
    width: "360px",
  },
  searchBar: {
    display: "flex",
    flexDirection: "row-reverse",
    height: "50px",
  },
  noteList: {
    width: "100%",
    cursor: "pointer",
    borderTop: "solid 1px blue",
    borderBottom: "solid 1px blue",
    // borderStyle: "solid",
    // borderWidth: "5px",
    // borderColor: "red",
    overflowY: "auto",
  },
};

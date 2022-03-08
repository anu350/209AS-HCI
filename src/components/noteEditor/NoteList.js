/**
 * 02.04.2022
 *
 * Recent change:
 * - most of it works, some interacion hiccups here and there
 *
 */

import React, { useState, useEffect } from "react";
import { supabase } from "../../lib/supabaseClient";
import MyEditor from "./DraftNote";
import NoteBrief from "./NoteBrief";
import "./NoteList.css";

export default function NoteList(props) {
  const [notes, setNotes] = useState([]);
  const [currentNote, setCurrentNote] = useState({});

  // This is called the first time component loads!
  useEffect(() => {
    fetchNotes();

    if (props.persistFullNote) {
      setCurrentNote(props.persistFullNote);
    } else if (notes.length) {
      console.log("notelist/usefect notes", notes);
      setCurrentNote(notes[0]);
      console.log("currentnote: ", currentNote);
    }
  }, []);

  // This is called everytime currentNote changes -- via a setCurrentNote() call
  useEffect(() => {}, [currentNote]);

  const briefClick = (clickedId) => {
    let thenote = notes.find((n) => n.id === clickedId);
    setCurrentNote(thenote);
    props.retrieveId(clickedId);
    props.retrieveFullNote(thenote);
  };

  const triggerReload = () => {
    fetchNotes().catch(console.error);
    setCurrentNote(notes[0]);
  };

  const fetchNotes = async () => {
    let { data: newnotes, error } = await supabase
      .from("notes")
      .select("*")
      .order("last_edit_time", { ascending: false }); // <----------- could parametrize to let user pick sorting method
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
    let { error } = await supabase.from("notes").insert({
      created_at: creation_time,
      last_edit_time: creation_time,
      title: "Untitled Note",
      note: "",
      wordcount: 0,
    }); //key vals for DB

    if (error) {
      console.log("error in addNote ", error);
    } else {
      fetchNotes().catch(console.error);
    }
  };

  return (
    <div style={style.generalApp}>
      <div className="leftbar-container" style={style.leftBar}>
        <div className="searchbar-container" style={style.searchBar}>
          <button className="newnote-button" onClick={addNote}>
            +
          </button>
        </div>
        <div className="notebriefscontainer" style={style.noteList}>
          {notes.length ? (
            notes.map((note) => (
              <div
                className="notebrief-each"
                onClick={() => briefClick(note.id)}
              >
                <NoteBrief
                  key={note.id}
                  note={note}
                  reloadfunc={triggerReload}
                />
              </div>
            ))
          ) : (
            <span>You don't have any notes yet!</span>
          )}
        </div>
      </div>
      {props.question}
      <MyEditor
        note={currentNote}
        key={"note" + currentNote.id}
        updatecallback={fetchNotes}
        wordcount={currentNote.wordcount}
      />
    </div>
  );
}

const style = {
  newNote: {
    height: "40px",
    width: "40px",
    fontSize: "26px",
    padding: "0px",
    marginRight: "2.5px",
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
    borderColor: "var(--theme-highlights-boxshadow-color)",
    // maxWidth: "25vw",
    minWidth: "340px",
    width: "360px",
  },
  searchBar: {
    display: "flex",
    flexDirection: "row-reverse",
    height: "50px",
    alignItems: "center",
    backgroundColor: "var(--theme-highlights-light-color)",
  },
  noteList: {
    width: "100%",
    height: "100%",
    cursor: "pointer",
    overflowY: "auto",
  },
};

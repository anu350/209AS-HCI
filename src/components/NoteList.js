/**
 * TODO:
 * - modular query  options for supabase, sqlite, diy+flask?
 * - highlight selected Note
 * - add button at the top for creating a new note
 */

import React, { useState, useEffect } from "react";
import { supabase } from "../lib/supabaseClient";
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

  const deleteNote = async (id) => {
    try {
      await supabase.from("notes").delete().eq("id", id);
      setNotes(notes.filter((x) => x.id !== id));
    } catch (error) {
      console.log("error deleting", error);
    }
  };

  const addNote = async () => {
    console.log("call method to add note");
    // create new empty note -- and focus on editor side
  };

  return (
    <div>
      <div>
        <button onClick={addNote}>new note</button>
        <button>filter</button>
        <button>search</button>
      </div>

      <div>
        {notes.length ? (
          notes.map((note) => (
            <NoteBrief
              key={note.id}
              note={note}
              onDelete={() => deleteNote(note.id)}
            />
          ))
        ) : (
          <span className={"h-full flex justify-center items-center"}>
            You do have any tasks yet!
          </span>
        )}
      </div>
    </div>
  );
}
